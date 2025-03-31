// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  persons;
  userCurrentId;
  personCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.persons = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.personCurrentId = 1;
    this.createUser({
      username: "admin",
      password: "admin123"
      // In a real app, this would be hashed
    });
    const samplePersons = [
      {
        name: "Sarah Johnson",
        title: "Marketing Manager",
        message: "Dear Sarah,\n\nYour creativity, passion, and dedication have been an inspiration to all of us. The marketing department won't be the same without your brilliant ideas and warm personality. Your contributions have helped shape our company's image and success.\n\nAs you embark on this new chapter of your journey, we wish you all the best. May your future be filled with exciting opportunities, continued growth, and happiness.\n\nYou'll always be part of our team's story. Don't forget to stay in touch!\n\nWith gratitude,\nThe Entire Team",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        musicTitle: "Time of Your Life",
        musicArtist: "Green Day"
      },
      {
        name: "David Chen",
        title: "Lead Developer",
        message: "Dear David,\n\nYour technical expertise and problem-solving skills have been invaluable to our team. You've helped us overcome countless challenges and your mentorship has elevated everyone around you.\n\nWe'll miss your coding wizardry and thoughtful approach to every project. Your new team is incredibly lucky to have you joining them.\n\nBest wishes on your new adventure!\n\nSincerely,\nYour Development Team",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        musicTitle: "Memories",
        musicArtist: "Maroon 5"
      },
      {
        name: "Maria Rodriguez",
        title: "UX Designer",
        message: "Dear Maria,\n\nYour eye for design and understanding of user needs has transformed our products. Your creativity and attention to detail have set a new standard for our design team.\n\nWe'll miss your innovative ideas and your ability to advocate for the user in every decision. Your portfolio of work here will continue to inspire us.\n\nWishing you continued success in your next role!\n\nWarmly,\nThe Product Team",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        musicTitle: "See You Again",
        musicArtist: "Wiz Khalifa"
      }
    ];
    for (const person of samplePersons) {
      this.createPerson(person);
    }
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllPersons() {
    return Array.from(this.persons.values());
  }
  async getPerson(id) {
    return this.persons.get(id);
  }
  async createPerson(insertPerson) {
    const id = this.personCurrentId++;
    const person = { ...insertPerson, id };
    this.persons.set(id, person);
    return person;
  }
  async updatePerson(id, updateData) {
    const person = this.persons.get(id);
    if (!person) return void 0;
    const updatedPerson = { ...person, ...updateData };
    this.persons.set(id, updatedPerson);
    return updatedPerson;
  }
  async deletePerson(id) {
    return this.persons.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var persons = pgTable("persons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url").notNull(),
  musicUrl: text("music_url").notNull(),
  musicTitle: text("music_title").notNull(),
  musicArtist: text("music_artist").notNull()
});
var insertPersonSchema = createInsertSchema(persons).omit({
  id: true
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.get("/api/persons", async (_req, res) => {
    try {
      const persons2 = await storage.getAllPersons();
      return res.json(persons2);
    } catch (error) {
      console.error("Error fetching persons:", error);
      return res.status(500).json({ message: "Failed to fetch persons" });
    }
  });
  app2.get("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ message: "Person not found" });
      }
      return res.json(person);
    } catch (error) {
      console.error(`Error fetching person ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch person" });
    }
  });
  app2.post("/api/persons", async (req, res) => {
    try {
      const personData = insertPersonSchema.parse(req.body);
      const newPerson = await storage.createPerson(personData);
      return res.status(201).json(newPerson);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      console.error("Error creating person:", error);
      return res.status(500).json({ message: "Failed to create person" });
    }
  });
  app2.patch("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const partialPersonSchema = insertPersonSchema.partial();
      const updateData = partialPersonSchema.parse(req.body);
      const updatedPerson = await storage.updatePerson(id, updateData);
      if (!updatedPerson) {
        return res.status(404).json({ message: "Person not found" });
      }
      return res.json(updatedPerson);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      console.error(`Error updating person ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update person" });
    }
  });
  app2.delete("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const success = await storage.deletePerson(id);
      if (!success) {
        return res.status(404).json({ message: "Person not found" });
      }
      return res.status(204).end();
    } catch (error) {
      console.error(`Error deleting person ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete person" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
