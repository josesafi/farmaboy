"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  UploadCloud,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MessageCircle,
  FileCheck,
  Lock,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { farmaboyConfig } from "@/config/farmaboy";

export default function FormulasPage() {
  const { prescriptions, uploadPrescription, deletePrescription, familyMembers, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState(user?.name ? `${user.name} ${user.lastName}` : "Carlos Rodríguez");
  const [doctorName, setDoctorName] = useState("");
  const [medicationsSummary, setMedicationsSummary] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileName) {
      alert("Por favor selecciona un archivo PDF o imagen de la fórmula médica.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      uploadPrescription({
        patientName,
        doctorName: doctorName || "Médico Tratante",
        fileUrl: "#",
        fileName: selectedFileName,
        fileSize: "1.8 MB",
        fileType: selectedFileName.endsWith(".pdf") ? "pdf" : "jpg",
        status: "VALIDADA",
        medicationsSummary: medicationsSummary || "Medicamentos bajo prescripción médica",
      });
      setIsUploading(false);
      setIsModalOpen(false);
      setSelectedFileName("");
      setDoctorName("");
      setMedicationsSummary("");
    }, 900);
  };

  const getStatusBadge = (status: string) => {
    if (status === "VALIDADA") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B]" />
          Fórmula Verificada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        En revisión por Regente
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 mb-2">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Bóveda Privada de Fórmulas Médicas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mis Fórmulas Médicas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Almacena de manera cifrada tus prescripciones y órdenes médicas para surtir tratamientos o solicitar dispensación por WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Subir Nueva Fórmula</span>
        </button>
      </div>

      {/* Sensitive Data Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3.5 text-xs shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-100">
            Seguridad y Confidencialidad Farmacéutica (Decreto 780 de 2016 y Ley 1581)
          </p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Tus prescripciones médicas solo son accesibles desde tu sesión autenticada y por el Regente de Farmacia de FarmaBoy para efectos de validación de dosis y fechas de vigencia. No tienen acceso público ni se comparten comercialmente.
          </p>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((rx) => {
          const whatsappRxUrl = getWhatsAppUrl(
            farmaboyConfig.contact.whatsapp,
            `Hola Farmaboy, adjunto la fórmula "${rx.fileName}" a nombre de ${rx.patientName} para solicitar cotización y despacho de los medicamentos en Boyacá.`
          );

          return (
            <div
              key={rx.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {rx.fileName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Paciente: <strong className="text-slate-700">{rx.patientName}</strong> • {rx.fileSize}
                    </p>
                  </div>
                </div>

                <div>
                  {getStatusBadge(rx.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Médico / Especialista</span>
                  <span className="font-semibold text-slate-800">{rx.doctorName || "Registrado en fórmula"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fecha de Registro</span>
                  <span className="font-semibold text-slate-800">{rx.uploadDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Resumen de Tratamiento</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{rx.medicationsSummary}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={whatsappRxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir estos medicamentos por WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Abriendo visor seguro para ${rx.fileName}...`)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver documento</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar la fórmula médica "${rx.fileName}"?`)) {
                        deletePrescription(rx.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Eliminar fórmula"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Subir Fórmula */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Subir Fórmula Médica Cifrada
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ¿Para quién es la fórmula? *
                </label>
                <select
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none bg-white font-medium"
                >
                  <option value={user?.name ? `${user.name} ${user.lastName}` : "Para mí"}>
                    {user?.name ? `${user.name} ${user.lastName} (Titular)` : "Para mí"}
                  </option>
                  {familyMembers.map((fam) => (
                    <option key={fam.id} value={fam.name}>
                      {fam.name} ({fam.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Médico o Institución de Salud (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dr. Morales - Clínica Los Andes Tunja"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resumen de medicamentos recetados (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Losartán 50mg, Acetaminofén, Suero"
                  value={medicationsSummary}
                  onChange={(e) => setMedicationsSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Archivo de la Fórmula (PDF, JPG, PNG máx. 10MB) *
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#00A86B] transition-colors cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSimulateFile}
                    className="hidden"
                    id="rx-upload"
                  />
                  <label htmlFor="rx-upload" className="cursor-pointer block">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {selectedFileName ? (
                      <span className="font-bold text-[#00A86B] block">
                        Archivo seleccionado: {selectedFileName}
                      </span>
                    ) : (
                      <>
                        <span className="font-bold text-slate-700 block">
                          Haz clic para subir o arrastra aquí tu documento
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Formatos admitidos: PDF, JPG o PNG
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                Al subir este documento autorizo a Farmaboy para el tratamiento de datos de salud con el único fin de validación y dispensación farmacéutica.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold shadow-md shadow-[#00A86B]/20"
                >
                  {isUploading ? "Cifrando y subiendo..." : "Guardar Fórmula"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
