"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  Sparkles,
  Tag,
  Percent,
  BadgePercent,
  Check,
  Award,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { CustomerCRM } from "@/types/admin";
import { getWhatsAppUrl } from "@/lib/utils";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const emptyCustomer: Omit<CustomerCRM, "id" | "registrationDate" | "totalOrders" | "totalSpentCOP" | "averageTicketCOP"> = {
  name: "",
  lastName: "",
  email: "",
  phone: "312",
  documentType: "CC",
  documentNumber: "",
  city: "Tunja",
  address: "",
  lastLoginDate: "Hoy",
  segment: "NUEVO",
  notes: "",
  lifetimeDiscountPercentage: 0,
  lifetimeDiscountReason: "",
  isLifetimeDiscountActive: true,
};

export default function AdminClientesPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, hasPermission } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("TODOS");
  const [selectedDiscountFilter, setSelectedDiscountFilter] = useState<"TODOS" | "CON_DESCUENTO" | "SIN_DESCUENTO">("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<CustomerCRM | null>(null);
  const [formData, setFormData] = useState(emptyCustomer);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("clientes:write");

  const handleOpenAdd = () => {
    setEditingCust(null);
    setFormData(emptyCustomer);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust: CustomerCRM) => {
    setEditingCust(cust);
    setFormData({
      name: cust.name,
      lastName: cust.lastName,
      email: cust.email,
      phone: cust.phone,
      documentType: cust.documentType,
      documentNumber: cust.documentNumber,
      city: cust.city,
      address: cust.address,
      lastLoginDate: cust.lastLoginDate,
      segment: cust.segment,
      notes: cust.notes || "",
      lifetimeDiscountPercentage: cust.lifetimeDiscountPercentage || 0,
      lifetimeDiscountReason: cust.lifetimeDiscountReason || "",
      isLifetimeDiscountActive: cust.isLifetimeDiscountActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCust) {
      updateCustomer(editingCust.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = `Hola ${name}, te saludamos de Farmaboy Boyacá. Esperamos que te encuentres bien. ¿En qué podemos asesorarte hoy?`;
    const url = getWhatsAppUrl(phone, msg);
    window.open(url, "_blank");
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.documentNumber.includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.lifetimeDiscountReason && c.lifetimeDiscountReason.toLowerCase().includes(q));

      const matchesSeg = selectedSegment === "TODOS" || c.segment === selectedSegment;

      const hasDiscount = (c.lifetimeDiscountPercentage || 0) > 0 && c.isLifetimeDiscountActive !== false;
      const matchesDiscount =
        selectedDiscountFilter === "TODOS" ||
        (selectedDiscountFilter === "CON_DESCUENTO" && hasDiscount) ||
        (selectedDiscountFilter === "SIN_DESCUENTO" && !hasDiscount);

      return matchesQuery && matchesSeg && matchesDiscount;
    });
  }, [customers, searchQuery, selectedSegment, selectedDiscountFilter]);

  const discountStats = useMemo(() => {
    const withDiscount = customers.filter(
      (c) => (c.lifetimeDiscountPercentage || 0) > 0 && c.isLifetimeDiscountActive !== false
    );
    return {
      count: withDiscount.length,
      percentage: customers.length > 0 ? Math.round((withDiscount.length / customers.length) * 100) : 0,
    };
  }, [customers]);

  const segmentBadges: Record<CustomerCRM["segment"], string> = {
    NUEVO: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    FRECUENTE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    VIP: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    MAYORISTA: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    INACTIVO: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            CRM de Clientes & Pacientes de Farmacia
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fidelización, historial de consumo, fórmulas y descuentos permanentes en Boyacá
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick stats pill */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{discountStats.count} con Descuento Vitalicio</span>
          </div>

          {canWrite && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, documento, WhatsApp, correo o convenio..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Segment filter */}
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="flex-1 md:w-auto px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todos los Segmentos</option>
            <option value="NUEVO">Nuevos</option>
            <option value="FRECUENTE">Frecuentes</option>
            <option value="VIP">Clientes VIP</option>
            <option value="MAYORISTA">Empresas / Mayoristas</option>
            <option value="INACTIVO">Inactivos</option>
          </select>

          {/* Discount filter */}
          <select
            value={selectedDiscountFilter}
            onChange={(e) => setSelectedDiscountFilter(e.target.value as any)}
            className="flex-1 md:w-auto px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none"
          >
            <option value="TODOS">Todos los Descuentos</option>
            <option value="CON_DESCUENTO">🏷️ Con Descuento Vitalicio ({discountStats.count})</option>
            <option value="SIN_DESCUENTO">Sin Descuento Vitalicio</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Cliente / Paciente</th>
                <th className="py-3.5 px-3 font-semibold">Cédula / Documento</th>
                <th className="py-3.5 px-3 font-semibold">Contacto & Ciudad</th>
                <th className="py-3.5 px-3 font-semibold">Compras Realizadas</th>
                <th className="py-3.5 px-3 font-semibold">Gasto Total (LTV)</th>
                <th className="py-3.5 px-3 font-semibold">Segmento</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron clientes registrados con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const hasLifetimeDiscount = (cust.lifetimeDiscountPercentage || 0) > 0 && cust.isLifetimeDiscountActive !== false;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {cust.name.charAt(0)}
                            {cust.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {cust.name} {cust.lastName}
                              </p>
                              {/* Lifetime discount badge */}
                              {hasLifetimeDiscount && (
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs"
                                  title={cust.lifetimeDiscountReason || "Descuento permanente asignado a este perfil"}
                                >
                                  <Tag className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>{cust.lifetimeDiscountPercentage}% OFF Vitalicio</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{cust.email}</p>
                            {/* Lifetime discount reason pill */}
                            {hasLifetimeDiscount && cust.lifetimeDiscountReason && (
                              <p className="text-[10px] text-emerald-300/90 font-medium italic truncate max-w-xs mt-0.5 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                <span>{cust.lifetimeDiscountReason}</span>
                              </p>
                            )}
                            {cust.notes && (
                              <p className="text-[10px] text-amber-300/90 italic truncate max-w-xs mt-0.5">
                                Nota: {cust.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-slate-300">
                        {cust.documentType} {cust.documentNumber}
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-white">{cust.city}</p>
                        <p className="text-[11px] text-slate-400">{cust.phone}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-white">{cust.totalOrders} órdenes</span>
                      </td>

                      <td className="py-3.5 px-3 font-black text-emerald-400 text-sm whitespace-nowrap">
                        ${cust.totalSpentCOP.toLocaleString("es-CO")} COP
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            segmentBadges[cust.segment]
                          }`}
                        >
                          {cust.segment}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleWhatsApp(cust.phone, cust.name)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                            title="Escribir al WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          {canWrite && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(cust)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                title="Editar cliente y descuento"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(cust.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                title="Eliminar cliente"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                {editingCust ? "Editar Ficha de Cliente" : "Registrar Nuevo Cliente"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo Doc.</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="CC">Cédula (CC)</option>
                    <option value="CE">Cédula Ext. (CE)</option>
                    <option value="NIT">NIT Empresa</option>
                    <option value="TI">Tarjeta Id (TI)</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ciudad de Boyacá</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Tunja">Tunja</option>
                    <option value="Duitama">Duitama</option>
                    <option value="Sogamoso">Sogamoso</option>
                    <option value="Paipa">Paipa</option>
                    <option value="Chiquinquirá">Chiquinquirá</option>
                    <option value="Villa de Leyva">Villa de Leyva</option>
                    <option value="Nobsa">Nobsa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Segmentación CRM</label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="NUEVO">NUEVO</option>
                    <option value="FRECUENTE">FRECUENTE</option>
                    <option value="VIP">CLIENTE VIP</option>
                    <option value="MAYORISTA">EMPRESA / MAYORISTA</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              </div>

              {/* SECCIÓN ESPECIAL: DESCUENTO VITALICIO / DE POR VIDA */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>Descuento Vitalicio / De Por Vida</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Automático en Cuenta
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Este cliente recibirá este descuento predeterminado en todas sus compras
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300 font-bold select-none">
                    <input
                      type="checkbox"
                      checked={formData.isLifetimeDiscountActive !== false && (formData.lifetimeDiscountPercentage || 0) > 0}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setFormData({
                            ...formData,
                            lifetimeDiscountPercentage: 0,
                            isLifetimeDiscountActive: false,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            lifetimeDiscountPercentage: 10,
                            isLifetimeDiscountActive: true,
                          });
                        }
                      }}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                    />
                    <span>Activo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300">
                        Porcentaje de Descuento (%) *
                      </label>
                      <span className="text-xs font-black text-emerald-400">
                        {formData.lifetimeDiscountPercentage || 0}% OFF
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.lifetimeDiscountPercentage || 0}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setFormData({
                            ...formData,
                            lifetimeDiscountPercentage: val,
                            isLifetimeDiscountActive: val > 0,
                          });
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-white font-mono text-sm focus:border-emerald-400 outline-none pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                    </div>

                    {/* Presets rápidos */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {[0, 5, 10, 15, 20, 25, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              lifetimeDiscountPercentage: pct,
                              isLifetimeDiscountActive: pct > 0,
                            })
                          }
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                            formData.lifetimeDiscountPercentage === pct
                              ? "bg-emerald-500 text-white border-emerald-400 shadow-xs"
                              : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
                          }`}
                        >
                          {pct === 0 ? "Sin desc." : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Motivo / Convenio del Descuento
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Tratamiento crónico, convenio institucional, VIP..."
                      value={formData.lifetimeDiscountReason || ""}
                      onChange={(e) => setFormData({ ...formData, lifetimeDiscountReason: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-400 outline-none"
                    />
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-[10px] text-emerald-300 mt-2 leading-relaxed">
                      💡 <strong>De por vida:</strong> Al iniciar sesión o ingresar su documento/correo en el checkout, el sistema deducirá automáticamente este porcentaje de su total sin requerir códigos manuales.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Carrera / Calle / Barrio..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Notas Internas / Condición Farmacéutica</label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej. Paciente hipertenso, requiere tratamiento crónico mensual..."
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Eliminar cliente del sistema?"
        message="Esta acción retirará la ficha del cliente de la base de datos de Farmaboy."
        confirmText="Eliminar Cliente"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteCustomer(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
