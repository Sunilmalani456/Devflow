"use client";

import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";

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
<<<<<<< HEAD
import { Button } from "../ui/button";

import { useTheme } from "@/context/ThemeProvider";
import { createQuestion } from "@/lib/actions/question.action";
import { questionsSchema } from "@/lib/validation";
=======
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "../ui/badge";
<<<<<<< HEAD
=======
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195

interface Props {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
}
//
<<<<<<< HEAD
// ---COMPONENT---

const Question = ({ mongoUserId }: Props) => {
=======
const Question = ({ mongoUserId, type, questionDetails }: Props) => {
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195
  //
  // ---HOOKS---
  const { mode } = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const editorRef = useRef(null);
  // const type: any = "create";
  const [IsSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
=======
  const parseQuestionDetails =
    questionDetails && JSON.parse(questionDetails || "");
  const groupedTags = parseQuestionDetails?.tags?.map((tag: any) => tag.name);

  // 1. Define your form.
  const form = useForm<z.infer<typeof questionsSchema>>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      title: parseQuestionDetails ? parseQuestionDetails.title || "" : "",
      explanation: parseQuestionDetails
        ? parseQuestionDetails.content || ""
        : "",
      tags: groupedTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof questionsSchema>) {
    setIsSubmitting(true);
    // console.log(values);

    try {
      if (type === "Edit") {
        // navigate to home page
        await editQuestion({
          questionId: parseQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathName,
        });
        router.push(`/question/${parseQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathName,
        });

        // navigate to home page
        router.push("/");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }
>>>>>>> b4deca00a1c4cc6f2a6bcb30d9e5ac71f4dd1195

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          form.setError("tags", {
            type: "required",
            message: "Tag must be less than 10 characters",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          form.trigger();
        }
      }
    }
  };

  function HandleTagRemove(tag: string, field: any) {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue("tags", newTags);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        {/* FOR SPACING :) */}

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;r asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* EXPLAINATION */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Deatialed explaination of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    //    @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parseQuestionDetails ? parseQuestionDetails.content || "" : ""}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter |" +
                      "alignright alignjustify | bullist numlist outdent indent",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* TAGS */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    disabled={type === "Edit"}
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize shadow-md"
                          onClick={() =>
                            type !== "Edit"
                              ? HandleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close"
                              height={12}
                              width={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe what youe question is about. You
                need to press{" "}
                <span className="font-medium text-primary-500">ENTER KEY</span>{" "}
                to add tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={IsSubmitting}
        >
          {IsSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
