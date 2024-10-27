import { act } from "@testing-library/react";
import { toast } from "react-toastify";
import { Category } from "@/types/Category";
import {
  apiAddSubcategory,
  apiDeleteCategory,
  apiEditCategory,
} from "./categoryApi";
import {
  handleAddCategory,
  handleDeleteCategory,
  handleEditCategory,
} from "./stateHandlers";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("uuid", () => ({ v4: jest.fn(() => "temp-id") }));
jest.mock("./categoryApi");

describe("State Handlers", () => {
  let initialCategories: Array<Category>;
  let setCategories: jest.Mock;

  beforeEach(() => {
    initialCategories = [
      {
        id: "1",
        name: "Root",
        children: [{ id: "2", name: "Child", children: [] }],
      },
    ];
    setCategories = jest.fn();
    (apiAddSubcategory as jest.Mock).mockReset();
    (apiEditCategory as jest.Mock).mockReset();
    (apiDeleteCategory as jest.Mock).mockReset();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  describe("handleAddCategory", () => {
    it("should optimistically add a category and show success toast on success", async () => {
      (apiAddSubcategory as jest.Mock).mockResolvedValueOnce(undefined);

      await act(async () => {
        await handleAddCategory(
          initialCategories,
          setCategories,
          "1",
          "New Category"
        );
      });

      // Optimistic update
      expect(setCategories).toHaveBeenCalledWith(expect.any(Function));
      expect(apiAddSubcategory).toHaveBeenCalledWith("1", "New Category");
      expect(toast.success).toHaveBeenCalledWith("Category added successfully");
    });

    it("should roll back state and show error toast on failure", async () => {
      (apiAddSubcategory as jest.Mock).mockRejectedValueOnce(
        new Error("API Error")
      );

      await act(async () => {
        await handleAddCategory(
          initialCategories,
          setCategories,
          "1",
          "New Category"
        );
      });

      expect(setCategories).toHaveBeenCalledWith(initialCategories);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  describe("handleEditCategory", () => {
    it("should optimistically edit a category and show success toast on success", async () => {
      (apiEditCategory as jest.Mock).mockResolvedValueOnce(undefined);

      await act(async () => {
        await handleEditCategory(
          initialCategories,
          setCategories,
          "2",
          "Updated Name"
        );
      });

      expect(setCategories).toHaveBeenCalledWith(expect.any(Function));
      expect(apiEditCategory).toHaveBeenCalledWith("2", "Updated Name");
      expect(toast.success).toHaveBeenCalledWith(
        "Category updated successfully"
      );
    });

    it("should roll back state and show error toast on failure", async () => {
      (apiEditCategory as jest.Mock).mockRejectedValueOnce(
        new Error("API Error")
      );

      await act(async () => {
        await handleEditCategory(
          initialCategories,
          setCategories,
          "2",
          "Updated Name"
        );
      });

      expect(setCategories).toHaveBeenCalledWith(initialCategories);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  describe("handleDeleteCategory", () => {
    it("should optimistically delete a category and show success toast on success", async () => {
      (apiDeleteCategory as jest.Mock).mockResolvedValueOnce(undefined);

      await act(async () => {
        await handleDeleteCategory(initialCategories, setCategories, "2");
      });

      expect(setCategories).toHaveBeenCalledWith(expect.any(Function));
      expect(apiDeleteCategory).toHaveBeenCalledWith("2");
      expect(toast.success).toHaveBeenCalledWith(
        "Category deleted successfully"
      );
    });

    it("should roll back state and show error toast on failure", async () => {
      (apiDeleteCategory as jest.Mock).mockRejectedValueOnce(
        new Error("API Error")
      );

      await act(async () => {
        await handleDeleteCategory(initialCategories, setCategories, "2");
      });

      expect(setCategories).toHaveBeenCalledWith(initialCategories);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
