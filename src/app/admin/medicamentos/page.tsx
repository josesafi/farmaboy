"use client";

import React, { useState, useMemo } from "react";
import {
  Pill,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  X,
  Boxes,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { MedicineItem, PharmaceuticalInfo } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VariantsEditor } from "@/components/admin/VariantsEditor";

const emptyMedicine: Omit<MedicineItem, "id"> = {
  name: "",
  genericName: "",
  barcode: "",
  sku: "",
  category: "Medicamentos Éticos",
  subCategory: "Analgésicos",
  imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800",
  description: "",
  shortDescription: "",
  costPriceCOP: 8000,
  salePriceCOP: 12000,
  previousPriceCOP: 0,
  marginPercent: 33.3,
  currentStock: 50,
  minStock: 10,
  maxStock: 200,
  lotNumber: "LOT-" + new Date().getFullYear() + "-001",
  expiryDate: "2026-12-31",
  physicalLocation: "Estante A1",
  requiresPrescription: false,
  status: "ACTIVO",
  supplier: "Laboratorios Colombia",
  variants: [],
  pharmaInfo: {
    principioActivo: "",
    concentracion: "",
    formaFarmaceutica: "Tabletas",
    laboratorio: "Genfar / Sanofi",
    registroSanitarioINVIMA: "INVIMA 2021M-0000000-R1",
    indicaciones: "",
    contraindicaciones: "",
    precauciones: "",
    formaDeUso: "Vía oral según prescripción",
    almacenamiento: "Conservar a temperatura menor a 30°C",
  },
};

export default function AdminMedicamentosPage() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, hasPermission } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [filterStock, setFilterStock] = useState<"TODOS" | "STOCK_BAJO" | "POR_VENCER" | "RECETA">("TODOS");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicineItem | null>(null);
  const [formData, setFormData] = useState<Omit<MedicineItem, "id">>(emptyMedicine);

  // Delete Confirm Dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("medicamentos:write");

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData(emptyMedicine);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (med: MedicineItem) => {
    setEditingMed(med);
    setFormData({
      ...med,
    });
    setIsModalOpen(true);
  };

  // Price margin auto calculation
  const handlePriceChange = (cost: number, sale: number) => {
    const margin = sale > 0 ? Math.round(((sale - cost) / sale) * 1000) / 10 : 0;
    setFormData((prev) => ({
      ...prev,
      costPriceCOP: cost,
      salePriceCOP: sale,
      marginPercent: margin,
    }));
  };

  // Save Modal
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMed) {
      updateMedicine(editingMed.id, formData);
    } else {
      addMedicine(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered List
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.pharmaInfo.principioActivo.toLowerCase().includes(q) ||
        m.pharmaInfo.registroSanitarioINVIMA.toLowerCase().includes(q) ||
        m.lotNumber.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === "TODOS" || m.category === selectedCategory;

      let matchesStock = true;
      if (filterStock === "STOCK_BAJO") {
        matchesStock = m.currentStock <= m.minStock;
      } else if (filterStock === "POR_VENCER") {
        const exp = new Date(m.expiryDate).getTime();
        const diffDays = (exp - Date.now()) / (1000 * 3600 * 24);
        matchesStock = diffDays > 0 && diffDays <= 180;
      } else if (filterStock === "RECETA") {
        matchesStock = m.requiresPrescription;
      }

      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [medicines, searchQuery, selectedCategory, filterStock]);

  const categories = Array.from(new Set(medicines.map((m) => m.category)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-400" />
            Catálogo de Medicamentos (Ficha Farmacéutica & INVIMA)
          </h2>
          <p className="text-xs text-slate-400">
            Control regulatorio, lotes, registros sanitarios, precios y stock activo en Boyacá
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Medicamento INVIMA</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, principio activo, INVIMA, lote o SKU..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="STOCK_BAJO">⚠️ Stock Crítico / Bajo</option>
            <option value="POR_VENCER">⏳ Próximos a Vencer (&lt; 6 meses)</option>
            <option value="RECETA">📋 Requiere Fórmula Médica</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Medicamento & Principio</th>
                <th className="py-3.5 px-3 font-semibold">Registro INVIMA & Lote</th>
                <th className="py-3.5 px-3 font-semibold">Forma & Concentración</th>
                <th className="py-3.5 px-3 font-semibold">Precio Venta (COP)</th>
                <th className="py-3.5 px-3 font-semibold">Margen</th>
                <th className="py-3.5 px-3 font-semibold">Stock / Mín</th>
                <th className="py-3.5 px-3 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron medicamentos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLow = med.currentStock <= med.minStock;
                  const exp = new Date(med.expiryDate).getTime();
                  const isExpiring = (exp - Date.now()) / (1000 * 3600 * 24) <= 180;

                  return (
                    <tr key={med.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={med.imageUrl}
                            alt={med.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {med.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {med.genericName} • {med.pharmaInfo.principioActivo}
                            </p>
                            {med.requiresPrescription && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Requiere Fórmula
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-mono text-slate-200 text-[11px] font-semibold">
                          {med.pharmaInfo.registroSanitarioINVIMA}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Lote: <span className="text-slate-300 font-mono">{med.lotNumber}</span>
                        </p>
                        <p className={`text-[10px] ${isExpiring ? "text-amber-400 font-bold" : "text-slate-400"}`}>
                          Vence: {med.expiryDate}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="text-slate-200 font-medium">{med.pharmaInfo.formaFarmaceutica}</p>
                        <p className="text-[11px] text-slate-400">{med.pharmaInfo.concentracion}</p>
                        <p className="text-[10px] text-slate-400">{med.pharmaInfo.laboratorio}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-black text-emerald-400 text-sm">
                          ${med.salePriceCOP.toLocaleString("es-CO")}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Costo: ${med.costPriceCOP.toLocaleString("es-CO")}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {med.marginPercent}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black text-xs ${
                              isLow ? "text-rose-400 font-bold" : "text-white"
                            }`}
                          >
                            {med.currentStock}
                          </span>
                          <span className="text-slate-400 text-[10px]">/ min {med.minStock}</span>
                        </div>
                        {isLow && (
                          <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Reponer stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            med.status === "ACTIVO"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : med.status === "AGOTADO"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                          }`}
                        >
                          {med.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canWrite && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(med)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="Editar medicamento"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(med.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                                title="Mover a papelera"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-400" />
                {editingMed ? "Editar Ficha de Medicamento" : "Registrar Nuevo Medicamento INVIMA"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Acetaminofén 500 mg MK"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombre Genérico *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="Ej. Paracetamol"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Principio Activo *</label>
                  <input
                    type="text"
                    required
                    value={formData.pharmaInfo.principioActivo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pharmaInfo: { ...formData.pharmaInfo, principioActivo: e.target.value },
                      })
                    }
                    placeholder="Ej. Acetaminofén"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Pharmaceutical Regulation & INVIMA */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Datos Sanitarios INVIMA & Laboratorio
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Registro INVIMA *</label>
                    <input
                      type="text"
                      required
                      value={formData.pharmaInfo.registroSanitarioINVIMA}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmaInfo: { ...formData.pharmaInfo, registroSanitarioINVIMA: e.target.value },
                        })
                      }
                      placeholder="INVIMA 2021M-..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Laboratorio / Titular</label>
                    <input
                      type="text"
                      value={formData.pharmaInfo.laboratorio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmaInfo: { ...formData.pharmaInfo, laboratorio: e.target.value },
                        })
                      }
                      placeholder="Tecnoquímicas / Genfar"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Forma Farmacéutica</label>
                    <select
                      value={formData.pharmaInfo.formaFarmaceutica}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmaInfo: { ...formData.pharmaInfo, formaFarmaceutica: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Tabletas">Tabletas</option>
                      <option value="Cápsulas">Cápsulas</option>
                      <option value="Jarabe">Jarabe</option>
                      <option value="Suspensión">Suspensión</option>
                      <option value="Gotas">Gotas</option>
                      <option value="Crema / Ungüento">Crema / Ungüento</option>
                      <option value="Inyectable">Inyectable</option>
                      <option value="Inhalador">Inhalador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Concentración</label>
                    <input
                      type="text"
                      value={formData.pharmaInfo.concentracion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmaInfo: { ...formData.pharmaInfo, concentracion: e.target.value },
                        })
                      }
                      placeholder="500 mg, 100 mg/5ml..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Commercial Prices & Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Costo Compra (COP) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.costPriceCOP}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), formData.salePriceCOP)
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Precio Venta (COP) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.salePriceCOP}
                    onChange={(e) =>
                      handlePriceChange(formData.costPriceCOP, Number(e.target.value))
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-black"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Margen Calculado</label>
                  <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-bold">
                    {formData.marginPercent}% de margen
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Requiere Receta Médica</label>
                  <select
                    value={formData.requiresPrescription ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, requiresPrescription: e.target.value === "true" })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="false">No (Venta Libre)</option>
                    <option value="true">Sí (Bajo Fórmula)</option>
                  </select>
                </div>
              </div>

              {/* Stock, Lot and Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Actual</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Número de Lote *</label>
                  <input
                    type="text"
                    required
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha de Vencimiento *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Location & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ubicación Física en Droguería</label>
                  <input
                    type="text"
                    value={formData.physicalLocation}
                    onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })}
                    placeholder="Estante 2 - Vitrina Central"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <div className="sm:col-span-2">
                    <ImageUploader 
                      label="Fotografía del Medicamento"
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    />
                  </div>
                </div>
              </div>

              {/* Indicaciones & Contraindicaciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Indicaciones Principales</label>
                  <textarea
                    rows={2}
                    value={formData.pharmaInfo.indicaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pharmaInfo: { ...formData.pharmaInfo, indicaciones: e.target.value },
                      })
                    }
                    placeholder="Alivio sintomático de dolor..."
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contraindicaciones</label>
                  <textarea
                    rows={2}
                    value={formData.pharmaInfo.contraindicaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pharmaInfo: { ...formData.pharmaInfo, contraindicaciones: e.target.value },
                      })
                    }
                    placeholder="Hipersensibilidad al principio activo..."
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <VariantsEditor 
                  variants={formData.variants || []} 
                  onChange={(v) => setFormData({ ...formData, variants: v })}
                  baseSku={formData.sku}
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition shadow-lg shadow-emerald-500/20"
                >
                  {editingMed ? "Guardar Cambios" : "Crear Medicamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Mover medicamento a la papelera?"
        message="El medicamento dejará de estar visible en el catálogo de la farmacia, pero podrás restaurarlo desde la papelera de reciclaje."
        confirmText="Mover a Papelera"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMedicine(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
