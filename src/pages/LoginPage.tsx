import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAppDispatch } from "../hooks/redux";
import { getUserThunk, loginThunk } from "../store/slices/user";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill out the form.");
      return;
    }

    dispatch(
      loginThunk({
        email: form.email,
        password: form.password,
      }),
    )
      .then((data) => {
        console.log(data.payload.access_token);
        return dispatch(getUserThunk(data.payload.access_token));
      })
      .then((data) => {
        if (data.payload.onboarded) {
          navigate("/", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-5 flex flex-col gap-4 items-stretch justify-center"
    >
      <div>
        <h1>Welcome back, love 🥰</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your credentials to talk to your loved one!
        </p>
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
        <Button type="submit" className="md:flex-1 w-full md:w-fit">
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/auth/signup")}
          type="button"
          className="md:flex-1 w-full md:w-fit"
          variant="secondary"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}

export default LoginPage;
