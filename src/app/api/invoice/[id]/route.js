import connectDB from "@/lib/db";
import Quotation from "@/models/quotation";
import Profile from "@/models/Profile";

export async function GET(req, { params }) {
  const { id } = await params;

  await connectDB();

  // ✅ quotation data
  const data = await Quotation.findById(id);

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ profile data (company info) for the current quotation user
  const companyProfile = await Profile.findOne({ userId: data.userId });
  const fallbackProfile = companyProfile || (await Profile.findOne().sort({ createdAt: -1 }));

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ dono data combine karke bhejo
  return Response.json({
    ...data.toObject(),
    ...fallbackProfile?.toObject(),
  });
}