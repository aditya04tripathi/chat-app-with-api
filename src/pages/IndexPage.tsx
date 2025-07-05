import { useGetMessages } from "@/api/mutations";
import { withProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/hooks/redux";
import type { Message } from "@/types";
import clsx from "clsx";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";

export const IndexPage = withProtectedRoute(() => {
  const auth = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");

  const getMessages = useGetMessages();

  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = () => {
    const socket = io(import.meta.env.VITE_BASE_URL);
    setSocket(socket);

    console.log("socket conn done");

    socket.on("message", (msg: Message) => {
      console.log("New message received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  const handleGetMessages = async () => {
    try {
      const messageResponse = await getMessages.mutateAsync({
        chatroomId: auth.user!.chatroomId!,
        token: auth.accessToken!,
      });

      return messageResponse;
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error.message || "An unexpected error occurred.");
      return undefined;
    }
  };

  useEffect(() => {
    handleGetMessages().then((data) => {
      setMessages(data.message.messages as Message[]);
    });
  }, []);

  const sendMessage = () => {
    socket!.emit("message", {
      senderId: auth.user!.id!,
      chatroomId: auth.user!.chatroomId!,
      content: messageContent,
    });

    setMessageContent("");
  };

  if (!auth.user) return;

  return (
    <>
      <ScrollArea className="px-5 md:px-0 h-[calc(100vh-11.625rem)] w-full">
        <div className="container mx-auto flex flex-col gap-2">
          {messages.map((message: Message) => (
            <MessageBubble message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="px-5 md:px-0 flex gap-2 items-center justify-center fixed bottom-0 right-0 left-0 h-20 border-t">
        <div className="container mx-auto flex gap-2 items-center w-full">
          <Input
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your heart out..."
          />
          <Button onClick={sendMessage}>
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </>
  );
});

const MessageBubble = ({ message }: { message: Message }) => {
  const auth = useAppSelector((state) => state.auth);
  const me = message.senderId === auth.user!.id!;

  return (
    <div
      className={clsx(
        "max-w-xl w-full px-5 py-2.5 rounded",
        me
          ? "rounded-br-none ml-auto bg-primary text-primary-foreground"
          : "rounded-bl-none bg-secondary text-secondary-foreground",
      )}
    >
      <h6
        className={clsx(
          me
            ? "text-right text-primary-foreground"
            : "text-left text-secondary-foreground",
        )}
      >
        {me ? auth.user!.name : message.sender?.name || "Unknown"}
      </h6>
      <p className={clsx(me ? "text-right" : "text-left")}>{message.content}</p>
    </div>
  );
};
