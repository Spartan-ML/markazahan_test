import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListStoredNamesPage from "./ListStoredNamesPage";

describe("ListStoredNamesPage", () => {
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

  it("should render 'No names stored' when there are no names in localStorage", () => {
    // Arrange: Clear localStorage before testing
    localStorage.removeItem("names");

    // Act: Render the component
    render(<ListStoredNamesPage />);

    // Assert: Check if "No names stored" is displayed
    expect(screen.getByText("No names stored.")).toBeInTheDocument();
  });

  it("should display stored names from localStorage", () => {
    // Arrange: Store names in localStorage before rendering
    const storedNames = ["John", "Jane", "Alice"];
    localStorage.setItem("names", JSON.stringify(storedNames));

    // Act: Render the component
    render(<ListStoredNamesPage />);

    // Assert: Check if names are rendered correctly
    storedNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("should reorder names when dragged and dropped", async () => {
    // Arrange: Store names in localStorage before rendering
    const storedNames = ["John", "Jane", "Alice"];
    localStorage.setItem("names", JSON.stringify(storedNames));

    // Act: Render the component
    render(<ListStoredNamesPage />);

    // Get the list items
    const john = screen.getByText("John");
    const jane = screen.getByText("Jane");
    const alice = screen.getByText("Alice");

    // Simulate dragging John and dropping it after Alice
    fireEvent.dragStart(john);
    fireEvent.dragOver(jane); // Prevent default
    fireEvent.drop(jane);

    // Assert: Check if the order is updated correctly in the UI
    await waitFor(() => {
      const names = screen.getAllByRole("listitem");
      expect(names[0].textContent).toBe("Jane");
      expect(names[1].textContent).toBe("John");
      expect(names[2].textContent).toBe("Alice");
    });

    // Assert: Check if localStorage is updated with the new order
    const updatedNames = JSON.parse(localStorage.getItem("names") || "[]");
    expect(updatedNames).toEqual(["Jane", "John", "Alice"]);
  });

  it("should do nothing if an item is dragged and dropped onto itself", () => {
    // Arrange: Store names in localStorage before rendering
    const storedNames = ["John", "Jane", "Alice"];
    localStorage.setItem("names", JSON.stringify(storedNames));

    // Act: Render the component
    render(<ListStoredNamesPage />);

    // Get the list items
    const john = screen.getByText("John");

    // Simulate dragging John and dropping it onto itself
    fireEvent.dragStart(john);
    fireEvent.drop(john);

    // Assert: The order should remain the same
    const names = screen.getAllByRole("listitem");
    expect(names[0].textContent).toBe("John");
    expect(names[1].textContent).toBe("Jane");
    expect(names[2].textContent).toBe("Alice");

    // Assert: localStorage should remain the same
    const updatedNames = JSON.parse(localStorage.getItem("names") || "[]");
    expect(updatedNames).toEqual(storedNames);
  });

  it("should not reorder if a non-dragged item is clicked", () => {
    // Arrange: Store names in localStorage before rendering
    const storedNames = ["John", "Jane", "Alice"];
    localStorage.setItem("names", JSON.stringify(storedNames));

    // Act: Render the component
    render(<ListStoredNamesPage />);

    // Get the list items
    const john = screen.getByText("John");
    const jane = screen.getByText("Jane");

    // Simulate a click on Jane, which should not reorder
    fireEvent.click(jane);

    // Assert: The order should remain the same
    const names = screen.getAllByRole("listitem");
    expect(names[0].textContent).toBe("John");
    expect(names[1].textContent).toBe("Jane");
    expect(names[2].textContent).toBe("Alice");

    // Assert: localStorage should remain the same
    const updatedNames = JSON.parse(localStorage.getItem("names") || "[]");
    expect(updatedNames).toEqual(storedNames);
  });
});
