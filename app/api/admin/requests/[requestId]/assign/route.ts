import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import { UserRole } from "@/lib/userRole";

export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { staffId } = await req.json();
  const { requestId } = params;

  if (!requestId || !staffId) {
    return NextResponse.json({ error: "Missing requestId or staffId" }, { status: 400 });
  }

  await dbConnect();

  try {
    const updatedRequest = await ScrapRequest.findByIdAndUpdate(
      requestId,
      { staffId, status: RequestStatus.ASSIGNED },
      { new: true }
    )
      .populate("userId", "name email phoneNumber")
      .populate("staffId", "name email phoneNumber");

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
