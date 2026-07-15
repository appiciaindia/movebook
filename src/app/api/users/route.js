import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const user = await User.create(body);

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}