import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/types/Category";
import {
  apiAddSubcategory,
  apiDeleteCategory,
  apiEditCategory,
} from "./categoryApi";

/**
 * Optimistically updates the UI with a new state, attempting an API call to confirm the change.
 * If the API call fails, it reverts the UI back to the previous state and displays an error.
 *
 * @param fallbackState - The original state before the optimistic update to restore if the API call fails.
 * @param setState - The function to update the categories state.
 * @param optimisticUpdate - A function returning the new state after the optimistic update.
 * @param apiCall - An asynchronous function representing the API call to confirm the UI change.
 * @param successMessage - A message to display if the API call succeeds.
 * @param errorMessage - Optional custom error message to show if the API call fails.
 */
async function optimisticUpdateWrapper(
  fallbackState: Array<Category>,
  setState: Dispatch<SetStateAction<Array<Category>>>,
  optimisticUpdate: () => Array<Category>,
  apiCall: () => Promise<void>,
  successMessage: string,
  errorMessage = "Something went wrong"
): Promise<void> {
  // Apply optimistic update to the UI
  setState(optimisticUpdate);

  try {
    // Attempt API call to confirm the UI change
    await apiCall();
    toast.success(successMessage);
  } catch {
    // Revert UI to previous state on failure
    setState(fallbackState);
    toast.error(errorMessage);
  }
}

export async function handleAddCategory(
  initialCategories: Array<Category>,
  setCategories: Dispatch<SetStateAction<Array<Category>>>,
  parentId: string,
  categoryName: string
) {
  const tempId = uuidv4();

  function recursiveAddCategory(categories: Array<Category>): Array<Category> {
    return categories.map((category) => {
      if (category.id === parentId) {
        const updatedChildren = category.children
          ? [...category.children, { id: tempId, name: categoryName }]
          : [{ id: tempId, name: categoryName }];
        return { ...category, children: updatedChildren };
      }
      return category.children
        ? { ...category, children: recursiveAddCategory(category.children) }
        : category;
    });
  }

  await optimisticUpdateWrapper(
    initialCategories,
    setCategories,
    () => recursiveAddCategory(initialCategories),
    async () => apiAddSubcategory(parentId, categoryName),
    "Category added successfully"
  );
}

export async function handleEditCategory(
  initialCategories: Array<Category>,
  setCategories: Dispatch<SetStateAction<Array<Category>>>,
  categoryId: string,
  newName: string
) {
  function recursiveEditCategory(categories: Array<Category>): Array<Category> {
    return categories.map((category) => {
      if (category.id === categoryId) return { ...category, name: newName };
      return category.children
        ? { ...category, children: recursiveEditCategory(category.children) }
        : category;
    });
  }

  await optimisticUpdateWrapper(
    initialCategories,
    setCategories,
    () => recursiveEditCategory(initialCategories),
    async () => apiEditCategory(categoryId, newName),
    "Category updated successfully"
  );
}

export async function handleDeleteCategory(
  initialCategories: Array<Category>,
  setCategories: Dispatch<SetStateAction<Array<Category>>>,
  categoryId: string
) {
  function recursiveDeleteCategory(
    categories: Array<Category>
  ): Array<Category> {
    return categories
      .filter((category) => category.id !== categoryId)
      .map((category) =>
        category.children
          ? {
              ...category,
              children: recursiveDeleteCategory(category.children),
            }
          : category
      );
  }

  await optimisticUpdateWrapper(
    initialCategories,
    setCategories,
    () => recursiveDeleteCategory(initialCategories),
    async () => apiDeleteCategory(categoryId),
    "Category deleted successfully"
  );
}
