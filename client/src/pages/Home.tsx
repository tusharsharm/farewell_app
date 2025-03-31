import { useQuery } from "@tanstack/react-query";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Person } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: persons, isLoading, error } = useQuery<Person[]>({
    queryKey: ['/api/persons'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {isLoading ? (
          <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto py-16 px-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
          </div>
        ) : (
          <AdminDashboard persons={persons || []} />
        )}
      </main>
      <Footer />
    </div>
  );
}
