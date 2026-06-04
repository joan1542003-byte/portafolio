import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, clearToken, getToken, setToken } from "../api/client";
import { hasLiveApi } from "../lib/projectsService";
import { LiquidGlass } from "../components/LiquidGlass";
import { Navbar } from "../components/Navbar";
import type { Project } from "../types/project";

const emptyProject = (): Omit<Project, "id"> => ({
  title: "",
  category: "",
  thumbnailUrl: "",
  backgroundColor: "#fffdf8",
  description: "",
  tags: [],
  gallery: [],
  heroTitle: "",
});

export function AdminPage() {
  const [token, setTokenState] = useState<string | null>(getToken);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id"> & { id?: string }>(emptyProject());
  const [tagsInput, setTagsInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const loadProjects = useCallback(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (token) loadProjects();
  }, [token, loadProjects]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const { token: t } = await api.login(password);
      setToken(t);
      setTokenState(t);
      loadProjects();
    } catch {
      setLoginError("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject());
    setTagsInput("");
    setGalleryInput("");
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ ...p });
    setTagsInput(p.tags.join(", "));
    setGalleryInput(p.gallery.join("\n"));
  };

  const parseForm = (): Omit<Project, "id"> & { id?: string } => ({
    ...form,
    tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    gallery: galleryInput.split("\n").map((u) => u.trim()).filter(Boolean),
  });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const data = parseForm();
    try {
      if (editing) {
        await api.updateProject(editing.id, data);
        setMessage("Proyecto actualizado");
      } else {
        await api.createProject(data);
        setMessage("Proyecto creado");
      }
      loadProjects();
      openCreate();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await api.deleteProject(id);
    loadProjects();
    if (editing?.id === id) openCreate();
  };

  if (!hasLiveApi) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 animate-gradient-bg">
        <LiquidGlass className="w-full max-w-md p-10 text-center" hover={false}>
          <h1 className="font-display text-3xl font-bold italic mb-4">Admin</h1>
          <p className="text-ink/65 font-light leading-relaxed">
            En producción los cambios los hace el asistente: dime qué quieres modificar
            (textos, proyectos, colores) y se publica automáticamente.
          </p>
          <Link to="/" className="inline-block mt-8 text-accent font-medium hover:underline">
            ← Volver al sitio
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 animate-gradient-bg">
        <LiquidGlass className="w-full max-w-md p-10" hover={false}>
          <h1 className="font-display text-3xl font-bold italic mb-2">Admin</h1>
          <p className="text-ink/60 text-sm font-light mb-8">Acceso restringido</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-squircle border border-ink/10 bg-white/60 px-5 py-3 font-light outline-none focus:border-accent"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="btn-scale w-full rounded-squircle bg-accent text-cream py-3 font-medium"
            >
              Entrar
            </button>
          </form>
          <Link to="/" className="block text-center mt-6 text-sm text-ink/50 hover:text-accent">
            ← Volver al sitio
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  return (
    <>
      <Navbar variant="home" />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="font-display text-4xl font-bold italic">Panel Admin</h1>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-accent hover:underline">
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-ink/50 hover:text-ink"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <LiquidGlass className="p-6 max-h-[70vh] overflow-y-auto" hover={false}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold italic">Proyectos</h2>
              <button
                type="button"
                onClick={openCreate}
                className="btn-scale text-sm rounded-full bg-accent text-cream px-4 py-2"
              >
                + Nuevo
              </button>
            </div>
            <ul className="space-y-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-white/30 px-4 py-3"
                >
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="text-left flex-1 hover:text-accent"
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="block text-xs text-ink/50">{p.category}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          </LiquidGlass>

          <LiquidGlass className="p-6" hover={false}>
            <h2 className="font-display text-xl font-bold italic mb-6">
              {editing ? "Editar proyecto" : "Nuevo proyecto"}
            </h2>
            {message && <p className="text-sm text-accent mb-4">{message}</p>}
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              {!editing && (
                <label className="block">
                  <span className="text-ink/60">ID (slug, opcional)</span>
                  <input
                    className="mt-1 w-full rounded-2xl border border-ink/10 bg-white/50 px-4 py-2"
                    value={form.id ?? ""}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="mi-proyecto"
                  />
                </label>
              )}
              {[
                ["Título", "title"],
                ["Categoría", "category"],
                ["URL miniatura", "thumbnailUrl"],
                ["Color fondo (hex)", "backgroundColor"],
                ["Título hero", "heroTitle"],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="text-ink/60">{label}</span>
                  <input
                    className="mt-1 w-full rounded-2xl border border-ink/10 bg-white/50 px-4 py-2"
                    value={String(form[key as keyof typeof form] ?? "")}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-ink/60">Descripción</span>
                <textarea
                  className="mt-1 w-full rounded-2xl border border-ink/10 bg-white/50 px-4 py-2 min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-ink/60">Tags (separados por coma)</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-ink/10 bg-white/50 px-4 py-2"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-ink/60">Galería (una URL por línea)</span>
                <textarea
                  className="mt-1 w-full rounded-2xl border border-ink/10 bg-white/50 px-4 py-2 min-h-[120px]"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className="btn-scale w-full rounded-squircle bg-accent text-cream py-3 font-medium"
              >
                {editing ? "Guardar cambios" : "Crear proyecto"}
              </button>
            </form>
          </LiquidGlass>
        </div>
      </div>
    </>
  );
}
