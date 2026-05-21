"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const banners = [
  { 
    id: 1, 
    url: "https://ik.imagekit.io/51b3srlsg/banner_quinta_amigumundo.jpeg", 
    title: "Lançamento Quinta-Feira" 
  },
  { 
    id: 2, 
    url: "https://ik.imagekit.io/51b3srlsg/banner_segunda_amigumundo.jpeg", 
    title: "Combo Colecionadora Segunda" 
  },
];

export const BannerCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 27000); // 27 segundos
  }, [emblaApi]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleInteraction = useCallback(() => {
    stopAutoPlay();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    
    // Reinicia o carrossel automático após 22 segundos de inatividade
    resumeTimeoutRef.current = setTimeout(() => {
      startAutoPlay();
    }, 22000);
  }, [stopAutoPlay, startAutoPlay]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('pointerDown', handleInteraction);

    startAutoPlay();

    return () => {
      stopAutoPlay();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [emblaApi, onSelect, startAutoPlay, stopAutoPlay, handleInteraction]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md mt-1 mb-4 mx-4 sm:mx-0" ref={emblaRef}>
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