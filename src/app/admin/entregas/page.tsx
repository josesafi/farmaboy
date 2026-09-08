"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { DeliveryRate, PickupPoint } from "@/types/admin";

type TabType = "TARIFAS" | "PUNTOS" | "ZONAS";

export default function AdminEntregasPage() {
  const {
    deliveryRates,
    addDeliveryRate,
    updateDeliveryRate,
    deleteDeliveryRate,
    toggleDeliveryRateActive,
    pickupPoints,
    addPickupPoint,
    updatePickupPoint,
    deletePickupPoint,
    togglePickupPointActive,
    storeSettings,
    updateStoreSettings,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<TabType>("TARIFAS");
  const [searchQuery, setSearchQuery] = useState("");

  // Rate Modal State
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<DeliveryRate | null>(null);
  const [rateForm, setRateForm] = useState({
    department: "Boyacá",
    municipality: "Duitama",
    zone: "Casco Urbano Duitama",
    rateCOP: 5000,
    minOrderCOP: 20000,
    freeShippingFromCOP: 70000,
    estimatedTime: "30 a 60 min",
    isActive: true,
  });

  // Pickup Point Modal State
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PickupPoint | null>(null);
  const [pointForm, setPointForm] = useState({
    name: "Sede Principal Farmaboy - Duitama Centro",
    address: "Carrera 16 # 15-20, Centro, Duitama, Boyacá",
    municipality: "Duitama",
    phone: "+57 (608) 760-4422",
    schedule: "Lunes a Sábado: 7:00 am - 9:00 pm | Domingos: 8:00 am - 7:00 pm",
    days: "Lunes a Domingo",
    capacityOrdersPerDay: 80,
    prepTimeMinutes: 20,
    pickupInstructions: "Presenta tu cédula y número de orden en el módulo de entregas prioritarias.",
    status: "ACTIVO" as "ACTIVO" | "INACTIVO",
  });

  // Filtered rates
  const filteredRates = useMemo(() => {
    return deliveryRates.filter((r) =>
      r.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deliveryRates, searchQuery]);

  // Filtered pickup points
  const filteredPoints = useMemo(() => {
    return pickupPoints.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.municipality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pickupPoints, searchQuery]);

  const handleOpenRateModal = (rate?: DeliveryRate) => {
    if (rate) {
      setEditingRate(rate);
      setRateForm({
        department: rate.department,
        municipality: rate.municipality,
        zone: rate.zone,
        rateCOP: rate.rateCOP,
        minOrderCOP: rate.minOrderCOP || 0,
        freeShippingFromCOP: rate.freeShippingFromCOP || 0,
        estimatedTime: rate.estimatedTime,
        isActive: rate.isActive,
      });
    } else {
      setEditingRate(null);
      setRateForm({
        department: "Boyacá",
        municipality: "Duitama",
        zone: "",
        rateCOP: 5000,
        minOrderCOP: 20000,
        freeShippingFromCOP: 70000,
        estimatedTime: "30 a 60 min",
        isActive: true,
      });
    }
    setIsRateModalOpen(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRate) {
      updateDeliveryRate(editingRate.id, rateForm);
      if (rateForm.municipality.toLowerCase().includes("duitama") && rateForm.zone.toLowerCase().includes("urbano")) {
        updateStoreSettings({ standardShippingCostCOP: rateForm.rateCOP });
      }
    } else {
      addDeliveryRate(rateForm);
    }
    setIsRateModalOpen(false);
  };

  const handleOpenPointModal = (point?: PickupPoint) => {
    if (point) {
      setEditingPoint(point);
      setPointForm({
        name: point.name,
        address: point.address,
        municipality: point.municipality,
        phone: point.phone,
        schedule: point.schedule,
        days: point.days,
        capacityOrdersPerDay: point.capacityOrdersPerDay || 50,
        prepTimeMinutes: point.prepTimeMinutes,
        pickupInstructions: point.pickupInstructions,
        status: point.status,
      });
    } else {
      setEditingPoint(null);
      setPointForm({
        name: "",
        address: "",
        municipality: "Duitama",
        phone: "+57 (608) 760-4422",
        schedule: "Lunes a Sábado: 8:00 am - 8:00 pm",
        days: "Lunes a Sábado",
        capacityOrdersPerDay: 50,
        prepTimeMinutes: 20,
        pickupInstructions: "Presenta tu cédula y código de pedido.",
        status: "ACTIVO",
      });
    }
    setIsPointModalOpen(true);
  };

  const handleSavePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPoint) {
      updatePickupPoint(editingPoint.id, pointForm);
    } else {
      addPickupPoint(pointForm);
    }
    setIsPointModalOpen(false);
  };

  const flagshipRate = deliveryRates.find((r) => r.id === "rate-duitama-urbana") || deliveryRates[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl backdrop-blur-md shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Gestión de Entregas & Cobertura Farmaboy
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configuración de tarifas de domicilio, sedes de recogida en Duitama y cobertura en Boyacá
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === "PUNTOS") handleOpenPointModal();
            else handleOpenRateModal();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === "PUNTOS" ? "Nuevo Punto de Recogida" : "Nueva Tarifa de Entrega"}</span>
        </button>
      </div>

      {/* Tabs Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("TARIFAS")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "TARIFAS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Tarifas de Domicilio ({deliveryRates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("PUNTOS")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "PUNTOS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Puntos de Recogida ({pickupPoints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("ZONAS")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "ZONAS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Zonas de Cobertura</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar municipio, zona o sede..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: TARIFAS DE DOMICILIO */}
      {activeTab === "TARIFAS" && (
        <div className="space-y-4">
          {/* Highlight Flagship Rate: Duitama Urbana */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tarifa Base Local Predeterminada
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                Duitama Urbana — Casco Central & Barrios Principales
              </h3>
              <p className="text-xs text-slate-300">
                Aplica para entregas en Duitama dentro del casco urbano. Envíos gratis para compras de $70.000 COP en adelante.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Costo de Domicilio</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${(flagshipRate?.rateCOP || 5000).toLocaleString("es-CO")} COP
                </span>
              </div>
              <button
                onClick={() => handleOpenRateModal(flagshipRate)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>
          </div>

          {/* Rates Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Municipio / Ciudad</th>
                    <th className="py-3 px-4">Zona / Cobertura</th>
                    <th className="py-3 px-4">Tarifa COP</th>
                    <th className="py-3 px-4">Pedido Mínimo</th>
                    <th className="py-3 px-4">Envío Gratis Desde</th>
                    <th className="py-3 px-4">Tiempo Estimado</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {rate.municipality}
                        <span className="block text-[10px] font-normal text-slate-500">{rate.department}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {rate.zone}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-400 whitespace-nowrap">
                        ${rate.rateCOP.toLocaleString("es-CO")} COP
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        ${(rate.minOrderCOP || 0).toLocaleString("es-CO")} COP
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-semibold whitespace-nowrap">
                        {rate.freeShippingFromCOP
                          ? `$${rate.freeShippingFromCOP.toLocaleString("es-CO")} COP`
                          : "No aplica"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {rate.estimatedTime}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleDeliveryRateActive(rate.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            rate.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {rate.isActive ? "ACTIVA" : "INACTIVA"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenRateModal(rate)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                          title="Editar Tarifa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar tarifa para ${rate.municipality} (${rate.zone})?`)) {
                              deleteDeliveryRate(rate.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Eliminar Tarifa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUNTOS DE RECOGIDA */}
      {activeTab === "PUNTOS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoints.map((point) => (
              <div
                key={point.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      point.status === "ACTIVO"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}>
                      {point.status}
                    </span>
                    <h3 className="text-base font-bold text-white">{point.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {point.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenPointModal(point)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Editar Sede"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => togglePickupPointActive(point.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                      title={point.status === "ACTIVO" ? "Desactivar" : "Activar"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar punto de recogida "${point.name}"?`)) {
                          deletePickupPoint(point.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Horario de Atención</span>
                    <span className="text-slate-300 font-medium block">{point.schedule}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Teléfono de Contacto</span>
                    <span className="text-slate-300 font-medium block">{point.phone}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                  <span className="font-bold text-slate-300">Instrucciones al cliente:</span>
                  <p>{point.pickupInstructions}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Tiempo estimado de preparación: {point.prepTimeMinutes} min</span>
                  <span>Capacidad: {point.capacityOrdersPerDay || 50} pedidos/día</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ZONAS DE COBERTURA */}
      {activeTab === "ZONAS" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Red de Cobertura Departamental — Boyacá
            </h3>
            <p className="text-xs text-slate-400">
              Farmaboy opera un modelo de entrega express local en Duitama y rutas diarias intermunicipales en Boyacá.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Duitama (Sede Central)</h4>
              <p className="text-[11px] text-slate-400">
                Domicilio express en 30 a 60 minutos con tarifa fija de $5.000 COP y recogida sin costo en Sede Carrera 16 # 15-20.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Corredor Industrial</h4>
              <p className="text-[11px] text-slate-400">
                Paipa, Sogamoso, Nobsa y Tibasosa atendidos el mismo día con tarifas unificadas entre $6.500 y $8.000 COP.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Capital & Resto de Boyacá</h4>
              <p className="text-[11px] text-slate-400">
                Tunja y municipios cercanos con despachos diarios por flota propia y aliados logísticos certificados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tarifa de Domicilio */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                {editingRate ? "Editar Tarifa de Entrega" : "Nueva Tarifa de Entrega"}
              </h3>
              <button
                onClick={() => setIsRateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Municipio</label>
                  <input
                    type="text"
                    required
                    value={rateForm.municipality}
                    onChange={(e) => setRateForm({ ...rateForm, municipality: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ej. Duitama"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Departamento</label>
                  <input
                    type="text"
                    required
                    value={rateForm.department}
                    onChange={(e) => setRateForm({ ...rateForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Zona o Cobertura Específica</label>
                <input
                  type="text"
                  required
                  value={rateForm.zone}
                  onChange={(e) => setRateForm({ ...rateForm, zone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ej. Casco Urbano Duitama"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tarifa de Envío (COP)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    value={rateForm.rateCOP}
                    onChange={(e) => setRateForm({ ...rateForm, rateCOP: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tiempo Estimado</label>
                  <input
                    type="text"
                    required
                    value={rateForm.estimatedTime}
                    onChange={(e) => setRateForm({ ...rateForm, estimatedTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ej. 30 a 60 min"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Pedido Mínimo (COP)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={rateForm.minOrderCOP}
                    onChange={(e) => setRateForm({ ...rateForm, minOrderCOP: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Envío Gratis Desde (COP)</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={rateForm.freeShippingFromCOP}
                    onChange={(e) => setRateForm({ ...rateForm, freeShippingFromCOP: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveRate"
                  checked={rateForm.isActive}
                  onChange={(e) => setRateForm({ ...rateForm, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="isActiveRate" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Tarifa activa y disponible en checkout para compras de clientes
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/20"
                >
                  {editingRate ? "Guardar Cambios" : "Crear Tarifa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Punto de Recogida */}
      {isPointModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {editingPoint ? "Editar Punto de Recogida" : "Nuevo Punto de Recogida"}
              </h3>
              <button
                onClick={() => setIsPointModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePoint} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Nombre de la Sede</label>
                <input
                  type="text"
                  required
                  value={pointForm.name}
                  onChange={(e) => setPointForm({ ...pointForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ej. Sede Principal Farmaboy - Duitama Centro"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Dirección Física</label>
                <input
                  type="text"
                  required
                  value={pointForm.address}
                  onChange={(e) => setPointForm({ ...pointForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ej. Carrera 16 # 15-20, Centro, Duitama"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Municipio</label>
                  <input
                    type="text"
                    required
                    value={pointForm.municipality}
                    onChange={(e) => setPointForm({ ...pointForm, municipality: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Teléfono</label>
                  <input
                    type="text"
                    required
                    value={pointForm.phone}
                    onChange={(e) => setPointForm({ ...pointForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Horario de Entrega</label>
                <input
                  type="text"
                  required
                  value={pointForm.schedule}
                  onChange={(e) => setPointForm({ ...pointForm, schedule: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Instrucciones de Retiro para el Cliente</label>
                <textarea
                  rows={2}
                  value={pointForm.pickupInstructions}
                  onChange={(e) => setPointForm({ ...pointForm, pickupInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tiempo de Preparación (minutos)</label>
                  <input
                    type="number"
                    min={5}
                    value={pointForm.prepTimeMinutes}
                    onChange={(e) => setPointForm({ ...pointForm, prepTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Estado</label>
                  <select
                    value={pointForm.status}
                    onChange={(e) => setPointForm({ ...pointForm, status: e.target.value as "ACTIVO" | "INACTIVO" })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPointModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/20"
                >
                  {editingPoint ? "Guardar Cambios" : "Crear Sede"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}