import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputNamePage from "./InputNamePage";

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => JSON.stringify(["Alice", "Bob"]));
  Storage.prototype.setItem = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("InputNamePage", () => {
  it("should render input and add button", () => {
    render(<InputNamePage />);

    // Check for input field
    expect(screen.getByPlaceholderText("Enter a name")).toBeInTheDocument();

    // Check for Add button
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("should load stored names from localStorage", () => {
    render(<InputNamePage />);

    // Verify that initial names are rendered
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("should add a new name when the Add button is clicked", async () => {
    render(<InputNamePage />);

    const input = screen.getByPlaceholderText("Enter a name");
    const addButton = screen.getByText("Add");

    // Type in the input field and click Add button
    await userEvent.type(input, "Charlie");
    await userEvent.click(addButton);

    // Check if Charlie was added
    expect(screen.getByText("Charlie")).toBeInTheDocument();

    // Check if localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalledWith("names", JSON.stringify(["Alice", "Bob", "Charlie"]));
  });

  it("should not add duplicate names", async () => {
    render(<InputNamePage />);

    const input = screen.getByPlaceholderText("Enter a name");
    const addButton = screen.getByText("Add");

    // Type in a name that already exists and click Add button
    await userEvent.type(input, "Alice");
    await userEvent.click(addButton);

    // Check that Alice is not added again
    expect(screen.queryByText("Alice")).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith("names", JSON.stringify(["Alice", "Bob"]));
  });

  it("should delete a name when the delete button is clicked", async () => {
    render(<InputNamePage />);

    const deleteButton = screen.getAllByText("❌")[0]; // Delete the first name (Alice)

    // Click delete button for the first name
    await userEvent.click(deleteButton);

    // Check if the name was removed
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();

    // Check if localStorage.setItem was called to update the names
    expect(localStorage.setItem).toHaveBeenCalledWith("names", JSON.stringify(["Bob"]));
  });
});
