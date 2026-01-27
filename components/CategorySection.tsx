
import React from 'react';
import { Service, Category } from '../types';
import ServiceCard from './ServiceCard';

interface CategorySectionProps {
  category: Category;
  services: Service[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, services }) => {
  if (services.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between px-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800">{category.title}</h2>
        <span className="text-xs text-gray-500 font-medium">{services.length} सेवाएं</span>
      </div>
      
      <div className="bg-white mx-2 rounded-3xl p-4 shadow-sm border border-gray-100 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-6 gap-x-2">
        {services.map((service, index) => (
          <ServiceCard key={`${service.name}-${index}`} service={service} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
