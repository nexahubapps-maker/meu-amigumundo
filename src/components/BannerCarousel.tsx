"use client";

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const banners = [
  { id: 1, url: "https://images.unsplash.com/photo-1603356033288-acfcb570bbce?q=80&w=1200&auto=format&fit=crop", title: "Novas Receitas" },
  { id: 2, url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1200&auto=format&fit=crop", title: "Packs Exclusivos" },
  { id: 3, url: "https://images.unsplash.com/photo-1615486511484-92e172cc4ee0?q=80&w=1200&auto=format&fit=crop", title: "Mundo Amigurumi" },
];

export const BannerCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg my-4 mx-4 sm:mx-0" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner) => (
          <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-[180px] sm:h-[300px]">
            <img 
              src={banner.url} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-black text-xl sm:text-3xl uppercase italic tracking-tighter">
                {banner.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? 'w-6 bg-[#F8DD12]' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};