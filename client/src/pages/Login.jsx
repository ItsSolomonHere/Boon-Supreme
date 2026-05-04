import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  email: z
    .string()
    .min(1, "Enter your email")
    .email("Use a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export function Login() {
  const navigate = useNavigate();
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {
      await api.post("/api/auth/login", data);
      await fetchMe();
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <>
      <Seo
        title="Login | Boon Supreme Restaurant"
        description="Sign in to your Boon Supreme account."
        path="/login"
      />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6">
        <h1 className="font-display text-3xl font-bold text-brand-green-deep">
          Login
        </h1>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              className="mt-1"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-brand-terracotta">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="mt-1"
              {...register("password")}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-brand-terracotta">
                {errors.password.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="gold" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-brand-green-deep/70">
          No account?{" "}
          <Link to="/register" className="font-semibold text-brand-green">
            Register
          </Link>
        </p>
      </div>
    </>
  );
}
