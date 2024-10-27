import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { Category } from "@/types/Category";

export async function executeWithRollback(
  updateFunction: () => void,
  fallbackState: Array<Category>,
  setCategories: Dispatch<SetStateAction<Array<Category>>>,
  apiCall: () => Promise<void>,
  successMessage: string
) {
  const originalState = fallbackState;
  updateFunction(); // Perform optimistic UI update

  try {
    await apiCall(); // Make API call
    toast.success(successMessage);
  } catch {
    setCategories(originalState); // Roll back state on failure
    toast.error("Something went wrong");
  }
}
