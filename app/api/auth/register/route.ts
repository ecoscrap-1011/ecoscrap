import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/mailer';
import { UserRole } from '@/lib/userRole';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, phoneNumber, address } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
  }

  const verifyToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    address,
    role: UserRole.SELLER,
    isVerified: false,
    verifyToken,
  });

  await sendVerificationEmail(email, verifyToken);

  return NextResponse.json({ message: 'User registered. Check your email to verify.' }, { status: 201 });
}
