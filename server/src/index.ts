import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../data/projects.json");
const PORT = Number(process.env.PORT) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "portfolio2024";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-token-xyz";

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
}

async function readProjects(): Promise<Project[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Project[];
}

async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2), "utf-8");
}

function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }
  res.json({ token: ADMIN_TOKEN });
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await readProjects();
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Error al leer proyectos" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const projects = await readProjects();
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

app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await readProjects();
    const body = req.body as Omit<Project, "id"> & { id?: string };
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
    };
    projects.push(project);
    await writeProjects(projects);
    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: "Error al crear proyecto" });
  }
});

app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const projects = await readProjects();
    const index = projects.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    const body = req.body as Partial<Project>;
    projects[index] = { ...projects[index], ...body, id: req.params.id };
    await writeProjects(projects);
    res.json(projects[index]);
  } catch {
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
});

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== req.params.id);
    if (filtered.length === projects.length) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    await writeProjects(filtered);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
});

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});
