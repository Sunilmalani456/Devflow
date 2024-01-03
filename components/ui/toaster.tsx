"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";


export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        variant,
        action,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`text-dark100_light900 border-light-700 bg-light-900 px-4 py-3 ${
              variant === "destructive"
                ? "bg-red-800 text-light-900"
                : "dark:bg-[#020617]"
            } dark:border-dark-400`}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-dark100_light900 text-[12px] font-medium leading-[13px]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
