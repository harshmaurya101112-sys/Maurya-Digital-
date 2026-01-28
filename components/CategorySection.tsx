
import React from 'react';
import { Service, ServiceCategory } from '../types';
import ServiceCard from './ServiceCard';
import { CATEGORY_ICONS } from '../constants';

interface CategorySectionProps {
  category: ServiceCategory;
  services: Service[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, services }) => {
  if (services.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            {CATEGORY_ICONS[category]}
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-gray-800">
            {category}
          </h2>
        </div>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {services.length} सेवाएँ
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {services.map((service, index) => (
          <ServiceCard key={`${service.name}-${index}`} service={service} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
