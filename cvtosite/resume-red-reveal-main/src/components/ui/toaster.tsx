
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, closable = true, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1 w-full">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {closable !== false && (
              <ToastClose className="absolute right-2 top-2 opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </ToastClose>
            )}
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}
