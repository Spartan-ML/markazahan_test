# Markaz Ahan Test

A simple React-based web app built with Next.js and TypeScript that allows users to add, delete, and reorder names. The app stores the names in local storage, ensuring persistence across page refreshes and browser restarts.

## Features

- **Add names**: Enter a name and add it to the list.
- **Delete names**: Remove names from the list.
- **Reorder names**: Drag and drop the names to change their order (on the "List Stored Names" page).
- **Persistent storage**: The list of names is stored in `localStorage`, so it persists even after page refreshes or when the app is closed and reopened.
- **Infinite scroll**: A page that generates 1000 names and loads them as the user scrolls.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered (SSR) web applications.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types to improve development experience and prevent errors.
- **localStorage**: A simple key-value store for persisting data in the browser.

## Project Structure

The app follows a simple folder structure in Next.js:

