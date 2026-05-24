"use client";

import React from 'react';

const banners = [
  { 
    id: 1, 
    url: "https://ik.imagekit.io/51b3srlsg/banner_quinta_amigumundo.jpeg", 
    title: "Lançamento Quinta-Feira" 
  }
];

export const BannerCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm mt-1 mb-3 mx-4 sm:mx-0">
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
    </div>
  );
};