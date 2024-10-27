/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen } from "@testing-library/react";
import { Category } from "@/types/Category";
import CategoryTree from "./CategoryTree";

describe("CategoryTree Component with Large Tree", () => {
  const categories: Array<Category> = [
    {
      id: "1",
      name: "Root Category",
      children: [
        {
          id: "2",
          name: "Child Category 1",
          children: [
            {
              id: "3",
              name: "Grandchild Category 1.1",
              children: [],
            },
          ],
        },
        {
          id: "4",
          name: "Child Category 1",
          children: [],
        },
        {
          id: "5",
          name: "Child Category 1",
          children: [],
        },
      ],
    },
  ];

  const mockAddSubcategory = jest.fn();
  const mockDeleteCategory = jest.fn();
  const mockEditCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls between tests
  });

  it("should render the category tree with multiple levels", () => {
    render(
      <CategoryTree
        categories={categories}
        onAddSubcategory={mockAddSubcategory}
        onDeleteCategory={mockDeleteCategory}
        onEditCategory={mockEditCategory}
      />
    );

    // Check if categories are rendered
    expect(screen.getByText(/Root Category/i)).toBeInTheDocument();

    // Use getAllByText to target specific "Child Category 1" elements
    const childCategories = screen.getAllByText(/Child Category 1/i);
    expect(childCategories.length).toBe(4); // Updated count to 4

    // Ensure that "Grandchild Category 1.1" is rendered
    expect(screen.getByText(/Grandchild Category 1.1/i)).toBeInTheDocument();
  });

  it("should call onDeleteCategory when delete button is clicked", () => {
    render(
      <CategoryTree
        categories={categories}
        onAddSubcategory={mockAddSubcategory}
        onDeleteCategory={mockDeleteCategory}
        onEditCategory={mockEditCategory}
      />
    );

    // Simulate clicking the delete button on the first category
    fireEvent.click(screen.getAllByText("Delete")[0]);

    // Expect the delete function to have been called with the correct category ID
    expect(mockDeleteCategory).toHaveBeenCalledWith("1");
  });

  it("should call onEditCategory when the edit button is clicked", () => {
    render(
      <CategoryTree
        categories={categories}
        onAddSubcategory={mockAddSubcategory}
        onDeleteCategory={mockDeleteCategory}
        onEditCategory={mockEditCategory}
      />
    );

    // Simulate clicking the edit button on "Child Category 1" (the second one)
    fireEvent.click(screen.getAllByText("Edit")[1]); // Click the correct button

    // Simulate typing a new name into the input field
    fireEvent.change(screen.getByPlaceholderText("Subcategory Name"), {
      target: { value: "Updated Category" },
    });

    // Simulate clicking the submit button
    fireEvent.click(screen.getByText("Submit"));

    // Expect the edit function to have been called with the correct category ID and new name
    expect(mockEditCategory).toHaveBeenCalledWith("2", "Updated Category");
  });
});
