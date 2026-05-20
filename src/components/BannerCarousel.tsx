"use client";

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const banners = [
  { 
    id: 1, 
    url: "https://ik.imagekit.io/51b3srlsg/banner_whatsapp_amigumundo.jpeg", 
    title: "WhatsApp AmiguMundo" 
  },
  { 
    id: 2, 
    url: "https://ik.imagekit.io/51b3srlsg/Combo_Colecionadora_Segunda_amigumundo.jpeg", 
    title: "Combo Colecionadora" 
  },
  { 
    id: 3, 
    url: "https://ik.imagekit.io/51b3srlsg/Lan%C3%A7amento_AmiguMundo_50_Receitas_amigumundo.jpeg", 
    title: "Lançamento 50 Receitas" 
  },
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
    <div className="relative overflow-hidden rounded-2xl shadow-md my-4 mx-4 sm:mx-0" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner) => (
          <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 aspect-[16/9] sm:aspect-[21/9]">
            <img 
              src={banner.url} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all ${i === selectedIndex ? 'w-5 bg-[#F8DD12]' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};