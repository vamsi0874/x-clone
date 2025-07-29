import { render, screen } from "@testing-library/react";
import Homepage from "../src/app/(board)/page";

jest.mock("../src/components/Share", () => () => <div>Mocked Share</div>);
jest.mock("../src/components/Feed", () => () => <div>Mocked Feed</div>);

describe("Homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navigation links", async () => {
    render(await Homepage({}));

    expect(screen.getByText("For you")).toBeInTheDocument();
    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Javascript")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  it("renders Share and Feed components", async () => {
    render(await Homepage({}));

    expect(screen.getByText("Mocked Share")).toBeInTheDocument();
    expect(screen.getByText("Mocked Feed")).toBeInTheDocument();
  });

  it("applies proper classes to selected tab", async () => {
    render(await Homepage({}));

    const forYouTab = screen.getByText("For you");
    expect(forYouTab).toHaveClass("border-b-4 border-iconBlue");
  });
});
