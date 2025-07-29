import { render, screen, fireEvent } from "@testing-library/react";
import PostModal from "../src/app/(board)/@modal/compose/post/page";

const backMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

jest.mock("../src/components/Image", () => ({ path, alt }: any) => (
  <img src={path} alt={alt || "mock"} />
));

describe("PostModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with all UI elements", () => {
    render(<PostModal />);

   
    

    expect(
      screen.getByPlaceholderText("What is happening?!")
    ).toBeInTheDocument();

    expect(screen.getByText("Post")).toBeInTheDocument();

    expect(screen.getByText("Drafts")).toBeInTheDocument();

    const icons = screen.getAllByAltText("mock");
    expect(icons.length).toBe(6);
  });

  it("calls router.back() when X is clicked", () => {
    render(<PostModal />);

    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);

    expect(backMock).toHaveBeenCalled();
  });
});
