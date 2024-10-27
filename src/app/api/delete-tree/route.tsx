import "server-only";
import { NextResponse } from "next/server";
import { admin } from "@/libs/firebaseAdmin";
import { Category } from "@/types/Category";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { status: "error", message: "Category ID is required" },
        { status: 400 }
      );
    }

    const db = admin.firestore();
    const docRef = db.collection("categoryTree").doc("root");

    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      return NextResponse.json(
        {
          status: "error",
          message: "Root does not exist",
        },
        { status: 404 }
      );
    }

    const data = docSnapshot.data();

    if (!data) {
      return NextResponse.json(
        {
          status: "error",
          message: `Error creating category, no data`,
        },
        { status: 404 }
      );
    }

    const updatedCategories = deleteCategoryById(data.categories, categoryId);

    await docRef.update({
      categories: updatedCategories,
    });

    return NextResponse.json(
      {
        status: "success",
        message: `Category with ID ${categoryId} successfully deleted`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        status: "error",
        message: `Error deleting category: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

function deleteCategoryById(categories: Array<Category>, categoryId: string) {
  return categories.filter((category) => {
    if (category.id === categoryId) {
      return false;
    }
    // If has children, recursively delete
    if (category.children && category.children.length > 0) {
      category.children = deleteCategoryById(category.children, categoryId);
    }
    return true;
  });
}
