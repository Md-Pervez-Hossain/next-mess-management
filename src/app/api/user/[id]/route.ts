import { NextResponse } from "next/server";
import User from "../../../../../Models/userSchema/userSchema";
import { connectMongoDB } from "../../../../../db/mongoDB";

interface paramsInterface {
  params: {
    id: string;
  };
}

interface UserRequest {
  json: () => Promise<userInterface>;
}

interface userInterface {
  newName: string;
  newEmail: string;
}

export async function GET(request: UserRequest, { params }: paramsInterface) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "id Perameter Not Found" },
      { status: 201 }
    );
  }
  try {
    await connectMongoDB();
    const user = await User.findOne({ _id: id });
    if (!user) {
      return NextResponse.json(
        { message: "User Didn't Found" },
        { status: 201 }
      );
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: "User Not Found" }, { status: 201 });
  }
}

export async function PUT(request: UserRequest, { params }: paramsInterface) {
  const { id } = params;
  const { newName: name, newEmail: email } = await request.json();
  if (!id) {
    return NextResponse.json(
      { message: "id Perameter Not Found" },
      { status: 201 }
    );
  }

  try {
    await connectMongoDB();
    const userUpdate = await User.findByIdAndUpdate(id, { name, email });

    if (!userUpdate) {
      return NextResponse.json(
        { message: "User Didn't Found" },
        { status: 201 }
      );
    }
    return NextResponse.json({ message: "User Updated" });
  } catch (error) {
    return NextResponse.json(
      { message: "User not found", error },
      { status: 201 }
    );
  }
}
