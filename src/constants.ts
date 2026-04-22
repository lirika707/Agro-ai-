export const FORUM_STRUCTURE = [
  {
    name: 'Plant Diseases',
    subcategories: ['Pests', 'Fungal', 'Viral']
  },
  {
    name: 'Marketplace',
    subcategories: ['Seeds', 'Equipment', 'Livestock']
  },
  {
    name: 'Tips & Tricks',
    subcategories: ['Organic Farming', 'Hydroponics', 'Traditional']
  },
  {
    name: 'General',
    subcategories: ['Off-topic', 'Introductions', 'Feedback']
  }
];

export const FORUM_CATEGORIES = FORUM_STRUCTURE.map(c => c.name);

export const PRODUCT_CATEGORIES = [
  'Seeds',
  'Equipment',
  'Livestock',
  'Feed',
  'Fertilizers'
];
