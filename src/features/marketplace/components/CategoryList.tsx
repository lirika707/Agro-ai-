import { Apple, ShoppingBag, Milk, Beef, Sprout, Truck } from 'lucide-react';
import { useI18n } from '../../language/useLanguage';

const categories = [
  { name: 'Фрукты', icon: Apple, color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Овощи', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Молочные', icon: Milk, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Мясо', icon: Beef, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Семена', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Техника', icon: Truck, color: 'text-gray-700', bg: 'bg-gray-100' },
];

export function CategoryList() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">{t('Categories')}</h3>
        <button className="text-green-600 font-medium text-sm">{t('See all')}</button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cat.bg}`}>
              <cat.icon className={cat.color} size={32} />
            </div>
            <span className="text-xs font-bold text-gray-700 uppercase">{t(cat.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
