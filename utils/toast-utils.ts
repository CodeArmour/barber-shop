import { toast, type ToastT } from "sonner"

type ToastOptions = Parameters<typeof toast>[1]

// Success toast with title and description
export function showSuccessToast(title: string, description: string, options?: ToastOptions): string | number {
  return toast.success(title, {
    description,
    ...options,
  })
}

// Error toast with title and description
export function showErrorToast(title: string, description: string, options?: ToastOptions): string | number {
  return toast.error(title, {
    description,
    ...options,
  })
}

// Warning toast with title and description
export function showWarningToast(title: string, description: string, options?: ToastOptions): string | number {
  return toast.warning(title, {
    description,
    ...options,
  })
}

// Info toast with title and description
export function showInfoToast(title: string, description: string, options?: ToastOptions): string | number {
  return toast.info(title, {
    description,
    ...options,
  })
}

// Toast with custom options
export function showCustomToast(title: string, description: string, options?: ToastOptions): string | number {
  return toast(title, {
    description,
    ...options,
  })
}

// Toast with action buttons
export function showActionToast(
  title: string,
  description: string,
  action: () => void,
  actionLabel = "Action",
  options?: ToastOptions,
): string | number {
  return toast(title, {
    description,
    action: {
      label: actionLabel,
      onClick: action,
    },
    ...options,
  })
}

// Toast with promise
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  },
  options?: ToastOptions,
) {
  return toast.promise(promise, messages)
}
