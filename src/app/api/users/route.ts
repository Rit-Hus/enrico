import { NextRequest, NextResponse } from 'next/server';

// In-memory data store (replace with database in production)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// GET /api/users - Get all users
export async function GET() {
  return NextResponse.json({
    success: true,
    data: users,
    count: users.length,
  });
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and email are required',
        },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
    };

    users.push(newUser);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
      },
      { status: 400 }
    );
  }
}

// DELETE /api/users - Delete all users
export async function DELETE() {
  users = [];
  return NextResponse.json({
    success: true,
    message: 'All users deleted',
  });
}
