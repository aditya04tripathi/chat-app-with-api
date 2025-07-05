import { withProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Poem } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Ellipsis, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/hooks/redux";
import { toast } from "sonner";

const BASE_URL = "http://localhost:3000";

export const PoemsPage = withProtectedRoute(() => {
  const [poem, setPoems] = useState<Poem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user);

  const fetchPoems = async () => {
    setLoading(true);
    const { data } = await axios.get(`${BASE_URL}/poems`);
    setPoems(data.message as Poem[]);
    setLoading(false);
  };

  const addPoem = async () => {
    const { data } = await axios.post(
      `${BASE_URL}/poems`,
      {
        title,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken!}`,
        },
      },
    );

    if (data.ok) {
      toast.success(
        "Let your loved one know, that you've written a poem for them 🥰",
      );
      fetchPoems();
    }
  };

  const deletePoem = async (id: string) => {
    const { data } = await axios.delete(`${BASE_URL}/poems/${id}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken!}`,
      },
    });

    if (data.ok) {
      toast.success(
        "Sad to see it go, but you can always write another one! 🥲",
      );
      fetchPoems();
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  if (loading) {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-fit flex-1 md:flex-0 flex items-center gap-2">
              <Plus />
              <span>Add Poem</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new poem</DialogTitle>
              <DialogDescription>
                Add a new poem, and show your loved one how much you care about
                them.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-stretch justify-center gap-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your creation a title..."
              />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Let your inner author fly..."
              />
            </div>
            <DialogFooter>
              <Button onClick={addPoem}>Add poem</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {poem.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No poems available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {poem!.map((poem: Poem) => (
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
              <CardFooter className="flex items-center justify-between gap-4">
                <Button
                  className="flex-1"
                  onClick={() =>
                    navigate(`/poems/${poem.id}`, { state: { poem } })
                  }
                >
                  Read More <Ellipsis />
                </Button>
                {poem!.authorId === user.id && (
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => deletePoem(poem.id!)}
                  >
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
