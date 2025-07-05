import { withProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Poem } from "@/types";
import { useLocation } from "react-router-dom";

export const OnePoemPage = withProtectedRoute(() => {
  const location = useLocation();
  const poem: Poem = location.state?.poem;

  if (!poem) {
    return <div>No poem found.</div>;
  }

  return (
    <ScrollArea className="h-full w-full">
      <h1>{poem!.title}</h1>
      <p className="text-sm text-muted-foreground">
        Written on{" "}
        {new Date(poem!.createdAt!).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="py-4 whitespace-pre-line">{poem.content!}</p>
      <p>- {poem.author!.name}</p>
    </ScrollArea>
  );
});
