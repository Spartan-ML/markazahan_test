import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputNamePage from "./InputNamePage.test";

describe("InputNamePage", () => {
  // Mock localStorage
  beforeEach(() => {
    const localStorageMock = (function () {
      let store: { [key: string]: string } = {};
      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value.toString();
        },
        removeItem(key: string) {
          delete store[key];
        },
        clear() {
          store = {};
        },
      };
    })();

    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should load stored names from localStorage", () => {
    // Arrange: Store names in localStorage before rendering
    const storedNames = ["John", "Jane"];
    localStorage.setItem("names", JSON.stringify(storedNames));

    // Act: Render the component
    render(<InputNamePage />);

    // Assert: Check if the names are rendered correctly
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("should add a new name to the list and store it in localStorage", async () => {
    // Arrange: Render the component
    render(<InputNamePage />);

    // Act: Type a name and click "Add"
    const input = screen.getByPlaceholderText("Enter a name");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.click(button);

    // Assert: Check if the name is added to the list
    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    // Assert: Check if the name is stored in localStorage
    expect(localStorage.getItem("names")).toContain("Alice");
  });

  it("should delete a name from the list and update localStorage", async () => {
    // Arrange: Store a name in localStorage before rendering
    localStorage.setItem("names", JSON.stringify(["John"]));

    // Act: Render the component and delete the name
    render(<InputNamePage />);
    const deleteButton = screen.getByText("❌");

    fireEvent.click(deleteButton);

    // Assert: Check if the name is removed from the list
    await waitFor(() => expect(screen.queryByText("John")).toBeNull());

    // Assert: Check if localStorage is updated
    const names = JSON.parse(localStorage.getItem("names") || "[]");
    expect(names).not.toContain("John");
  });

  it("should not add empty or duplicate names", () => {
    // Arrange: Render the component
    render(<InputNamePage />);

    // Act: Try adding an empty name
    const input = screen.getByPlaceholderText("Enter a name");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);

    // Assert: No name should be added
    expect(screen.queryByText("")).toBeNull();

    // Act: Try adding a duplicate name
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(button);

    // Assert: Only one "John" should be in the list
    expect(screen.queryAllByText("John")).toHaveLength(1);
  });
});
