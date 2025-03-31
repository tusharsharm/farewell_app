import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all persons
  app.get("/api/persons", async (_req: Request, res: Response) => {
    try {
      const persons = await storage.getAllPersons();
      return res.json(persons);
    } catch (error) {
      console.error("Error fetching persons:", error);
      return res.status(500).json({ message: "Failed to fetch persons" });
    }
  });

  // Get a specific person by ID
  app.get("/api/persons/:id", async (req: Request, res: Response) => {
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

  // Create a new person
  app.post("/api/persons", async (req: Request, res: Response) => {
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

  // Update an existing person
  app.patch("/api/persons/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Validate only the fields that are present in the request body
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

  // Delete a person
  app.delete("/api/persons/:id", async (req: Request, res: Response) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
