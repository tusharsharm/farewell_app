import { db } from "../server/db";
import { users, persons } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");

  // Create admin user
  const existingAdminUser = await db.select().from(users).where(eq(users.username, "admin"));
  
  if (existingAdminUser.length === 0) {
    await db.insert(users).values({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    console.log("Added admin user");
  } else {
    console.log("Admin user already exists");
  }

  // Add sample people
  const existingPersons = await db.select().from(persons);
  
  if (existingPersons.length === 0) {
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
      await db.insert(persons).values(person);
    }
    console.log(`Added ${samplePersons.length} sample persons`);
  } else {
    console.log(`Database already has ${existingPersons.length} persons`);
  }

  console.log("Database seeding complete!");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  });