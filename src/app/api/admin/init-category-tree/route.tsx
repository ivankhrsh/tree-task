import "server-only";
import { NextResponse } from "next/server";
import { admin } from "@/libs/firebaseAdmin";

export async function POST() {
  try {
    const db = admin.firestore();
    const docRef = db.collection("categoryTree").doc("root");

    const initialTree = {
      categories: [
        {
          id: "1",
          name: "Root Category 1",
          children: [
            {
              id: "2",
              name: "Subcategory 1-1",
              children: [],
            },
            {
              id: "3",
              name: "Subcategory 1-2",
              children: [
                {
                  id: "4",
                  name: "Subcategory 1-2-1",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    await docRef.set(initialTree);

    return NextResponse.json(
      { status: "success", message: "Category tree initialized successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initializing category tree:", error);
    return NextResponse.json(
      {
        status: "error",
        message: `Error initializing category tree: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
