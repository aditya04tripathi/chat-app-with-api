import { useDeleteMessage, useGetMessages } from "@/api/mutations";
import { withProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, type ScrollAreaRef } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/hooks/redux";
import type { Message } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";

export const IndexPage = withProtectedRoute(() => {
  const auth = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const scrollToBottomRef = useRef<ScrollAreaRef>(null);
  const queryClient = useQueryClient();

  const getMessages = useGetMessages();

  const [socket, setSocket] = useState<Socket | null>(null);

  const scrollToBottom = () => {
    scrollToBottomRef.current?.scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectSocket = () => {
    const socket = io(import.meta.env.VITE_BASE_URL);
    setSocket(socket);

    console.log("socket conn done");

    socket.on("message", (msg: Message) => {
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
      <ScrollArea ref={scrollToBottomRef} className="md:px-5 px-5 h-[calc(100vh-11.625rem)] w-full overflow-y-auto">
        <div className="container mx-auto flex flex-col gap-2">
          {messages.map((message: Message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (messageContent.trim() === "") return toast.error("Message cannot be empty.");
          sendMessage();
          setMessageContent("");
        }}
        className="px-5 md:px-0 flex gap-2 items-center justify-center fixed bottom-0 right-0 left-0 h-20 border-t bg-background"
        style={{
          zIndex: 50,
          touchAction: "manipulation",
        }}
        autoComplete="off"
      >
        <div className="container mx-auto flex gap-2 items-center w-full">
          <Input value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Type your heart out..." inputMode="text" autoComplete="off" autoCorrect="on" spellCheck={true} enterKeyHint="send" className="flex-1" />
          <Button type="submit" tabIndex={0}>
            <SendHorizonal />
          </Button>
        </div>
      </form>
    </>
  );
});

const MessageBubble = ({ message }: { message: Message }) => {
  const auth = useAppSelector((state) => state.auth);
  const me = message.senderId === auth.user!.id!;

  return (
    <div className={clsx("w-full flex flex-col", me ? "items-end" : "items-start")}>
      <div className={clsx("max-w-xl w-full px-5 py-2.5 rounded", me ? "rounded-br-none ml-auto bg-primary text-primary-foreground" : "rounded-bl-none bg-secondary text-secondary-foreground")}>
        <div className={clsx("flex items-center gap-2 mb-2", me ? "justify-end" : "justify-start")}>
          <h6 className={clsx(me ? "text-right text-primary-foreground" : "text-left text-secondary-foreground")}>{me ? auth.user!.name : message.sender?.name || "Unknown"}</h6>
        </div>
        <p className={clsx(me ? "text-right" : "text-left")}>{message.content}</p>
      </div>
    </div>
  );
};
