import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");
const SITE_PATH = path.join(DATA_DIR, "site.json");
const TOOLS_PATH = path.join(DATA_DIR, "tools.json");

const PORT = Number(process.env.PORT) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "portfolio2024";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  backgroundColor: string;
  description: string;
  tags: string[];
  gallery: string[];
  heroTitle?: string;
  order: number;
  featured: boolean;
  isNew: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    titleWords: string[];
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  about: {
    title: string;
    lead: string;
    body: string;
    highlights: string[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    linkedin: string;
    location: string;
  };
  toolsTitle: string;
  toolsSubtitle: string;
}

const sessions = new Map<string, number>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function createToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function isValidSession(token: string | null): boolean {
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp) return false;
  if Date.now() > exp) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_LOGIN_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!isValidSession(token)) {
    res.status(401).json({ error: "Sesión inválida o expirada" });
    return;
  }
  next();
}

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  })
);
app.use(express.json({ limit: "4mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const ip = req.ip || "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Demasiados intentos. Espera 15 minutos." });
    return;
  }
  const { password } = req.body as { password?: string };
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }
  const token = createToken();
  sessions.set(token, Date.now() + TOKEN_TTL_MS);
  res.json({ token, expiresIn: TOKEN_TTL_MS });
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) sessions.delete(token);
  res.status(204).send();
});

app.get("/api/auth/verify", (req, res) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  res.json({ valid: isValidSession(token) });
});

app.get("/api/site", async (_req, res) => {
  try {
    const site = await readJson<SiteContent>(SITE_PATH);
    res.json(site);
  } catch {
    res.status(500).json({ error: "Error al leer sitio" });
  }
});

app.put("/api/site", authMiddleware, async (req, res) => {
  try {
    await writeJson(SITE_PATH, req.body as SiteContent);
    res.json(req.body);
  } catch {
    res.status(500).json({ error: "Error al guardar sitio" });
  }
});

app.get("/api/tools", async (_req, res) => {
  try {
    const tools = await readJson<Tool[]>(TOOLS_PATH);
    res.json(tools.sort((a, b) => a.order - b.order));
  } catch {
    res.status(500).json({ error: "Error al leer herramientas" });
  }
});

app.put("/api/tools", authMiddleware, async (req, res) => {
  try {
    const tools = req.body as Tool[];
    await writeJson(TOOLS_PATH, tools);
    res.json(tools);
  } catch {
    res.status(500).json({ error: "Error al guardar herramientas" });
  }
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = sortProjects(await readJson<Project[]>(PROJECTS_PATH));
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Error al leer proyectos" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const projects = await readJson<Project[]>(PROJECTS_PATH);
    const project = projects.find((p) => p.id === req.params.id);
    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: "Error al leer proyecto" });
  }
});

app.post("/api/projects/reorder", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body as { ids: string[] };
    const projects = await readJson<Project[]>(PROJECTS_PATH);
    const reordered = ids
      .map((id, index) => {
        const p = projects.find((x) => x.id === id);
        return p ? { ...p, order: index } : null;
      })
      .filter(Boolean) as Project[];
    const remaining = projects
      .filter((p) => !ids.includes(p.id))
      .map((p, i) => ({ ...p, order: reordered.length + i }));
    await writeJson(PROJECTS_PATH, sortProjects([...reordered, ...remaining]));
    res.json(await readJson<Project[]>(PROJECTS_PATH));
  } catch {
    res.status(500).json({ error: "Error al reordenar" });
  }
});

app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await readJson<Project[]>(PROJECTS_PATH);
    const body = req.body as Partial<Project>;
    const maxOrder = projects.reduce((m, p) => Math.max(m, p.order), -1);
    const project: Project = {
      id: body.id?.trim() || uuidv4(),
      title: body.title ?? "",
      category: body.category ?? "",
      thumbnailUrl: body.thumbnailUrl ?? "",
      backgroundColor: body.backgroundColor ?? "#fffdf8",
      description: body.description ?? "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      heroTitle: body.heroTitle,
      order: body.order ?? maxOrder + 1,
      featured: body.featured ?? true,
      isNew: body.isNew ?? false,
    };
    projects.push(project);
    await writeJson(PROJECTS_PATH, sortProjects(projects));
    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: "Error al crear proyecto" });
  }
});

app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const projects = await readJson<Project[]>(PROJECTS_PATH);
    const index = projects.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    projects[index] = { ...projects[index], ...req.body, id: req.params.id };
    await writeJson(PROJECTS_PATH, sortProjects(projects));
    res.json(projects[index]);
  } catch {
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
});

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const projects = await readJson<Project[]>(PROJECTS_PATH);
    const filtered = projects.filter((p) => p.id !== req.params.id);
    if (filtered.length === projects.length) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    await writeJson(
      PROJECTS_PATH,
      sortProjects(filtered.map((p, i) => ({ ...p, order: i })))
    );
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
});

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});
