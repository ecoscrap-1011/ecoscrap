import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    scrapTypeId,
    weightKg,
    pickupDate,
    pickupAddress,
    notes,
    imageUrl,
  } = body;

  // Required fields check
  if (!scrapTypeId || !weightKg || !pickupDate || !pickupAddress) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await dbConnect();

    const newRequest = await ScrapRequest.create({
      userId: session.user.id,
      scrapTypeId,
      weightKg,
      pickupDate,
      pickupAddress,
      notes: notes || "",
      imageUrl: imageUrl || "",
      status: RequestStatus.PENDING,
    });

    return NextResponse.json({ message: "Scrap request submitted", request: newRequest }, { status: 201 });
  } catch (err) {
    console.error("Error creating request:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
