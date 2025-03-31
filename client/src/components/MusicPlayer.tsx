import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface MusicPlayerProps {
  songTitle: string;
  songArtist: string;
  audioUrl: string;
  autoPlay?: boolean;
}

export function MusicPlayer({ songTitle, songArtist, audioUrl, autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    
    // Auto play if enabled
    if (autoPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
    
    // Clean up
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioUrl, autoPlay]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Format time (convert seconds to MM:SS format)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Farewell Song</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-indigo-700 transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{songTitle}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{songArtist}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-24 md:w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
