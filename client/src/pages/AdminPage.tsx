import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api, clearToken, getToken, setToken } from "../api/client";
import { LiquidGlass } from "../components/LiquidGlass";
import { checkApiAvailable } from "../lib/projectsService";
import type { Project, SiteContent, Tool } from "../types/project";

type Tab = "projects" | "site" | "tools";

const emptyProject = (): Partial<Project> => ({
  title: "",
  category: "",
  thumbnailUrl: "",
  backgroundColor: "#fffdf8",
  description: "",
  tags: [],
  gallery: [],
  heroTitle: "",
  featured: true,
  isNew: false,
});

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-ink/50 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/80 bg-white/45 px-4 py-2.5 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20";

export function AdminPage() {
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("projects");
  const [message, setMessage] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>(emptyProject());
  const [tagsInput, setTagsInput] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const [site, setSite] = useState<SiteContent | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    checkApiAvailable().then(setApiOk);
  }, []);

  useEffect(() => {
    if (!token) return;
    api.verify().then(({ valid }) => {
      if (!valid) {
        clearToken();
        setTokenState(null);
      }
    });
  }, [token]);

  const loadAll = useCallback(async () => {
    const [p, s, t] = await Promise.all([
      api.getProjects(),
      api.getSite(),
      api.getTools(),
    ]);
    setProjects(p);
    setSite(s);
    setTools(t);
  }, []);

  useEffect(() => {
    if (token && apiOk) loadAll().catch(console.error);
  }, [token, apiOk, loadAll]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const { token: t } = await api.login(password);
      setToken(t);
      setTokenState(t);
      await loadAll();
    } catch {
      setLoginError("Contraseña incorrecta o API no disponible");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    clearToken();
    setTokenState(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject());
    setTagsInput("");
    setGallery([]);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ ...p });
    setTagsInput(p.tags.join(", "));
    setGallery([...p.gallery]);
    setTab("projects");
  };

  const parseForm = (): Partial<Project> => ({
    ...form,
    tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    gallery,
  });

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const data = parseForm();
    try {
      if (editing) {
        await api.updateProject(editing.id, data);
        setMessage("Proyecto guardado");
      } else {
        await api.createProject(data);
        setMessage("Proyecto creado");
      }
      await loadAll();
      openCreate();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const moveProject = async (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex((p) => p.id === id);
    const next = idx + dir;
    if (next < 0 || next >= projects.length) return;
    const ids = [...projects];
    [ids[idx], ids[next]] = [ids[next], ids[idx]];
    const reordered = await api.reorderProjects(ids.map((p) => p.id));
    setProjects(reordered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await api.deleteProject(id);
    await loadAll();
    if (editing?.id === id) openCreate();
  };

  const handleSaveSite = async (e: FormEvent) => {
    e.preventDefault();
    if (!site) return;
    await api.updateSite(site);
    setMessage("Contenido del sitio guardado");
  };

  const handleSaveTools = async (e: FormEvent) => {
    e.preventDefault();
    await api.updateTools(tools);
    setMessage("Herramientas guardadas");
  };

  if (apiOk === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 animate-gradient-bg">
        <LiquidGlass className="max-w-md p-10 text-center" hover={false}>
          <h1 className="font-display text-2xl font-bold italic mb-4">API offline</h1>
          <p className="text-ink/60 font-light text-sm leading-relaxed">
            El panel admin requiere el servidor Express en producción (Render).
            El sitio público sigue funcionando con datos estáticos.
          </p>
          <Link to="/" className="link-accent mt-6 inline-block text-sm">
            ← Volver
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 animate-gradient-bg">
        <div className="grain" aria-hidden />
        <LiquidGlass className="w-full max-w-md p-10 relative z-10" hover={false}>
          <h1 className="font-display text-3xl font-bold italic mb-2">Admin</h1>
          <p className="text-ink/55 text-sm font-light mb-8">
            Acceso protegido · sesión 12h · máx. 5 intentos / 15 min
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={inputClass}
              autoComplete="current-password"
            />
            {loginError && <p className="text-sm text-red-600/90">{loginError}</p>}
            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>
          <Link to="/" className="block text-center mt-8 text-sm text-ink/45 hover:text-accent">
            ← Sitio público
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-gradient-bg pb-20">
      <div className="grain" aria-hidden />
      <header className="sticky top-0 z-40 border-b border-white/50 bg-cream/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-2xl font-bold italic">Panel Admin</h1>
          <nav className="flex gap-2 ml-auto">
            {(["projects", "site", "tools"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-accent text-cream"
                    : "bg-white/40 text-ink/60 hover:text-accent"
                }`}
              >
                {t === "projects" ? "Proyectos" : t === "site" ? "Sitio" : "Herramientas"}
              </button>
            ))}
          </nav>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link to="/" className="btn-ghost text-xs">
              Ver sitio
            </Link>
            <button type="button" onClick={handleLogout} className="btn-ghost text-xs">
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
        {message && (
          <p className="text-center text-sm text-accent pb-2 font-medium">{message}</p>
        )}
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {tab === "projects" && (
          <div className="grid lg:grid-cols-5 gap-8">
            <LiquidGlass className="lg:col-span-2 p-5 max-h-[75vh] overflow-y-auto" hover={false}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-lg font-bold italic">Lista</h2>
                <button type="button" onClick={openCreate} className="btn-ghost !py-1.5 !px-3 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Nuevo
                </button>
              </div>
              <ul className="space-y-2">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 border transition-colors ${
                      editing?.id === p.id
                        ? "border-accent/30 bg-white/55"
                        : "border-white/60 bg-white/25"
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-ink/25 shrink-0" />
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="flex-1 text-left min-w-0"
                    >
                      <span className="font-medium text-sm truncate block">{p.title}</span>
                      <span className="text-[10px] text-ink/45">{p.category}</span>
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveProject(p.id, -1)}
                        className="p-1 hover:text-accent"
                        aria-label="Subir"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(p.id, 1)}
                        className="p-1 hover:text-accent"
                        aria-label="Bajar"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-500/80 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </LiquidGlass>

            <LiquidGlass className="lg:col-span-3 p-6" hover={false}>
              <h2 className="font-display text-lg font-bold italic mb-6">
                {editing ? "Editar proyecto" : "Nuevo proyecto"}
              </h2>
              <form onSubmit={handleSaveProject} className="space-y-4">
                {!editing && (
                  <Field label="ID (slug)">
                    <input
                      className={inputClass}
                      value={form.id ?? ""}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="mi-proyecto"
                    />
                  </Field>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Título">
                    <input
                      className={inputClass}
                      value={form.title ?? ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </Field>
                  <Field label="Categoría">
                    <input
                      className={inputClass}
                      value={form.category ?? ""}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Título hero">
                  <input
                    className={inputClass}
                    value={form.heroTitle ?? ""}
                    onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                  />
                </Field>
                <Field label="URL miniatura">
                  <input
                    className={inputClass}
                    value={form.thumbnailUrl ?? ""}
                    onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  />
                </Field>
                <Field label="Color fondo (hex)">
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={form.backgroundColor ?? "#fffdf8"}
                      onChange={(e) =>
                        setForm({ ...form, backgroundColor: e.target.value })
                      }
                      className="h-10 w-14 rounded-lg border border-white/80 cursor-pointer"
                    />
                    <input
                      className={inputClass}
                      value={form.backgroundColor ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, backgroundColor: e.target.value })
                      }
                    />
                  </div>
                </Field>
                <Field label="Descripción">
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    value={form.description ?? ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
                <Field label="Tags (coma)">
                  <input
                    className={inputClass}
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </Field>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.featured ?? true}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    Destacado
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isNew ?? false}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    />
                    Badge Nuevo
                  </label>
                </div>
                <Field label="Galería de imágenes">
                  <ul className="space-y-2 mb-3">
                    {gallery.map((url, i) => (
                      <li
                        key={`${url}-${i}`}
                        className="flex gap-2 items-center rounded-xl bg-white/35 px-3 py-2"
                      >
                        <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <input
                          className={`${inputClass} flex-1`}
                          value={url}
                          onChange={(e) => {
                            const next = [...gallery];
                            next[i] = e.target.value;
                            setGallery(next);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                          className="text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder="https://..."
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-ghost shrink-0"
                      onClick={() => {
                        if (newGalleryUrl.trim()) {
                          setGallery([...gallery, newGalleryUrl.trim()]);
                          setNewGalleryUrl("");
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </Field>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Save className="w-4 h-4" />
                  {editing ? "Guardar cambios" : "Crear proyecto"}
                </button>
              </form>
            </LiquidGlass>
          </div>
        )}

        {tab === "site" && site && (
          <LiquidGlass className="p-8 max-w-3xl" hover={false}>
            <form onSubmit={handleSaveSite} className="space-y-8">
              <section className="space-y-4">
                <h3 className="font-display text-xl font-bold italic">Hero</h3>
                <Field label="Eyebrow">
                  <input
                    className={inputClass}
                    value={site.hero.eyebrow}
                    onChange={(e) =>
                      setSite({ ...site, hero: { ...site.hero, eyebrow: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Título (palabras separadas por coma)">
                  <input
                    className={inputClass}
                    value={site.hero.titleWords.join(", ")}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        hero: {
                          ...site.hero,
                          titleWords: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Subtítulo">
                  <textarea
                    className={`${inputClass} min-h-[80px]`}
                    value={site.hero.subtitle}
                    onChange={(e) =>
                      setSite({ ...site, hero: { ...site.hero, subtitle: e.target.value } })
                    }
                  />
                </Field>
              </section>
              <section className="space-y-4">
                <h3 className="font-display text-xl font-bold italic">Sobre mí</h3>
                <Field label="Lead">
                  <textarea
                    className={`${inputClass} min-h-[60px]`}
                    value={site.about.lead}
                    onChange={(e) =>
                      setSite({ ...site, about: { ...site.about, lead: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Cuerpo">
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    value={site.about.body}
                    onChange={(e) =>
                      setSite({ ...site, about: { ...site.about, body: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Highlights (una por línea)">
                  <textarea
                    className={`${inputClass} min-h-[80px]`}
                    value={site.about.highlights.join("\n")}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        about: {
                          ...site.about,
                          highlights: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                  />
                </Field>
              </section>
              <section className="space-y-4">
                <h3 className="font-display text-xl font-bold italic">Contacto</h3>
                <Field label="Email">
                  <input
                    className={inputClass}
                    value={site.contact.email}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        contact: { ...site.contact, email: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="LinkedIn">
                  <input
                    className={inputClass}
                    value={site.contact.linkedin}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        contact: { ...site.contact, linkedin: e.target.value },
                      })
                    }
                  />
                </Field>
              </section>
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4" />
                Guardar sitio
              </button>
            </form>
          </LiquidGlass>
        )}

        {tab === "tools" && (
          <LiquidGlass className="p-8" hover={false}>
            <form onSubmit={handleSaveTools} className="space-y-6">
              {tools.map((tool, i) => (
                <div
                  key={tool.id}
                  className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/30 border border-white/60"
                >
                  <Field label="Nombre">
                    <input
                      className={inputClass}
                      value={tool.name}
                      onChange={(e) => {
                        const next = [...tools];
                        next[i] = { ...tool, name: e.target.value };
                        setTools(next);
                      }}
                    />
                  </Field>
                  <Field label="Descripción">
                    <input
                      className={inputClass}
                      value={tool.description}
                      onChange={(e) => {
                        const next = [...tools];
                        next[i] = { ...tool, description: e.target.value };
                        setTools(next);
                      }}
                    />
                  </Field>
                </div>
              ))}
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4" />
                Guardar herramientas
              </button>
            </form>
          </LiquidGlass>
        )}
      </div>
    </div>
  );
}
