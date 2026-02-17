import { NextRequest, NextResponse } from "next/server";

// In-memory data store
const users = [
	{ id: 1, name: "John Doe", email: "john@example.com" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// GET /api/users/[id] - Get a specific user
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = parseInt(params.id);
	const user = users.find((u) => u.id === id);

	if (!user) {
		return NextResponse.json(
			{
				success: false,
				error: "User not found",
			},
			{ status: 404 },
		);
	}

	return NextResponse.json({
		success: true,
		data: user,
	});
}

// PUT /api/users/[id] - Update a user
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = parseInt(params.id);
		const body = await request.json();
		const userIndex = users.findIndex((u) => u.id === id);

		if (userIndex === -1) {
			return NextResponse.json(
				{
					success: false,
					error: "User not found",
				},
				{ status: 404 },
			);
		}

		// Update user
		users[userIndex] = {
			...users[userIndex],
			...body,
			id, // Ensure ID doesn't change
		};

		return NextResponse.json({
			success: true,
			data: users[userIndex],
			message: "User updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: "Invalid request body",
			},
			{ status: 400 },
		);
	}
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = parseInt(params.id);
	const userIndex = users.findIndex((u) => u.id === id);

	if (userIndex === -1) {
		return NextResponse.json(
			{
				success: false,
				error: "User not found",
			},
			{ status: 404 },
		);
	}

	users.splice(userIndex, 1);

	return NextResponse.json({
		success: true,
		message: "User deleted successfully",
	});
}
