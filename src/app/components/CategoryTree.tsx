"use client";
import { FormEvent, useState } from "react";
import { Category } from "@/types/Category";

interface CategoryTreeProps {
  categories: Array<Category>;
  onAddSubcategory(parentId: string, subcategoryName: string): void;
  onEditCategory(categoryId: string, newName: string): void;
  onDeleteCategory(categoryId: string): void;
}
export default function CategoryTree({
  categories,
  onAddSubcategory,
  onDeleteCategory,
  onEditCategory,
}: CategoryTreeProps) {
  const [newSubcategoryName, setNewSubcategoryName] = useState<
    Record<string, string>
  >({});
  const [editedSubcategoryName, setEditedSubcategoryName] = useState<
    Record<string, string>
  >({});
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>(
    {}
  );
  const [editState, setEditState] = useState<Record<string, boolean>>({});
  const [activeAddInput, setActiveAddInput] = useState<string | null>(null);

  function handleAddSubcategory(parentId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (newSubcategoryName[parentId]?.trim()) {
      onAddSubcategory(parentId, newSubcategoryName[parentId].trim());
      setNewSubcategoryName((prev) => ({ ...prev, [parentId]: "" }));
      setActiveAddInput(null);
    }
  }

  function handleCancelAddingSubcategory() {
    setActiveAddInput(null);
    setNewSubcategoryName({});
  }

  function handleEditState(categoryId: string, categoryName: string) {
    setEditState((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));

    setEditedSubcategoryName((prevState) => ({
      ...prevState,
      [categoryId]: categoryName,
    }));
  }

  function handleCollapseSubcategory(categoryId: string) {
    setCollapsedState((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  }

  function handleEditSubmit(e: FormEvent<HTMLFormElement>, categoryId: string) {
    e.preventDefault();
    if (editedSubcategoryName[categoryId].trim()) {
      onEditCategory(categoryId, editedSubcategoryName[categoryId].trim());
      handleEditState(categoryId, "");
    }
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <ul className="pl-4">
      {categories.map((category) => (
        <li key={category.id} className="mb-4 space-y-2 border-l pl-2">
          {"— "}
          {category.children && category.children.length > 0 ? (
            collapsedState[category.id] ? (
              <button
                className="mr-2 rounded-full bg-emerald-600 px-[0.43rem] hover:bg-emerald-500"
                onClick={() => handleCollapseSubcategory(category.id)}
                type="button"
              >
                +
              </button>
            ) : (
              <button
                className="mr-2 rounded-full bg-orange-600 px-2 hover:bg-orange-500"
                onClick={() => handleCollapseSubcategory(category.id)}
                type="button"
              >
                -
              </button>
            )
          ) : (
            ""
          )}
          {editState[category.id] ? (
            <form
              className="inline-block"
              onSubmit={(e) => handleEditSubmit(e, category.id)}
            >
              <input
                className="rounded border p-1 text-black"
                onChange={(e) =>
                  setEditedSubcategoryName((prevState) => ({
                    ...prevState,
                    [category.id]: e.target.value,
                  }))
                }
                placeholder="Subcategory Name"
                type="text"
                value={editedSubcategoryName[category.id] || ""}
              />
              <button
                className="ml-2 rounded bg-green-600 px-2 py-1 hover:bg-green-500"
                type="submit"
              >
                Submit
              </button>

              <button
                className="ml-2 rounded bg-red-600 px-2 py-1 hover:bg-red-500"
                onClick={() => handleEditState(category.id, category.name)}
                type="button"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              {category.name || "No Name"}

              <div className="ml-2 inline-block space-x-2">
                <button
                  className="rounded bg-blue-600 px-2 hover:bg-blue-500"
                  onClick={() => handleEditState(category.id, category.name)}
                  type="button"
                >
                  Edit
                </button>

                <button
                  className="rounded bg-red-600 px-2 hover:bg-red-500"
                  onClick={() => onDeleteCategory(category.id)}
                  type="button"
                >
                  Delete
                </button>

                {activeAddInput !== category.id && (
                  <button
                    className="rounded bg-green-600 px-2 text-white hover:bg-green-500"
                    disabled={activeAddInput === category.id}
                    onClick={() => setActiveAddInput(category.id)}
                    type="button"
                  >
                    Add
                  </button>
                )}
              </div>
            </>
          )}

          {/* Conditionally show "Add subcategory" input only for the active category */}
          {activeAddInput === category.id && (
            <div className="mt-2 flex gap-2">
              {"— "}
              <input
                className="rounded border p-1 text-black"
                onChange={(e) =>
                  setNewSubcategoryName((prevState) => ({
                    ...prevState,
                    [category.id]: e.target.value,
                  }))
                }
                placeholder="Subcategory Name"
                type="text"
                value={newSubcategoryName[category.id] || ""}
              />

              <button
                className="rounded bg-green-600 px-2 text-white hover:bg-green-500"
                onClick={() => handleAddSubcategory(category.id)}
                type="button"
              >
                Submit
              </button>

              <button
                className="rounded bg-red-600 px-2 text-white hover:bg-red-500"
                onClick={() => handleCancelAddingSubcategory()}
                type="button"
              >
                Cancel
              </button>
            </div>
          )}

          {!collapsedState[category.id] &&
            category.children &&
            category.children.length > 0 && (
              <CategoryTree
                categories={category.children}
                onAddSubcategory={onAddSubcategory}
                onDeleteCategory={onDeleteCategory}
                onEditCategory={onEditCategory}
              />
            )}
        </li>
      ))}
    </ul>
  );
}
