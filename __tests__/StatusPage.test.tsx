import { render, screen } from "@testing-library/react";
import StatusPage from "../src/app/(board)/[username]/status/[postId]/page";
import { notFound } from "next/navigation";

jest.mock("../src/components/Comments", () => ({ comments }: any) => (
  <div>Mocked Comments: {comments?.length}</div>
));
jest.mock("../src/components/Post", () => ({ post }: any) => (
  <div>Mocked Post: {post?.id}</div>
));
jest.mock("../src/components/Image", () => ({ path }: any) => (
  <img src={path} alt="mock" />
));
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));
jest.mock("../src/prisma", () => ({
  prisma: {
    post: {
      findFirst: jest.fn(),
    },
  },
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";

describe("StatusPage", () => {
  const mockPost = {
    id: 1,
    user: { displayName: "Test User", username: "testuser", img: "user.jpg" },
    _count: { likes: 10, rePosts: 2, comments: 3 },
    likes: [],
    rePosts: [],
    saves: [],
    comments: [
      {
        id: 1,
        user: {
          displayName: "Commenter",
          username: "commenter",
          img: "commenter.jpg",
        },
        _count: { likes: 0, rePosts: 0, comments: 0 },
        likes: [],
        rePosts: [],
        saves: [],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders post and comments when authenticated and post is found", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: "user-1" });
    (prisma.post.findFirst as jest.Mock).mockResolvedValue(mockPost);

    render(
      await StatusPage({
        params: Promise.resolve({ username: "testuser", postId: "1" }),
      })
    );

    expect(await screen.findByText("Mocked Post: 1")).toBeInTheDocument();
    expect(screen.getByText("Mocked Comments: 1")).toBeInTheDocument();
    expect(screen.getByAltText("mock")).toBeInTheDocument(); // back icon
  });

  it("returns nothing if user is not authenticated", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: null });

    const result = await StatusPage({
      params: Promise.resolve({ username: "testuser", postId: "1" }),
    });

    expect(result).toBeUndefined();
  });

  it("calls notFound if post is not found", async () => {
    ((auth as unknown) as jest.Mock).mockResolvedValue({ userId: "user-1" });
    (prisma.post.findFirst as jest.Mock).mockResolvedValue(null);

    await StatusPage({
      params: Promise.resolve({ username: "testuser", postId: "999" }),
    });

    expect(notFound).toHaveBeenCalled();
  });
});
