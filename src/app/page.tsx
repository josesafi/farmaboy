"use client";

import React from "react";
import { PharmacyHero } from "@/components/home/PharmacyHero";
import { PharmacyCategories } from "@/components/home/PharmacyCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { DealsBanners } from "@/components/home/DealsBanners";
import { PharmacyServices } from "@/components/home/PharmacyServices";
import { MuchMoreSection } from "@/components/home/MuchMoreSection";
import { TransportSection } from "@/components/home/TransportSection";
import { B2BSection } from "@/components/home/B2BSection";
import { TrustSection } from "@/components/home/TrustSection";
import { FaqSection } from "@/components/home/FaqSection";
import { QuickContactCta } from "@/components/home/QuickContactCta";
import { CampaignsBanner } from "@/components/home/CampaignsBanner";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function HomePage() {
  const { siteDesign } = useAdminStore();
  const sections = siteDesign?.homepageSections;

  return (
    <>
      {/* 1. HERO FARMACIA: "Tu farmacia de confianza en Boyacá" */}
      {(!sections || sections.hero) && <PharmacyHero />}

      {/* 1.5 CAMPAÑAS ACTIVAS */}
      <CampaignsBanner />

      {/* 2. CATEGORÍAS: "¿Qué estás buscando?" */}
      {(!sections || sections.categories) && <PharmacyCategories />}

      {/* 3. PRODUCTOS DESTACADOS: Catálogo visual e-commerce */}
      {(!sections || sections.featuredProducts) && <FeaturedProducts />}

      {/* 4. OFERTAS / PROMOCIONES: Banners comerciales */}
      {(!sections || sections.dealsBanners) && <DealsBanners />}

      {/* 5. SERVICIOS DE FARMACIA: Toma de tensión, orientación, fórmulas */}
      {(!sections || sections.pharmacyServices) && <PharmacyServices />}

      {/* 6. MUCHO MÁS QUE UNA FARMACIA: Insumos, transporte, asistencia, empresas */}
      {(!sections || sections.muchMore) && <MuchMoreSection />}

      {/* 7. TRANSPORTE ASISTENCIAL: Traslados de pacientes */}
      {(!sections || sections.transportSection) && <TransportSection />}

      {/* 8. EMPRESAS E INSTITUCIONES: Suministro B2B */}
      {(!sections || sections.b2bSection) && <B2BSection />}

      {/* 9. CONFIANZA: "Tu salud, con atención cercana" */}
      {(!sections || sections.trustSection) && <TrustSection />}

      {/* 10. PREGUNTAS FRECUENTES (FAQs) */}
      {(!sections || sections.faqSection) && <FaqSection />}

      {/* 11. CTA WHATSAPP / CONTACTO RÁPIDO */}
      {(!sections || sections.contactCta) && <QuickContactCta />}
    </>
  );
}
