"use client";
import { ReactNode } from "react";

interface LiquidGlassCardProps {
  children: ReactNode;
  tintColor?: string;
  className?: string;
  pulse?: boolean;
}

export const LiquidGlassCard = ({ children, tintColor = "rgba(93,5,153,0.35)", className = "", pulse = false }: LiquidGlassCardProps) => {
  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
            <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
            <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
            <fePointLight x={-200} y={-200} z={300} />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale={77} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className={`relative overflow-hidden rounded-[28px] ${pulse ? "animate-glass-heartbeat" : ""} ${className}`}
           style={{ boxShadow: "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)" }}>
        <div className="absolute inset-0 z-0" style={{ backdropFilter: "blur(3px)", filter: "url(#glass-distortion)" }} />
        <div className="absolute inset-0 z-[1]" style={{ background: tintColor }} />
        <div className="absolute inset-0 z-[2]" style={{ boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)" }} />
        <div className="relative z-[3]">
          {children}
        </div>
      </div>
    </>
  );
};