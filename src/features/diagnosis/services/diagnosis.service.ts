import { GoogleGenAI } from '@google/genai';
import { db, auth } from '../../../services/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { Message, OperationType, FirestoreErrorInfo } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const DiagnosisService = {
  async deleteMessage(messageId: string) {
    try {
      await deleteDoc(doc(db, 'ai_history', messageId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ai_history/${messageId}`);
    }
  },

  async clearHistory(userId: string) {
    try {
      const q = query(collection(db, 'ai_history'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'ai_history');
    }
  },

  getHistory(userId: string, callback: (messages: (Message & { id: string })[]) => void) {
    const q = query(
      collection(db, 'ai_history'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const historyMessages: (Message & { id: string })[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role as 'user' | 'model',
          text: data.text || '',
          image: data.image || undefined,
          plantName: data.plantName,
          diseaseName: data.diseaseName,
          scientificName: data.scientificName,
        };
      });
      callback(historyMessages);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'ai_history');
    });
  },

  async saveMessage(userId: string, message: Message) {
    try {
      let imageToSave = message.image || null;
      // Firestore limit is 1MB. Truncate to ~500KB to be safe.
      if (imageToSave && imageToSave.length > 500000) {
        console.warn('Image too large, truncating.');
        imageToSave = imageToSave.substring(0, 500000);
      }
      
      await addDoc(collection(db, 'ai_history'), {
        userId,
        role: message.role,
        text: message.text,
        image: imageToSave,
        plantName: message.plantName || null,
        diseaseName: message.diseaseName || null,
        scientificName: message.scientificName || null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'ai_history');
    }
  },

  async generateAIResponse(history: Message[], userMessage: Message, systemInstruction: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const model = 'gemini-3-flash-preview';
    
    const chatHistory = history.slice(-10).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const currentParts: any[] = [{ text: userMessage.text || 'Analyze this plant.' }];
    if (userMessage.image) {
      currentParts.push({
        inlineData: {
          data: userMessage.image.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: systemInstruction + `\n\nReturn the response in JSON format with the following structure:
        {
          "plantName": "string",
          "diseaseName": "string",
          "scientificName": "string",
          "text": "string (the full diagnosis and recommendations in Markdown)"
        }`,
        temperature: 0.7,
      },
    });

    try {
      let text = response.text || '{}';
      // Remove markdown code block formatting if present
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const jsonResponse = JSON.parse(text);
      
      // Construct a clean, human-readable text from the JSON fields
      let cleanText = jsonResponse.text || '';
      if (jsonResponse.plantName || jsonResponse.diseaseName || jsonResponse.scientificName) {
        let details = '\n\n### Diagnosis Details:\n';
        if (jsonResponse.plantName) details += `- **Plant:** ${jsonResponse.plantName}\n`;
        if (jsonResponse.diseaseName) details += `- **Disease:** ${jsonResponse.diseaseName}\n`;
        if (jsonResponse.scientificName) details += `- **Scientific Name:** ${jsonResponse.scientificName}\n`;
        cleanText = details + '\n' + cleanText;
      }

      return {
        text: cleanText,
        plantName: jsonResponse.plantName,
        diseaseName: jsonResponse.diseaseName,
        scientificName: jsonResponse.scientificName
      };
    } catch (e) {
      // Fallback: return raw text if parsing fails
      return { text: response.text || '', plantName: undefined, diseaseName: undefined, scientificName: undefined };
    }
  }
};
