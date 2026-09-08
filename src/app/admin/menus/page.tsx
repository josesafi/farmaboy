"use client";

import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  X,
  CheckCircle,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
  order: number;
}

const initialNavItems: MenuItem[] = [
  { id: "m1", label: "Medicamentos", href: "/medicamentos", isExternal: false, order: 1 },
  { id: "m2", label: "Cuidado Personal", href: "/cuidado-personal", isExternal: false, order: 2 },
  { id: "m3", label: "Insumos Hospitalarios", href: "/insumos-hospitalarios", isExternal: false, order: 3 },
  { id: "m4", label: "Servicios Asistenciales", href: "/servicios-asistenciales", isExternal: false, order: 4 },
  { id: "m5", label: "Transporte Asistencial", href: "/transporte-asistencial", isExternal: false, order: 5 },
  { id: "m6", label: "Empresas & B2B", href: "/empresas", isExternal: false, order: 6 },
  { id: "m7", label: "Nosotros", href: "/nosotros", isExternal: false, order: 7 },
  { id: "m8", label: "Contacto", href: "/contacto", isExternal: false, order: 8 },
];

export default function AdminMenusPage() {
  const { showToast, logActivity, hasPermission } = useAdminStore();
  const canWrite = hasPermission("diseno:write");

  const [items, setItems] = useState<MenuItem[]>(initialNavItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Omit<MenuItem, "id">>({
    label: "",
    href: "/",
    isExternal: false,
    order: items.length + 1,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it)));
      showToast("Enlace de menú actualizado", "success");
    } else {
      const newItem: MenuItem = { ...formData, id: "menu-" + Date.now() };
      setItems((prev) => [...prev, newItem]);
      showToast("Nuevo enlace agregado al menú", "success");
    }
    logActivity("Navegación", "Menú Principal", "Modificada la estructura de enlaces");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast("Enlace eliminado del menú", "info");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <MenuIcon className="w-5 h-5 text-emerald-400" />
            Gestión de Menús & Enlaces de Navegación
          </h2>
          <p className="text-xs text-slate-400">
            Organiza la barra principal superior y accesos de pie de página de la farmacia
          </p>
        </div>

        {canWrite && (
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ label: "", href: "/", isExternal: false, order: items.length + 1 });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Enlace</span>
          </button>
        )}
      </div>

      {/* Menu Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Orden</th>
              <th className="py-3.5 px-3 font-semibold">Texto Visible</th>
              <th className="py-3.5 px-3 font-semibold">Ruta / URL Destino</th>
              <th className="py-3.5 px-3 font-semibold">Tipo de Enlace</th>
              <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-bold text-slate-400">#{item.order || idx + 1}</td>
                <td className="py-3.5 px-3 font-bold text-white">{item.label}</td>
                <td className="py-3.5 px-3 font-mono text-emerald-400">{item.href}</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {item.isExternal ? "Externo" : "Interno"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {canWrite && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({ ...item });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingItem ? "Editar Enlace" : "Nuevo Enlace de Menú"}
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
                <label className="block text-slate-300 font-bold mb-1">Texto del Enlace *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ej. Ofertas Especiales"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ruta de Destino *</label>
                <input
                  type="text"
                  required
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/medicamentos o https://..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Número de Orden</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo</label>
                  <select
                    value={formData.isExternal ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, isExternal: e.target.value === "true" })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="false">Interno (Ruta local)</option>
                    <option value="true">Externo (Nueva pestaña)</option>
                  </select>
                </div>
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
