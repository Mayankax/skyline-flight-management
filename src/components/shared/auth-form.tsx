"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import {
  authSchema,
  type AuthSchemaType,
} from "@/lib/validations/auth.schema";

import {
  signIn,
  signUp,
} from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface Props {
  type: "login" | "signup";
}

export function AuthForm({
  type,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const form =
    useForm<AuthSchemaType>({
      resolver:
        zodResolver(authSchema),

      defaultValues: {
        email: "",
        password: "",
      },
    });

  async function onSubmit(
    values: AuthSchemaType
  ) {
    startTransition(async () => {
      try {
        const action =
          type === "login"
            ? signIn
            : signUp;

        const result =
          await action(
            values.email,
            values.password
          );

        if (result?.error) {
          toast.error(
            result.error
          );

          return;
        }

        toast.success(
          type === "login"
            ? "Login successful"
            : "Account created"
        );

        router.refresh();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "NEXT_REDIRECT"
          )
        ) {
          throw error;
        }

        console.log(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    });
  }

  return (
    <Card className="relative w-full max-w-md overflow-hidden rounded-[32px] border-0 bg-[#081120]/80 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
      <div className="absolute inset-0">
        <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute inset-[1px] rounded-[32px] bg-linear-to-b from-white/[0.03] to-transparent" />
      </div>

      <CardHeader className="relative z-10 px-8 pb-2 pt-8">
        <CardTitle className="text-4xl font-black tracking-tight text-white">
          {type === "login"
            ? "Welcome Back"
            : "Create Account"}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6 px-8 pb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="h-12 rounded-2xl border-0 bg-white/[0.04] text-white shadow-inner shadow-black/20 ring-1 ring-white/5 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-300">
                    Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 rounded-2xl border-0 bg-white/[0.04] text-white shadow-inner shadow-black/20 ring-1 ring-white/5 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-2xl bg-linear-to-r from-blue-500 via-blue-400 to-cyan-400 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_15px_40px_rgba(59,130,246,0.45)]"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : type === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}