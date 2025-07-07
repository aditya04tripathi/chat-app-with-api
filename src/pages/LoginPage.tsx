import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetUser, useLogin } from "@/api/mutations";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setAccessToken, setUser } from "@/store/slices/user";
import type { User } from "@/types";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useLogin();
  const getUser = useGetUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill out the form.");
      return;
    }

    try {
      await login
        .mutateAsync({
          email: form.email,
          password: form.password,
        })
        .then((res) => {
          return res.message;
        })
        .then((accessToken) => {
          getUser
            .mutateAsync(accessToken!)
            .then((userResponse) => {
              dispatch(setAccessToken(accessToken));
              dispatch(setUser(userResponse.message as User));
              if (userResponse.message.onboarded) {
                toast.success("Welcome back! 🥰");
                return navigate("/", { replace: true });
              } else {
                toast.success("Welcome back! 🥰 Please complete your onboarding.");
                return navigate("/onboarding", { replace: true });
              }
            })
            .then(() => {
              console.log("accessToken", auth.accessToken);
              console.log("user", auth.user);
            });
        });
    } catch (error: unknown) {
      console.error("loginError", error);
      // @ts-expect-error error might not have a message property
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full p-5 flex flex-col gap-4 items-stretch justify-center">
      <div>
        <h1>Welcome back, love 🥰</h1>
        <p className="text-sm text-muted-foreground">Please enter your credentials to talk to your loved one!</p>
      </div>

      <Input
        value={form.email}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, email: e.target.value }));
        }}
        type="email"
        placeholder="Enter your email address..."
      />
      <Input
        value={form.password}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, password: e.target.value }));
        }}
        type="password"
        placeholder="Enter your password..."
      />
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
        <Button disabled={login.isPending} type="submit" className="md:flex-1 w-full md:w-fit">
          {login.isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
        <Button disabled={login.isPending} onClick={() => navigate("/auth/signup")} type="button" className="md:flex-1 w-full md:w-fit" variant="secondary">
          Sign Up
        </Button>
      </div>
    </form>
  );
}

export default LoginPage;
