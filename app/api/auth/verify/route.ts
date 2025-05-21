import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import TemporaryUser from '@/models/TemporaryUser';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token missing' }, { status: 400 });
  }

  // Find temp user by token
  const tempUser = await TemporaryUser.findOne({ verificationToken: token });

  if (!tempUser) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Create new real user with tempUser data
  const newUser = await User.create({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    phoneNumber: tempUser.phoneNumber,
    address: tempUser.address,
    role: tempUser.role,
    isVerified: true,
  });

  // Delete temp user record
  await TemporaryUser.deleteOne({ _id: tempUser._id });

  // Redirect or send success response
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin`);
}
