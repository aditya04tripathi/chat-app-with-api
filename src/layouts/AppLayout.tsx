import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearUser } from "@/store/slices/user";
import clsx from "clsx";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.onboarded) navigate("/onboarding");
  }, []);

  return (
    <>
      <nav className="px-5 md:px-0 h-24 border-b flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <Menu size={32} />
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <h3 className="p-0 m-0">{user.name}</h3>
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
              <DropdownMenuItem>{user.email}</DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  onClick={() => {
                    dispatch(clearUser());
                  }}
                  className="w-full"
                  variant="destructive"
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="h-[calc(100vh-6rem)] fixed top-24 left-0 bottom-0 right-0">
        {children}
      </main>
    </>
  );
}

export default AppLayout;
