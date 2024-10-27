"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader";
import {
  apiFetchCategories,
  apiResetCategoryTree,
} from "@/services/categoryApi";
import {
  handleAddCategory,
  handleDeleteCategory,
  handleEditCategory,
} from "@/services/stateHandlers";
import { Category } from "@/types/Category";
import CategoryTree from "./components/CategoryTree";
import Footer from "./components/Footer";

export default function Home() {
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    setIsLoading(true);
    try {
      const fetchedCategories = await apiFetchCategories();
      setCategories(fetchedCategories);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function refreshCategoriesHandler() {
    getCategories()
      .finally(() => toast.success("Refreshed"))
      .catch(() => toast.error("Something went wrong"));
  }

  function resetCategoriesHandler() {
    apiResetCategoryTree()
      .then(() => getCategories())
      .finally(() => toast.success("Categories tree reseted successfully"))
      .catch(() => toast.error("Something went wrong"));
  }

  function addSubcategory(parentId: string, subcategoryName: string) {
    handleAddCategory(categories, setCategories, parentId, subcategoryName);
  }

  function deleteSubcategory(categoryId: string) {
    handleDeleteCategory(categories, setCategories, categoryId);
  }

  function editSubcategory(categoryId: string, newName: string) {
    handleEditCategory(categories, setCategories, categoryId, newName);
  }

  if (isError) {
    return (
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2">
          Sorry, something went wrong. Please try again later
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex size-full flex-col items-center gap-8 rounded p-4 sm:items-start">
        <div>
          <h1 className="text-lg font-bold">
            Unlimited Hierrarchical Category Tree View
          </h1>
          <h2>Test Task by Ivan Khoroshylov</h2>
        </div>
        <div className="row-start-2 flex size-full flex-col items-center gap-8 rounded-md border bg-slate-400/5 p-4 sm:items-start">
          {isLoading ? (
            <div className="m-auto">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <CategoryTree
                categories={categories}
                onAddSubcategory={addSubcategory}
                onDeleteCategory={deleteSubcategory}
                onEditCategory={editSubcategory}
              />
            </div>
          )}
        </div>

        <div className="space-x-2">
          <button
            className="rounded bg-blue-600 px-2 py-1 hover:bg-blue-500"
            onClick={refreshCategoriesHandler}
            type="button"
          >
            Refresh
          </button>
          <button
            className="rounded bg-gray-600 px-2 py-1 hover:bg-gray-500"
            onClick={resetCategoriesHandler}
            type="button"
          >
            Reset
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
