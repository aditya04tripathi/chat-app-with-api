import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser } from "@/store/slices/user";
import clsx from "clsx";
import { BookHeart, ChevronDown, Menu, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function AppLayout({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const auth = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.accessToken || !auth.user) {
      navigate("/auth/signin", { replace: true });
    }
  }, []);

  return (
    <>
      <nav className="px-5 md:px-0 h-24 border-b flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Welcome {auth.user?.name || ""}</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  This is your personal space, and also the place where you can
                  read the poems written for you!
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 flex flex-col justify-center items-stretch gap-4">
                <Button
                  onClick={() => {
                    navigate("/");
                    setSheetOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <span>Chat</span>
                  <MessageCircle />
                </Button>
                <Button
                  onClick={() => {
                    navigate("/poems");
                    setSheetOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <span>Poems</span>
                  <BookHeart />
                </Button>
              </div>
              <SheetFooter>
                <Button
                  onClick={() => {
                    dispatch(setUser(undefined));
                    navigate("/auth/signin");
                  }}
                  className="w-full"
                  variant="destructive"
                >
                  Sign Out
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <h3 className="p-0 m-0">{auth.user?.name}</h3>
              <ChevronDown
                size={32}
                className={clsx(
                  dropdownOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform",
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="w-[320px]"
            >
              <DropdownMenuLabel>{auth.user?.name}</DropdownMenuLabel>
              <DropdownMenuLabel>{auth.user?.email}</DropdownMenuLabel>
              <div className="my-2 mx-2 flex items-stretch">
                <Button
                  onClick={() => {
                    dispatch(setUser(undefined));
                    navigate("/auth/signin");
                  }}
                  className="w-full"
                  variant="destructive"
                >
                  Sign Out
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="container mx-auto h-[calc(100vh-6rem)] py-2.5 fixed top-24 left-0 bottom-0 right-0">
        {children}
      </main>
    </>
  );
}

export default AppLayout;
