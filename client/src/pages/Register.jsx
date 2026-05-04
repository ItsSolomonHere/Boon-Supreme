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
  name: z.string().min(1, "Enter your full name"),
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Use a valid email (e.g. you@example.com)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function Register() {
  const navigate = useNavigate();
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {
      await api.post("/api/auth/register", data);
      await fetchMe();
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <>
      <Seo
        title="Register | Boon Supreme Restaurant"
        description="Create a Boon Supreme account for faster checkout."
        path="/register"
      />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6">
        <h1 className="font-display text-3xl font-bold text-brand-green-deep">
          Register
        </h1>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label htmlFor="reg-name" className="text-sm font-medium">
              Name
            </label>
            <Input id="reg-name" className="mt-1" {...register("name")} />
            {errors.name ? (
              <p className="mt-1 text-xs text-brand-terracotta">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="reg-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="reg-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
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
            <label htmlFor="reg-password" className="text-sm font-medium">
              Password (min 6 characters)
            </label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
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
            {isSubmitting ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-brand-green-deep/70">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-green">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
