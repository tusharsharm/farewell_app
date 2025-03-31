import { MusicPlayer } from "./MusicPlayer";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Person } from "@shared/schema";

interface PersonalPageProps {
  person: Person;
}

export function PersonalPage({ person }: PersonalPageProps) {
  const { name, title, photoUrl, message, musicUrl, musicTitle, musicArtist } = person;

  // Format the message with proper line breaks
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-4">{line}</p>
    ));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Farewell Page`,
        text: `Check out ${name}'s farewell page!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Farewell card */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Banner and photo section */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-primary to-indigo-400"></div>
            <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2 flex justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 overflow-hidden bg-white">
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x400?text=No+Image";
                  }} 
                />
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div className="pt-20 pb-8 px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{title}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Farewell Message</h3>
              <div className="text-gray-700 dark:text-gray-200 font-serif leading-relaxed text-left">
                {formatMessage(message)}
              </div>
            </div>
            
            {/* Music Player */}
            <MusicPlayer 
              songTitle={musicTitle}
              songArtist={musicArtist}
              audioUrl={musicUrl}
              autoPlay={true}
            />
            
            <div className="mt-8">
              <Button 
                onClick={handleShare}
                className="bg-secondary hover:bg-amber-600 text-white"
              >
                <Share className="mr-2 h-4 w-4" />
                Share This Memory
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
