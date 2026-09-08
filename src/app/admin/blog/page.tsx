"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { BlogPost } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const emptyPost: Omit<BlogPost, "id" | "publishDate"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
  author: "Dra. Carolina Vargas — Químico Farmacéutico FarmaBoy",
  category: "Consejos Farmacéuticos",
  tags: ["Salud", "Boyacá"],
  isPublished: true,
  metaTitle: "",
  metaDescription: "",
};

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, hasPermission } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState(emptyPost);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("contenido:write");

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData(emptyPost);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updateBlogPost(editingPost.id, formData);
    } else {
      addBlogPost(formData);
    }
    setIsModalOpen(false);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slug,
      metaTitle: val + " | Farmaboy Boyacá",
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Blog de Salud, Prevención & Consejos Farmacéuticos
          </h2>
          <p className="text-xs text-slate-400">
            Artículos educativos avalados por profesionales de la salud para la comunidad boyacense
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo de Salud</span>
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition group"
          >
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500 text-slate-950">
                  {post.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    post.isPublished
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {post.isPublished ? "PUBLICADO" : "BORRADOR"}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {post.publishDate}
              </p>
              <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
              <p className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-800/80">
                Por: {post.author}
              </p>
            </div>

            <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]">
                /{post.slug}
              </span>

              {canWrite && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(post.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                {editingPost ? "Editar Artículo" : "Redactar Nuevo Artículo"}
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
                <label className="block text-slate-300 font-bold mb-1">Título del Artículo *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej. Cuidados esenciales para el almacenamiento de medicamentos en casa"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Slug URL (amigable) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Consejos Farmacéuticos">Consejos Farmacéuticos</option>
                    <option value="Salud y Prevención">Salud y Prevención</option>
                    <option value="Bienestar Familiar">Bienestar Familiar</option>
                    <option value="Cuidado del Adulto Mayor">Cuidado del Adulto Mayor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Autor Profesional *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Estado de Publicación</label>
                  <select
                    value={formData.isPublished ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.value === "true" })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="true">Publicado (Visible en tienda)</option>
                    <option value="false">Borrador (Oculto)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL de Imagen Principal *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Resumen Corto (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve introducción orientativa..."
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contenido Completo del Artículo *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el artículo con recomendaciones, dosis orientativas y precauciones..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none font-sans"
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
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Mover artículo a papelera?"
        message="El artículo dejará de ser visible en la sección de blog y salud de Farmaboy."
        confirmText="Mover a Papelera"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteBlogPost(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
