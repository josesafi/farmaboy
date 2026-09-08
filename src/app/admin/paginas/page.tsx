"use client";

import React, { useState } from "react";
import {
  FileCode,
  Edit2,
  Eye,
  ExternalLink,
  CheckCircle,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastUpdated: string;
  isPublished: boolean;
}

const initialPages: StaticPage[] = [
  { id: "p1", title: "Nosotros / Quiénes Somos", slug: "/nosotros", description: "Historia, valores farmacéuticos y cobertura en Boyacá", lastUpdated: "Hoy", isPublished: true },
  { id: "p2", title: "Servicios Asistenciales", slug: "/servicios-asistenciales", description: "Toma de tensión, inyectología y orientación en salud", lastUpdated: "Ayer", isPublished: true },
  { id: "p3", title: "Transporte Asistencial", slug: "/transporte-asistencial", description: "Ambulancias y traslados de pacientes en Boyacá", lastUpdated: "02 Sep", isPublished: true },
  { id: "p4", title: "Soluciones para Empresas B2B", slug: "/empresas", description: "Convenios institucionales, IPS y dotaciones médicas", lastUpdated: "01 Sep", isPublished: true },
  { id: "p5", title: "Preguntas Frecuentes (FAQ)", slug: "/#faq", description: "Tiempos de entrega, métodos de pago Wompi y recetas", lastUpdated: "28 Ago", isPublished: true },
  { id: "p6", title: "Términos y Condiciones & Habeas Data", slug: "/terminos", description: "Normativa legal colombiana y protección de datos Ley 1581", lastUpdated: "20 Ago", isPublished: true },
];

export default function AdminPaginasPage() {
  const { showToast, logActivity, hasPermission } = useAdminStore();
  const canWrite = hasPermission("contenido:write");

  const [pages, setPages] = useState<StaticPage[]>(initialPages);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenEdit = (p: StaticPage) => {
    setEditingPage(p);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setPages((prev) => prev.map((p) => (p.id === editingPage.id ? { ...editingPage, lastUpdated: "Ahora" } : p)));
    logActivity("Edición de Página", editingPage.title, "Actualizada información institucional");
    showToast(`Página "${editingPage.title}" actualizada`, "success");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            Páginas Institucionales & Contenido Estático
          </h2>
          <p className="text-xs text-slate-400">
            Administra textos de Nosotros, Políticas de Privacidad, FAQ y Transporte
          </p>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {page.slug}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PUBLICADA
                </span>
              </div>
              <h3 className="font-bold text-white text-sm pt-1">{page.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{page.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500">Editado: {page.lastUpdated}</span>

              <div className="flex items-center gap-1.5">
                <a
                  href={page.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Ver en tienda"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {canWrite && (
                  <button
                    onClick={() => handleOpenEdit(page)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Editar contenido"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                Editar Página: {editingPage.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título de la Página *</label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descripción / Resumen *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPage.description}
                  onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
