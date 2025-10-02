"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // if empty, clear message and don't call API
    if (!debouncedUsername) {
      setUsernameMessage("");
      setIsCheckingUsername(false);
      return;
    }

    // optional: avoid checking for extremely short usernames
    if (debouncedUsername.length < 3) {
      setUsernameMessage("Keep typing... (min 3 chars)");
      setIsCheckingUsername(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(
            debouncedUsername
          )}`,
          { signal: controller.signal }
        );
        if (!mounted) return;
        setUsernameMessage(response.data.message);
      } catch (error: any) {
        // ignore cancellations
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED" ||
          error?.message === "canceled"
        ) {
          return;
        }
        const axiosError = error as AxiosError<ApiResponse>;
        if (!mounted) return;
        setUsernameMessage(
          axiosError?.response?.data?.message ?? "Error checking username"
        );
      } finally {
        if (mounted) setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Success", {
        description: response.data.message,
      });
      // use the submitted username (data.username) — don't rely on local state
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error("Error Signing Up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const msg = axiosError?.response?.data?.message ?? "Error signing up";
      setUsernameMessage(msg);
      toast.error("Sign up failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p>Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8 py-9 px-14 w-full rounded-2xl shadow-2xl flex flex-col justify-center align-middle "
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val); // keep react-hook-form in sync
                        setUsername(val); // update local state used by debounce
                      }}
                    />
                  </FormControl>

                  <div className="mt-2 min-h-[1rem] text-sm">
                    {isCheckingUsername ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                      </span>
                    ) : (
                      <span>{usernameMessage}</span>
                    )}
                  </div>

                  <FormDescription>
                    This will be your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>Your email for account verification.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription>Choose a strong password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="flex justify-center" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait!
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>Already Registered?</p>
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
