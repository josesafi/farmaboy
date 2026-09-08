"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  X,
  Lock,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminUser, AdminRoleName } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const emptyUser: Omit<AdminUser, "id" | "lastLogin"> = {
  name: "",
  email: "",
  role: "FARMACEUTICO",
  isActive: true,
};

export default function AdminUsuariosPage() {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser, currentAdmin, hasPermission } =
    useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState(emptyUser);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canManageUsers = hasPermission("usuarios:write");

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData(emptyUser);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setFormData({ ...u });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateAdminUser(editingUser.id, formData);
    } else {
      addAdminUser(formData);
    }
    setIsModalOpen(false);
  };

  const roleDescriptions: Record<AdminRoleName, string> = {
    SUPER_ADMIN: "Control total del sistema, seguridad, configuraciones y usuarios.",
    ADMIN: "Gestión completa de catálogo, inventario, pedidos y CMS.",
    FARMACEUTICO: "Control de medicamentos, registros INVIMA, lotes y Kardex.",
    VENTAS: "Gestión operativa de pedidos, CRM y despachos en Boyacá.",
    EDITOR: "Publicación de banners, diseño de portada y blog de salud.",
    SOPORTE: "Atención al paciente, consulta de pedidos y soporte.",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Usuarios Administrativos & Control de Roles (RBAC)
          </h2>
          <p className="text-xs text-slate-400">
            Administra el personal autorizado con acceso segmentado a módulos farmacéuticos y comerciales
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Usuario Operativo</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Colaborador</th>
                <th className="py-3.5 px-3 font-semibold">Rol Asignado</th>
                <th className="py-3.5 px-3 font-semibold">Último Acceso</th>
                <th className="py-3.5 px-3 font-semibold">Dirección IP</th>
                <th className="py-3.5 px-3 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {adminUsers.map((u) => {
                const isCurrent = u.id === currentAdmin?.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                Tú
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {u.role}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-xs truncate">
                          {roleDescriptions[u.role]}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{u.lastLogin}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {u.ipAddress || "190.158.204.14"}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {u.isActive ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canManageUsers && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(u.id)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-lg transition ${
                              isCurrent
                                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                                : "bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            }`}
                            title={isCurrent ? "No puedes eliminar tu propio usuario" : "Eliminar usuario"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                {editingUser ? "Editar Usuario Administrativo" : "Registrar Nuevo Colaborador"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Dra. Marcela Beltrán (Q.F.)"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="colaborador@farmaboy.com.co"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rol Operativo Asignado</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRoleName })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  <option value="SUPER_ADMIN">Super Administrador (Acceso Total)</option>
                  <option value="ADMIN">Administrador General</option>
                  <option value="FARMACEUTICO">Químico Farmacéutico (INVIMA, Medicamentos, Kardex)</option>
                  <option value="VENTAS">Ventas & Pedidos (Despachos y Clientes)</option>
                  <option value="EDITOR">Editor de Contenido (Banners, Blog y Diseño)</option>
                  <option value="SOPORTE">Atención & Soporte al Paciente</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {roleDescriptions[formData.role]}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Estado de la Cuenta</label>
                <select
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="true">Activo (Puede iniciar sesión)</option>
                  <option value="false">Inactivo (Acceso revocado)</option>
                </select>
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition shadow-lg shadow-emerald-500/20"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Eliminar colaborador administrativo?"
        message="El usuario perderá el acceso inmediato al panel de administración de Farmaboy."
        confirmText="Eliminar Usuario"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteAdminUser(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
