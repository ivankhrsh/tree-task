import "server-only";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { admin } from "@/libs/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.parentId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Category name and parent ID are required",
        },
        { status: 400 }
      );
    }

    const newCategoryId = uuidv4();

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

    function addSubcategory(categories: Array<any>, parentId: string) {
      return categories.map((category) => {
        if (category.id === parentId) {
          category.children = [
            ...(category.children || []),
            {
              id: newCategoryId,
              name: body.name,
              children: [],
            },
          ];
        } else if (category.children && category.children.length > 0) {
          category.children = addSubcategory(category.children, parentId);
        }
        return category;
      });
    }

    if (!data) {
      return NextResponse.json(
        {
          status: "error",
          message: `Error creating category, no data`,
        },
        { status: 404 }
      );
    }

    const updatedCategories = addSubcategory(data.categories, body.parentId);

    await docRef.update({
      categories: updatedCategories,
    });

    return NextResponse.json(
      {
        status: "success",
        message: `Category ${body.name} created with ID ${newCategoryId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { status: "error", message: `Error creating category: ${error.message}` },
      { status: 500 }
    );
  }
}
