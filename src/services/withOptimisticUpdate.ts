import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export async function withOptimisticUpdate<T>(
  optimisticUpdate: () => Array<T>,
  setState: Dispatch<SetStateAction<Array<T>>>,
  apiCall: () => Promise<void>,
  fallbackState: Array<T>,
  successMessage: string,
  errorMessage: string
) {
  // Apply optimistic update
  const updatedState = optimisticUpdate();
  setState(updatedState);

  try {
    // Await API call
    await apiCall();
    toast.success(successMessage);
  } catch {
    // Rollback state if API fails
    setState(fallbackState);
    toast.error(errorMessage);
  }
}
