import { withProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Poem } from "@/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/hooks/redux";
import { toast } from "sonner";
import { useGetPoems } from "@/api/queries";
import { useAddPoem, useDeletePoem } from "@/api/mutations";
import { useQueryClient } from "@tanstack/react-query";

export const PoemsPage = withProtectedRoute(() => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const queryClient = useQueryClient();

  const getPoems = useGetPoems();
  const addPoem = useAddPoem();
  const deletePoem = useDeletePoem();

  const handleDeletePoem = async (poemId: string) => {
    try {
      const deletePoemResponse = await deletePoem.mutateAsync({
        id: poemId,
        token: auth.accessToken!,
      });

      toast.success(deletePoemResponse.message || "Poem deleted successfully! We will miss it! 😢");

      queryClient.invalidateQueries({
        queryKey: ["getPoems"],
      });
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleAddPoem = async () => {
    try {
      const addPoemResponse = await addPoem.mutateAsync({
        title,
        content,
        token: auth.accessToken!,
      });

      toast.success(addPoemResponse.message || "Kudos! Poem added, add more to show your love, how much you care about them! ❤️");

      queryClient.invalidateQueries({
        queryKey: ["getPoems"],
      });
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setTitle("");
      setContent("");
      setDialogOpen(false);
    }
  };

  if (getPoems.isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full px-5 md:px-0">
      <div className="pb-5 pt-2.5 flex flex-col gap-2 md:flex-row items-center justify-between">
        <h1 className="w-full md:w-fit md:flex-1">Read away 📖</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-fit flex-1 md:flex-0 flex items-center gap-2">
              <Plus />
              <span>Add Poem</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new poem</DialogTitle>
              <DialogDescription>Add a new poem, and show your loved one how much you care about them.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-stretch justify-center gap-4">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your creation a title..." />
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Let your inner author fly..." />
            </div>
            <DialogFooter>
              <Button onClick={handleAddPoem}>Add poem</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {getPoems.data.message.length === 0 ? (
        <div className="my-10 flex items-center justify-center h-full">
          <p className="text-gray-500">No poems available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getPoems.data.message!.map((poem: Poem) => (
            <Card>
              <CardHeader>
                <CardTitle>{poem.title}</CardTitle>
                <CardDescription>
                  Written by {poem!.author!.name} on{" "}
                  {new Date(poem!.createdAt!).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{poem!.content!.slice(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Button className="flex-1 w-full md:w-fit" onClick={() => navigate(`/poems/${poem.id}`, { state: { poem } })}>
                  Read More <Ellipsis />
                </Button>
                {poem!.authorId === auth.user!.id && (
                  <Button className="flex-1 w-full md:w-fit" variant="destructive" onClick={() => handleDeletePoem(poem.id!)}>
                    Delete <Trash2 />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
});
