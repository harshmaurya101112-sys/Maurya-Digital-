import React from 'react';
import { ArrowRight } from 'lucide-react';
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
      className="bg-white group relative p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform active:scale-95 overflow-hidden"
    >
      {/* Top Section: Service Name */}
      <div className="z-10">
        <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 leading-tight line-clamp-2">
          {service.name}
        </h3>
        <p className="text-[9px] text-gray-400 mt-1 font-semibold uppercase tracking-widest">
          PORTAL LINK
        </p>
      </div>

      {/* Bottom Corner Arrow */}
      <div className="flex justify-end items-end mt-4">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-[-45deg] transition-all duration-300">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
        </div>
      </div>
      
      {/* Decorative Corner Background (Optional) */}
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
    </a>
  );
};

export default ServiceCard;
