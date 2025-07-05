import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegister } from "@/api/mutations";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const navigate = useNavigate();
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.repeatPassword) {
      toast.error("Please fill out the form.");
      return;
    }
    if (form.password !== form.repeatPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const registerResponse = await register.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success(
        registerResponse.message || "Registration successful! Please sign in.",
      );
      navigate("/auth/signin", { replace: true });
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-5 flex flex-col gap-4 items-stretch justify-center"
    >
      <div>
        <h1>Welcome to the extraveganza 🎉</h1>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about yourself to get started! Please sign up and join
          the love ❤️
        </p>
      </div>

      <Input
        value={form.name}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, name: e.target.value }));
        }}
        type="text"
        placeholder="Enter your name..."
      />
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
      <Input
        value={form.repeatPassword}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, repeatPassword: e.target.value }));
        }}
        type="password"
        placeholder="Comfirm your password..."
      />
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
        <Button type="submit" className="md:flex-1 w-full md:w-fit">
          Sign Up
        </Button>
        <Button
          onClick={() => navigate("/auth/signin")}
          type="button"
          className="md:flex-1 w-full md:w-fit"
          variant="secondary"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
}

export default RegisterPage;
