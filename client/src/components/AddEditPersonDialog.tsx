import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Person, insertPersonSchema } from "@shared/schema";

interface AddEditPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: Person | null;
}

// Extend the schema with validation
const formSchema = insertPersonSchema.extend({
  photoUrl: z.string().url({ message: "Please enter a valid URL for the photo" }),
  musicUrl: z.string().url({ message: "Please enter a valid URL for the music" }),
});

export function AddEditPersonDialog({ open, onOpenChange, person }: AddEditPersonDialogProps) {
  const isEditMode = !!person;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: person?.name || "",
      title: person?.title || "",
      message: person?.message || "",
      photoUrl: person?.photoUrl || "",
      musicUrl: person?.musicUrl || "",
      musicTitle: person?.musicTitle || "",
      musicArtist: person?.musicArtist || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/persons", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/persons'] });
      toast({
        title: "Success",
        description: "Person added successfully",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add person: ${error}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; formData: z.infer<typeof formSchema> }) => {
      const response = await apiRequest("PATCH", `/api/persons/${data.id}`, data.formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/persons'] });
      toast({
        title: "Success",
        description: "Person updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update person: ${error}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    if (isEditMode && person) {
      updateMutation.mutate({ id: person.id, formData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Person" : "Add New Person"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title/Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farewell Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your farewell message here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="musicUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Music URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/music.mp3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="musicTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Time of Your Life" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="musicArtist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Green Day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Add Person"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
