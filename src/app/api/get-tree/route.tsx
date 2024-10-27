import "server-only";
import { NextResponse } from "next/server";
import { admin } from "@/libs/firebaseAdmin";

export async function GET() {
  try {
    const db = admin.firestore();
    const docRef = db.collection("categoryTree").doc("root");
    const doc = await docRef.get();

    if (doc.exists) {
      return NextResponse.json({
        status: "success",
        message: "Connection is successful",
        data: doc.data(),
      });
    } else {
      return NextResponse.json({
        status: "success",
        message: "Connection is successful, but document not found",
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: `Error connecting to Firebase: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
