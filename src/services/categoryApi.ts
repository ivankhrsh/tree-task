import { Category } from "@/types/Category";

export async function apiFetchCategories(): Promise<Array<Category>> {
  try {
    const response = await fetch("/api/get-tree");
    const { data } = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw error;
  }
}

export async function apiAddSubcategory(
  parentId: string,
  subcategoryName: string
): Promise<void> {
  if (typeof parentId !== "string" || parentId.length === 0) {
    throw new Error();
  }

  try {
    const response = await fetch("/api/create-tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parentId,
        name: subcategoryName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error adding category");
    }
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
}

export async function apiEditCategory(
  categoryId: string,
  newName: string
): Promise<void> {
  try {
    if (typeof categoryId !== "string" || categoryId.length === 0) {
      throw new Error();
    }

    const response = await fetch("/api/edit-tree", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryId,
        name: newName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error editing category");
    }
  } catch (error) {
    console.error("Error editing category:", error);
    throw error;
  }
}

export async function apiDeleteCategory(categoryId: string): Promise<void> {
  try {
    if (typeof categoryId !== "string"|| categoryId.length === 0) {
      throw new Error();
    }

    const response = await fetch(`/api/delete-tree?categoryId=${categoryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export async function apiResetCategoryTree() {
  try {
    const response = await fetch("/api/admin/init-category-tree", {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error resetting category tree");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
