"use client";

import React, { useState } from "react";
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Plus,
  AlertTriangle,
  FileSpreadsheet,
  X,
  History,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminInventarioPage() {
  const {
    medicines,
    retailProducts,
    inventoryMovements,
    addInventoryMovement,
    hasPermission,
  } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(medicines[0]?.id || "");
  const [movementType, setMovementType] = useState<"ENTRADA" | "SALIDA" | "AJUSTE" | "DEVOLUCION">("ENTRADA");
  const [quantity, setQuantity] = useState<number>(10);
  const [reason, setReason] = useState<string>("Compra a proveedor nacional / Recepción de pedido");
  const [lotNumber, setLotNumber] = useState<string>("LOT-2026-N01");

  const canWrite = hasPermission("inventario:write");

  // Combine items
  const allItems = [
    ...medicines.map((m) => ({ id: m.id, name: m.name, stock: m.currentStock, type: "MEDICAMENTO" })),
    ...retailProducts.map((p) => ({ id: p.id, name: p.name, stock: p.currentStock, type: "RETAIL" })),
  ];

  const currentItem = allItems.find((i) => i.id === selectedProductId) || allItems[0];

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    let newStock = currentItem.stock;
    const qty = Math.abs(quantity);

    if (movementType === "ENTRADA" || movementType === "DEVOLUCION") {
      newStock += qty;
    } else if (movementType === "SALIDA") {
      newStock = Math.max(0, newStock - qty);
    } else if (movementType === "AJUSTE") {
      newStock = qty; // For adjustment, set absolute count
    }

    addInventoryMovement({
      productId: currentItem.id,
      productName: currentItem.name,
      type: movementType,
      quantity: movementType === "SALIDA" ? -qty : qty,
      previousStock: currentItem.stock,
      newStock: newStock,
      reason,
      lotNumber,
    });

    setIsModalOpen(false);
  };

  const lowStockItems = medicines.filter((m) => m.currentStock <= m.minStock);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            Control de Inventario & Kardex Farmacéutico
          </h2>
          <p className="text-xs text-slate-400">
            Trazabilidad completa de entradas, salidas, ajustes de stock y fechas de vencimiento en Boyacá
          </p>
        </div>

        {canWrite && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Movimiento Kardex</span>
          </button>
        )}
      </div>

      {/* Stock Critical Summary */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lowStockItems.length} Medicamentos con stock crítico por debajo del mínimo</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockItems.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white truncate text-[11px]">{m.name}</p>
                  <p className="text-[10px] text-slate-400">Mín: {m.minStock} unid.</p>
                </div>
                <span className="font-black text-rose-400 text-xs bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                  {m.currentStock} disp.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kardex Movements History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Movimientos Recientes del Kardex
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {inventoryMovements.length} transacciones registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 font-semibold">Fecha</th>
                <th className="py-3 px-3 font-semibold">Producto</th>
                <th className="py-3 px-3 font-semibold">Tipo</th>
                <th className="py-3 px-3 font-semibold">Cantidad</th>
                <th className="py-3 px-3 font-semibold">Stock Ant.</th>
                <th className="py-3 px-3 font-semibold">Stock Nuevo</th>
                <th className="py-3 px-3 font-semibold">Motivo</th>
                <th className="py-3 px-3 font-semibold">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventoryMovements.map((mv) => {
                const typeColors = {
                  ENTRADA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  SALIDA: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                  AJUSTE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  DEVOLUCION: "bg-sky-500/10 text-sky-400 border-sky-500/30",
                };

                return (
                  <tr key={mv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{mv.date}</td>
                    <td className="py-3 px-3 font-bold text-white">{mv.productName}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeColors[mv.type]}`}>
                        {mv.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black">
                      <span className={mv.quantity > 0 ? "text-emerald-400" : "text-rose-400"}>
                        {mv.quantity > 0 ? `+${mv.quantity}` : mv.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{mv.previousStock}</td>
                    <td className="py-3 px-3 font-bold text-white">{mv.newStock}</td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{mv.reason}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">{mv.user}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Movement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-400" />
                Registrar Movimiento de Kardex
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Seleccionar Producto o Medicamento *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
                >
                  {allItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.type}] {item.name} (Stock actual: {item.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Movimiento</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="ENTRADA">ENTRADA (Compra a Proveedor)</option>
                    <option value="SALIDA">SALIDA (Merma / Merma técnica)</option>
                    <option value="AJUSTE">AJUSTE MANUAL (Inventario físico)</option>
                    <option value="DEVOLUCION">DEVOLUCIÓN (Reintegro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {movementType === "AJUSTE" ? "Nuevo Stock Físico" : "Cantidad"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-black text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lote / Registro</label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Resultante Estimado</label>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                    {movementType === "AJUSTE"
                      ? quantity
                      : movementType === "ENTRADA" || movementType === "DEVOLUCION"
                      ? (currentItem?.stock || 0) + quantity
                      : Math.max(0, (currentItem?.stock || 0) - quantity)}{" "}
                    unidades
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Motivo / Justificación *</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Factura de proveedor, ajuste por conteo físico o merma..."
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition shadow-lg shadow-emerald-500/20"
                >
                  Registrar en Kardex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
