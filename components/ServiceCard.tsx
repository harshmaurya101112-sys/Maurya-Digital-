
import React from 'react';
import { Service, CategoryCode } from '../types';
import { ICON_MAP } from '../constants';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getCategoryColor = (cat: CategoryCode) => {
    switch (cat) {
      case 'G2C': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Bank': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Edu': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Util': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-start transition-all transform active:scale-90"
      aria-label={`${service.name} service link`}
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl border transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-1 ${getCategoryColor(service.cat)} mb-2.5`}>
        {React.cloneElement(ICON_MAP[service.iconName] as React.ReactElement, { 
          className: "w-7 h-7 md:w-8 md:h-8 stroke-[1.8px]" 
        })}
      </div>
      <span className="text-[10px] md:text-[11px] font-bold text-gray-600 text-center line-clamp-2 leading-tight px-1 group-hover:text-gray-900 transition-colors">
        {service.name}
      </span>
    </a>
  );
};

export default ServiceCard;
