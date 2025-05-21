import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token missing' }, { status: 400 });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin?verified=true`);
}
