import { persons, type Person, type InsertPerson } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPersons(): Promise<Person[]>;
  getPerson(id: number): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: number, person: Partial<InsertPerson>): Promise<Person | undefined>;
  deletePerson(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private persons: Map<number, Person>;
  userCurrentId: number;
  personCurrentId: number;

  constructor() {
    this.users = new Map();
    this.persons = new Map();
    this.userCurrentId = 1;
    this.personCurrentId = 1;
    
    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    
    // Initialize with a few sample persons
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

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPersons(): Promise<Person[]> {
    return Array.from(this.persons.values());
  }

  async getPerson(id: number): Promise<Person | undefined> {
    return this.persons.get(id);
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = this.personCurrentId++;
    const person: Person = { ...insertPerson, id };
    this.persons.set(id, person);
    return person;
  }

  async updatePerson(id: number, updateData: Partial<InsertPerson>): Promise<Person | undefined> {
    const person = this.persons.get(id);
    if (!person) return undefined;

    const updatedPerson = { ...person, ...updateData };
    this.persons.set(id, updatedPerson);
    return updatedPerson;
  }

  async deletePerson(id: number): Promise<boolean> {
    return this.persons.delete(id);
  }
}

export const storage = new MemStorage();
