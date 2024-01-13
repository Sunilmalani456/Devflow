/* eslint-disable no-unused-vars */
"use client";

import React, { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { answersSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  // HOOKS
  const { userId } = useAuth();
  const pathName = usePathname();
  const { mode } = useTheme();
  const editorRef = React.useRef(null);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [IsSubmittingAi, setIsSubmittingAi] = useState(false);

  const form = useForm<z.infer<typeof answersSchema>>({
    resolver: zodResolver(answersSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof answersSchema>) => {
    setIsSubmitting(true);

    try {
      if (userId) {
        // if user is logged in
        await createAnswer({
          content: values.answer,
          author: JSON.parse(authorId),
          question: JSON.parse(questionId),
          path: pathName,
        });
        form.reset();
        if (editorRef.current) {
          // reset editor
          const editer = editorRef.current as any;

          editer.setContent("");
        }
      } else {
        // if user is not logged in to send tost message noification
        console.log("user is not logged in");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiAnswer = async () => {
    if (!authorId) return;

    setIsSubmittingAi(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );

      const AiAnswer = await response.json();

      const formattedAiAnswer = AiAnswer.error
        ? "Sorry, I could not provide an answer to your question, Ai is still learning 🤖. please try again later. 🙏 "
        : AiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAiAnswer);
      }

      // Toast message notification
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsSubmittingAi(false);
    }
  };

  return (
    <div>
      <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write Your <span className="text-primary-500">Answer 🤩</span> Here
        </h4>
        <Button
          onClick={generateAiAnswer}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5
         text-primary-500 shadow-none dark:text-primary-500"
        >
          {IsSubmittingAi ? (
            <>
              <ReloadIcon className="h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="stars"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      //    @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
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
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                    }}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              disabled={IsSubmitting}
              type="submit"
              className="primary-gradient text-white"
            >
              {IsSubmitting ? "Submitting... ✌" : "Submit Answer "}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
