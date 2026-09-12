"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, label = "Imagen", className = "" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdminStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Por favor selecciona un archivo de imagen válido.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast("La imagen es demasiado pesada (Máx 5MB).", "warning");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        showToast("Imagen subida con éxito", "success");
      } else {
        showToast(data.error || "Error subiendo la imagen", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de red al subir la imagen", "error");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-slate-300 font-bold mb-1 text-sm">{label}</label>}
      
      <div className="flex items-center gap-3">
        {/* Preview / URL input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <ImageIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... o sube una imagen"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400"
              title="Limpiar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label.replace(/\s+/g, '-')}`}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-700 transition-colors shrink-0"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                Subiendo...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                Subir
              </>
            )}
          </button>
        </div>
      </div>
      
      {value && (
        <div className="mt-3 relative w-full h-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4=';
          }} />
        </div>
      )}
    </div>
  );
}
