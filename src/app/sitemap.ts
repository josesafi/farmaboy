import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://farmaboy.com.co";
  const lastModified = new Date();

  const routes = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/productos`, lastModified, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/medicamentos`, lastModified, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/categoria/medicamentos`, lastModified, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/categoria/cuidado-personal`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/categoria/higiene`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/categoria/bebes`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/categoria/vitaminas-y-suplementos`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/insumos-hospitalarios`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/transporte-asistencial`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/servicios`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicios-asistenciales`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/empresas`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/nosotros`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contacto`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/politica-privacidad`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terminos-condiciones`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return routes;
}
