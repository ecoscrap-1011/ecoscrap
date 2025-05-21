import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongodb';
import TemporaryUser from '@/models/TemporaryUser';
import { sendVerificationEmail } from '@/lib/mailer';
import { UserRole } from '@/lib/userRole';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, phoneNumber, address } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Check if email already exists in either collection (Optional but recommended)
  // You can check both TemporaryUser and User collection to prevent duplicates

  const verifyToken = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save to TemporaryUser collection
  const tempUser = await TemporaryUser.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phoneNumber,
    address,
    role: UserRole.SELLER,
    verificationToken: verifyToken,
  });

  try {
    await sendVerificationEmail(email, verifyToken);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Registration successful. Please verify your email.' }, { status: 201 });
}
