import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const src = "C:\\Users\\sunda\\.gemini\\antigravity\\brain\\688595d4-5587-4803-b137-51984fac5cb0\\authentic_coconuts_1779171286425.png";
    const dest = process.cwd() + "\\public\\coconut-market.png";
    fs.copyFileSync(src, dest);
    return NextResponse.json({ success: true, message: "Image copied!" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
