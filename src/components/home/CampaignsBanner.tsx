"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CampaignsBanner() {
  const { campaigns } = useAdminStore();
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  const activeCampaign = campaigns
    .filter(c => c.status === "ACTIVA")
    .sort((a, b) => a.priority - b.priority)[0]; // Pick highest priority

  useEffect(() => {
    if (!activeCampaign) return;

    const interval = setInterval(() => {
      const end = new Date(activeCampaign.endDate).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCampaign]);

  if (!activeCampaign) return null;

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Banner Info */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-black">{activeCampaign.publicTitle}</h3>
            {activeCampaign.subtitle && (
              <p className="text-emerald-100 text-sm font-medium">{activeCampaign.subtitle}</p>
            )}
          </div>
        </div>

        {/* Countdown & Action */}
        <div className="flex items-center gap-4 flex-col sm:flex-row">
          {timeLeft && (
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider mr-2">Termina en:</span>
              <div className="flex gap-1.5 text-lg font-black font-mono">
                <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-emerald-300/50">:</span>
                <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-emerald-300/50">:</span>
                <span className="text-amber-300">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => router.push("/ofertas")}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Ver Ofertas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
