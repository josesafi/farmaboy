"use client";

import React, { useState } from "react";
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Pill,
  ShoppingBag,
  Image as ImageIcon,
  FileText,
  Tag,
  Clock,
  User,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminPapeleraPage() {
  const { trash, restoreTrashItem, purgeTrashItem, emptyTrash, hasPermission } = useAdminStore();
  const canManage = hasPermission("super_admin" as any) || hasPermission("all" as any);

  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);
  const [purgeTargetId, setPurgeTargetId] = useState<string | null>(null);

  const entityIcons = {
    MEDICAMENTO: <Pill className="w-4 h-4 text-emerald-400" />,
    PRODUCTO: <ShoppingBag className="w-4 h-4 text-teal-400" />,
    BANNER: <ImageIcon className="w-4 h-4 text-amber-400" />,
    ARTICULO: <FileText className="w-4 h-4 text-indigo-400" />,
    PROMOCION: <Tag className="w-4 h-4 text-rose-400" />,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            Papelera de Reciclaje (Protección Soft Delete)
          </h2>
          <p className="text-xs text-slate-400">
            Los elementos eliminados se conservan aquí de forma segura para permitir su restauración inmediata
          </p>
        </div>

        {trash.length > 0 && (
          <button
            onClick={() => setConfirmEmptyOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Vaciar Papelera ({trash.length})</span>
          </button>
        )}
      </div>

      {/* Trash Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {trash.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-white">La papelera de reciclaje está vacía</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Cuando elimines medicamentos, productos retail, artículos o banners, se conservarán aquí para evitar pérdidas accidentales.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Tipo de Elemento</th>
                  <th className="py-3.5 px-3 font-semibold">Nombre / Título</th>
                  <th className="py-3.5 px-3 font-semibold">Fecha Eliminación</th>
                  <th className="py-3.5 px-3 font-semibold">Eliminado Por</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {trash.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          {entityIcons[item.entityType] || <Trash2 className="w-4 h-4 text-slate-400" />}
                        </div>
                        <span className="font-bold text-slate-300 text-xs">
                          {item.entityType}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-white">{item.title}</td>

                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">{item.deletedAt}</td>

                    <td className="py-3.5 px-3 text-slate-300">{item.deletedBy}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => restoreTrashItem(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restaurar</span>
                        </button>
                        <button
                          onClick={() => setPurgeTargetId(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                          title="Eliminar definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Empty Dialog */}
      <ConfirmDialog
        isOpen={confirmEmptyOpen}
        title="¿Vaciar toda la papelera?"
        message="Esta acción purgará permanentemente todos los elementos de la papelera. No podrás recuperarlos."
        confirmText="Sí, vaciar definitivamente"
        isDanger={true}
        onConfirm={emptyTrash}
        onCancel={() => setConfirmEmptyOpen(false)}
      />

      {/* Confirm Purge Single Item Dialog */}
      <ConfirmDialog
        isOpen={purgeTargetId !== null}
        title="¿Eliminar definitivamente?"
        message="El elemento seleccionado será eliminado de forma permanente de los servidores de Farmaboy."
        confirmText="Purgar para siempre"
        isDanger={true}
        onConfirm={() => {
          if (purgeTargetId) {
            purgeTrashItem(purgeTargetId);
            setPurgeTargetId(null);
          }
        }}
        onCancel={() => setPurgeTargetId(null)}
      />
    </div>
  );
}
