"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCode,
  ArrowLeft,
  Save,
  RotateCcw,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Tag,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("ORDER_CREATED");
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [subjectInput, setSubjectInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [testSending, setTestSending] = useState<boolean>(false);

  const fetchTemplateList = async () => {
    try {
      const res = await fetch("/api/emails/templates");
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTemplateDetail = async (event: string) => {
    setIsLoading(true);
    setSaveSuccess(null);
    setSaveError(null);
    try {
      const res = await fetch(`/api/emails/templates?event=${event}`);
      const data = await res.json();
      if (data.success) {
        setCurrentTemplate(data.template);
        setSubjectInput(data.template.currentSubject || data.template.defaultSubject);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateList();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTemplateDetail(selectedEvent);
    }
  }, [selectedEvent]);

  const handleSave = async () => {
    setSaveSuccess(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/emails/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: selectedEvent,
          subject: subjectInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess("¡Plantilla y asunto guardados exitosamente!");
        fetchTemplateDetail(selectedEvent);
        fetchTemplateList();
        setTimeout(() => setSaveSuccess(null), 3500);
      } else {
        setSaveError(data.error || "No se pudo guardar la plantilla");
      }
    } catch (e: any) {
      setSaveError("Error de conexión: " + e.message);
    }
  };

  const handleRestore = async () => {
    if (!confirm("¿Deseas restaurar el asunto y contenido original de esta plantilla?")) return;
    try {
      const res = await fetch("/api/emails/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: selectedEvent,
          restoreDefault: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(data.message);
        fetchTemplateDetail(selectedEvent);
        fetchTemplateList();
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleSendTest = async () => {
    setTestSending(true);
    try {
      const res = await fetch("/api/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedEvent,
          customSubject: subjectInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Correo de prueba enviado con éxito.");
      } else {
        alert("Error al enviar prueba: " + (data.error || "Falla SMTP"));
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/emails"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Emails</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestor de Plantillas de Correo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Personaliza los asuntos, valida variables dinámicas <code>{"{{variable}}"}</code> y previsualiza cómo se ven los correos en la bandeja de tus clientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendTest}
            disabled={testSending}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>{testSending ? "Enviando prueba..." : "Enviar prueba a mi correo"}</span>
          </button>

          <button
            type="button"
            onClick={handleRestore}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all"
            title="Restaurar a valores predeterminados"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Templates list + Editor/Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates Selector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 max-h-[780px] overflow-y-auto">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Catálogo de Plantillas ({templates.length})
          </h2>

          <div className="space-y-1.5">
            {templates.map((tpl) => {
              const isSelected = tpl.event === selectedEvent;
              return (
                <div
                  key={tpl.event}
                  onClick={() => setSelectedEvent(tpl.event)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-sm"
                      : "border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold leading-snug">{tpl.name}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        tpl.category === "ACCOUNT"
                          ? "bg-blue-100 text-blue-800"
                          : tpl.category === "ORDER"
                          ? "bg-emerald-100 text-emerald-800"
                          : tpl.category === "COMMERCIAL"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                    {tpl.event}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Template Detail & Preview */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          {isLoading || !currentTemplate ? (
            <div className="py-20 text-center text-slate-400">
              <FileCode className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
              <span>Cargando plantilla...</span>
            </div>
          ) : (
            <>
              {/* Template Info & Variable Tags */}
              <div className="pb-4 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      {currentTemplate.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentTemplate.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                    {currentTemplate.event}
                  </span>
                </div>

                {/* Allowed Variables Pills */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#00A86B]" />
                    <span>Variables Dinámicas Disponibles (Validadas):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTemplate.allowedVariables.map((v: string) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSubjectInput((prev) => `${prev} {{${v}}}`)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-mono text-[11px] border border-slate-200 transition-colors"
                        title="Haz clic para insertar en el asunto"
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Editor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Línea de Asunto (Subject):
                  </label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
                    placeholder="Escribe el asunto del correo..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Solo se permiten las variables autorizadas listadas arriba. El sistema rechazará cualquier variable desconocida por seguridad.
                  </p>
                </div>
              </div>

              {/* Tabs: Preview vs Code */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === "preview"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Vista Previa en Vivo</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Previsualización con datos de muestra Farmaboy Boyacá
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 p-2">
                  <iframe
                    title="Vista previa correo"
                    srcDoc={currentTemplate.previewHtml}
                    className="w-full h-[520px] bg-white rounded-xl border-none shadow-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
