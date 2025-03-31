import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { PersonalPage } from "@/components/PersonalPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Person } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonPage() {
  const { id } = useParams();
  const personId = id ? parseInt(id, 10) : null;

  const { data: person, isLoading, error } = useQuery<Person>({
    queryKey: [`/api/persons/${personId}`],
    enabled: !!personId,
  });

  if (!personId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Person ID</h2>
          <p className="text-gray-600 dark:text-gray-300">Please provide a valid person identifier.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {isLoading ? (
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <Skeleton className="h-48 w-full" />
                  <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2 flex justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                  </div>
                </div>
                
                <div className="pt-20 pb-8 px-6 text-center">
                  <Skeleton className="h-8 w-2/3 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/3 mx-auto mb-8" />
                  
                  <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  
                  <Skeleton className="h-16 w-full max-w-md mx-auto mb-6" />
                  
                  <Skeleton className="h-10 w-40 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto py-16 px-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Person</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {error instanceof Error ? error.message : "This person may not exist or an error occurred."}
            </p>
          </div>
        ) : person ? (
          <PersonalPage person={person} />
        ) : (
          <div className="container mx-auto py-16 px-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Person Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">The person you're looking for doesn't exist.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
