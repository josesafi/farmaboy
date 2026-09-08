"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Pill, ShoppingBag, ClipboardList, User, ArrowRight, X } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { medicines, retailProducts, orders, customers } = useAdminStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedMedicines = medicines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.pharmaInfo.principioActivo.toLowerCase().includes(q) ||
          m.pharmaInfo.registroSanitarioINVIMA.toLowerCase().includes(q) ||
          m.lotNumber.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedProducts = retailProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedOrders = orders
      .filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerDocument.includes(q)
      )
      .slice(0, 3);

    const matchedCustomers = customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.documentNumber.includes(q) ||
          c.phone.includes(q)
      )
      .slice(0, 3);

    const totalCount =
      matchedMedicines.length +
      matchedProducts.length +
      matchedOrders.length +
      matchedCustomers.length;

    return {
      medicines: matchedMedicines,
      products: matchedProducts,
      orders: matchedOrders,
      customers: matchedCustomers,
      totalCount,
    };
  }, [query, medicines, retailProducts, orders, customers]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60 gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Buscar medicamento, INVIMA, lote, producto retail, pedido #FB, o cliente..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-300">Búsqueda Global en tiempo real</p>
              <p className="mt-1 text-slate-500">
                Escribe un nombre de medicamento, principio activo, registro INVIMA, SKU o cliente.
              </p>
            </div>
          ) : searchResults && searchResults.totalCount === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-300">No se encontraron coincidencias para &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-slate-500">Verifica la ortografía o intenta con otro término de búsqueda.</p>
            </div>
          ) : (
            searchResults && (
              <>
                {/* Medicines */}
                {searchResults.medicines.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" /> Medicamentos Regulados ({searchResults.medicines.length})
                    </h5>
                    <div className="space-y-1">
                      {searchResults.medicines.map((med) => (
                        <div
                          key={med.id}
                          onClick={() => navigateTo(`/admin/medicamentos?id=${med.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 transition cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                              {med.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {med.pharmaInfo.principioActivo} • INVIMA: {med.pharmaInfo.registroSanitarioINVIMA} • Lote: {med.lotNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <div>
                              <p className="text-xs font-black text-emerald-400">
                                ${med.salePriceCOP.toLocaleString("es-CO")}
                              </p>
                              <p className="text-[10px] text-slate-400">{med.currentStock} unid.</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retail Products */}
                {searchResults.products.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" /> Productos Retail ({searchResults.products.length})
                    </h5>
                    <div className="space-y-1">
                      {searchResults.products.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => navigateTo(`/admin/productos?id=${prod.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/50 transition cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Marca: {prod.brand} • SKU: {prod.sku}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <p className="text-xs font-black text-teal-400">
                              ${prod.priceCOP.toLocaleString("es-CO")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Orders */}
                {searchResults.orders.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> Pedidos ({searchResults.orders.length})
                    </h5>
                    <div className="space-y-1">
                      {searchResults.orders.map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => navigateTo(`/admin/pedidos?id=${ord.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/50 transition cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                              Pedido #{ord.id} • {ord.customerName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {ord.deliveryCity} • Estado: {ord.status}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <p className="text-xs font-black text-amber-400">
                              ${ord.totalCOP.toLocaleString("es-CO")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers */}
                {searchResults.customers.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Clientes CRM ({searchResults.customers.length})
                    </h5>
                    <div className="space-y-1">
                      {searchResults.customers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => navigateTo(`/admin/clientes?id=${cust.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 transition cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {cust.name} {cust.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {cust.city} • Tel: {cust.phone} • {cust.segment}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {cust.segment}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pulsa sobre cualquier elemento para ir a su ficha</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
