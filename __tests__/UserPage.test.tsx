import { render, screen } from "@testing-library/react";

import UserPage from "../src/app/(board)/[username]/page";
import { notFound } from "next/navigation";

jest.mock("../src/components/Feed", () => () => <div>Mocked Feed</div>);
jest.mock("../src/components/FollowButton", () => () => <div>FollowButton</div>);
jest.mock("../src/components/Image", () => ({ path }: { path: string }) => (
  <img src={path} alt="mock" />
));
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));
jest.mock("../src/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";

describe("UserPage", () => {
  const mockUser = {
    id: "user-1",
    username: "testuser",
    displayName: "Test User",
    cover: null,
    img: null,
    bio: "Hello world",
    location: "Earth",
    createdAt: new Date("2024-01-01"),
    _count: {
      followers: 10,
      followings: 5,
    },
    followings: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user profile correctly when user exists", async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: "user-1" });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    render(
      await UserPage({
        params: Promise.resolve({ username: "testuser" }),
      })
    );

    expect(await screen.findByText("Test User Dev")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("Hello world Channel")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); 
    expect(screen.getByText("5")).toBeInTheDocument(); 
    expect(screen.getByText("Mocked Feed")).toBeInTheDocument();
    expect(screen.getByText("FollowButton")).toBeInTheDocument();
  });

  it("calls notFound when user is not found", async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: "user-1" });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await UserPage({
      params: Promise.resolve({ username: "unknownuser" }),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it("does not render FollowButton when not authenticated", async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: null });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      followings: [],
    });

    render(
      await UserPage({
        params: Promise.resolve({ username: "testuser" }),
      })
    );

    expect(screen.queryByText("FollowButton")).not.toBeInTheDocument();
  });
});
