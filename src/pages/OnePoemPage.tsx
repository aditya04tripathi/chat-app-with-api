import { useGetPoemById } from "@/api/queries";
import { withProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

export const OnePoemPage = withProtectedRoute(() => {
  const params = useParams();
  const poemById = useGetPoemById(params.poemId!);

  if (poemById.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full ">
      <Helmet>
        <title>{poemById.data.message!.title} | I ❤️ YOU</title>
        <meta name="description" content={`Read the poem "${poemById.data.message!.title}" by ${poemById.data.message!.author!.name}.`} />
      </Helmet>
      <div className="h-full min-h-[calc(100vh-8rem)] flex items-center justify-center flex-col">
        <h1>{poemById.data.message!.title}</h1>
        <p className="text-sm text-center text-muted-foreground">
          Written on{" "}
          {new Date(poemById.data.message!.createdAt!).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="py-4 text-center whitespace-pre-line">{poemById.data.message.content!}</p>
        <h3>- {poemById.data.message.author!.name}</h3>
      </div>
    </ScrollArea>
  );
});
