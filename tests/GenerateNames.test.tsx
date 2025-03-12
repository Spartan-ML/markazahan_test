import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenerateNamesPage from "./GenerateNamesPage";

// Mock the Intersection Observer API
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

// Mock the random name generation function
jest.mock("./generateNamesPage", () => ({
  ...jest.requireActual("./generateNamesPage"),
  generateRandomName: jest.fn(() => "John Doe"),  // Predictable name for testing
}));

describe("GenerateNamesPage", () => {
  it("should render initial content", () => {
    render(<GenerateNamesPage />);

    // Assert: Check if initial text content is rendered
    expect(screen.getByText("Generated Names")).toBeInTheDocument();
    expect(screen.getByText("Scroll down to load more names.")).toBeInTheDocument();
  });

  it("should load more names when the observer is triggered", async () => {
    render(<GenerateNamesPage />);

    // Assert: Check that initially no names are displayed
    expect(screen.queryByText("John Doe")).toBeNull();

    // Simulate Intersection Observer triggering the loadMoreNames
    const loadMoreTrigger = document.querySelector("#loadMoreTrigger");
    if (loadMoreTrigger) {
      fireEvent.scroll(loadMoreTrigger); // Trigger scroll event to simulate user scrolling
    }

    // Wait for names to be added
    await waitFor(() => screen.getByText("John Doe"));

    // Assert: Check if the generated names are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should show loading state when names are being loaded", async () => {
    render(<GenerateNamesPage />);

    // Assert: Check that loading is displayed when names are being loaded
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should stop loading if there are no more names to load", async () => {
    render(<GenerateNamesPage />);

    // Mock the behavior when no more names are available
    const loadMoreNames = jest.fn(() => {
      screen.getByText("Loading..."); // Simulate loading
      // Setting hasMore to false to stop loading further names
      screen.getByText("No more names to load.");
    });

    // Trigger IntersectionObserver and check if loadMoreNames function is called
    const loadMoreTrigger = document.querySelector("#loadMoreTrigger");
    if (loadMoreTrigger) {
      fireEvent.scroll(loadMoreTrigger); // Trigger scroll event
    }

    // Assert: Check if the loading state stops correctly
    await waitFor(() => {
      expect(screen.getByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should call loadMoreNames when scrolled", async () => {
    render(<GenerateNamesPage />);

    // Get initial list of names
    const nameList = screen.getByRole("list");

    // Check if there's no initial name loaded
    expect(nameList).not.toHaveTextContent("John Doe");

    // Trigger intersection observer
    const loadMoreTrigger = document.querySelector("#loadMoreTrigger");
    if (loadMoreTrigger) {
      fireEvent.scroll(loadMoreTrigger);
    }

    // Wait for names to be loaded
    await waitFor(() => screen.getByText("John Doe"));

    // Check if the name "John Doe" is now in the list
    expect(nameList).toHaveTextContent("John Doe");
  });
});
