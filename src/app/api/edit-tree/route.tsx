import "server-only";
import { NextResponse } from "next/server";
import { admin } from "@/libs/firebaseAdmin";
import { Category } from "@/types/Category";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.categoryId || !body.name) {
      return NextResponse.json(
        { status: "error", message: "Category ID and name are required" },
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

    const updatedCategories = editCategoryById(
      data.categories,
      body.categoryId,
      body.name
    );

    await docRef.update({
      categories: updatedCategories,
    });

    await docRef.update({
      name: body.name,
    });

    return NextResponse.json(
      {
        status: "success",
        message: `Category with ID ${body.id} successfully updated`,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Error editing category tree:", error);
    return NextResponse.json(
      { status: "error", message: `Error editing category: ${error.message}` },

      { status: 500 }
    );
  }
}
function editCategoryById(
  categories: Array<Category>,
  categoryId: string,
  newName: string
) {
  return categories.map((category) => {
    if (category.id === categoryId) {
      category.name = newName;
      return category;
    }

    if (category.children && category.children.length > 0) {
      category.children = editCategoryById(
        category.children,
        categoryId,
        newName
      );
      return category;
    }

    return category;
  });
}
