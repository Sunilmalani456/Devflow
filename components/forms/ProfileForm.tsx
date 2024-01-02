/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

interface Props {
  clerkId: string;
  user: string;
}

const ProfileForm = ({ clerkId, user }: Props) => {
  const parsed = JSON.parse(user);
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL Validation
  const isURL = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const formSchema = z.object({
    name: z.string().min(5).max(50),
    username: z.string().min(5).max(50),
    portfolioWebsite: z
      .string()
      .refine((value) => value === "" || isURL(value))
      .optional(),
    location: z.string().min(5).max(50),
    bio: z.string().min(5).max(150),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: parsed.name || "",
      username: parsed.username || "",
      portfolioWebsite: parsed.portfolioWebsite || "",
      location: parsed.location || "",
      bio: parsed.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          // @ts-ignore
          protfolio: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="text-dark400_light700 paragraph-semibold">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="light-border-2 paragraph-regular no-focus background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="text-dark400_light700 paragraph-semibold">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="light-border-2 paragraph-regular no-focus background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your username"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="text-dark400_light700 paragraph-semibold">
                Portfolio Url
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  className="light-border-2 paragraph-regular no-focus background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="url: https://www.example.com/"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="text-dark400_light700 paragraph-semibold">
                Location <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="light-border-2 paragraph-regular no-focus background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Where are you from?"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="text-dark400_light700 paragraph-semibold">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="light-border-2 paragraph-regular no-focus background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="What's special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-600" />
            </FormItem>
          )}
        />
        <div className="mt-7 flex  justify-end">
          <Button
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
