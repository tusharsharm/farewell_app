import { useState } from "react";
import { useLocation } from "wouter";
import { 
  UserPlus, 
  QrCode, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeModal } from "./QRCodeModal";
import { AddEditPersonDialog } from "./AddEditPersonDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Person } from "@shared/schema";

interface AdminDashboardProps {
  persons: Person[];
}

export function AdminDashboard({ persons }: AdminDashboardProps) {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/persons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/persons'] });
      toast({
        title: "Success",
        description: "Person deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete person: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Filter persons based on search query
  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPerson = (id: number) => {
    navigate(`/person/${id}`);
  };

  const handleShowQRCode = (person: Person) => {
    setSelectedPerson(person);
    setIsQRModalOpen(true);
  };

  const handleAddPerson = () => {
    setEditPerson(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditPerson(person);
    setIsAddEditModalOpen(true);
  };

  const handleDeletePerson = (id: number) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleGenerateAllQRCodes = () => {
    // In a real application, this would generate a PDF with all QR codes
    toast({
      title: "QR Codes Generation",
      description: "This would generate a PDF with all QR codes in a real application.",
    });
  };

  const handleExportData = () => {
    // In a real application, this would export all data as JSON/CSV
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(persons));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "farewell_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome, Admin</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage farewell pages for all team members. Click on a person to view or edit their farewell page.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            onClick={handleAddPerson}
            className="bg-primary hover:bg-indigo-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Person
          </Button>
          <Button
            onClick={handleGenerateAllQRCodes}
            className="bg-secondary hover:bg-amber-600"
          >
            <QrCode className="mr-2 h-4 w-4" />
            Generate All QR Codes
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="border-gray-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-1/3"
          />
        </div>
      </div>

      {filteredPersons.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No people found. Add someone to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPersons.map((person) => (
            <div key={person.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-600">
                <img 
                  src={person.photoUrl} 
                  alt={person.name} 
                  className="object-cover w-full h-48"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{person.name}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm mb-3">{person.title}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewPerson(person.id)}
                      className="text-primary dark:text-indigo-400 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEditPerson(person)}
                      className="text-gray-500 dark:text-gray-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePerson(person.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <button 
                    onClick={() => handleShowQRCode(person)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  >
                    <QrCode size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {persons.length > 8 && (
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button variant="outline" size="sm">
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedPerson && (
        <QRCodeModal
          person={selectedPerson}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      {/* Add/Edit Person Modal */}
      <AddEditPersonDialog
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        person={editPerson}
      />
    </div>
  );
}
