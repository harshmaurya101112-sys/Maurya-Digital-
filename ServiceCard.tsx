
import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white group relative p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform active:scale-95"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-white" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 leading-tight line-clamp-2">
          {service.name}
        </h3>
        <p className="text-[10px] text-gray-400 mt-2 font-semibold uppercase tracking-wider">
          GO TO PORTAL
        </p>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-blue-600 rounded-b-2xl transition-all"></div>
    </a>
  );
};

export default ServiceCard;
