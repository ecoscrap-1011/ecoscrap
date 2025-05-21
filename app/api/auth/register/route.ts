import { NextRequest, NextResponse } from 'next/server';
import {dbConnect } from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, phoneNumber, address } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: UserRole.SELLER, // Default role is SELLER
      phoneNumber,
      address,
    });
    
    // Do not return the password
    const sanitizedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    return NextResponse.json(
      { message: 'User registered successfully', user: sanitizedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong', error: (error as Error).message },
      { status: 500 }
    );
  }
}