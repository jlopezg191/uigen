import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "../main-content";

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface" />,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree" />,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor" />,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame" />,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions" />,
}));

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useFileSystem: () => ({}),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

test("renders preview view by default", () => {
  render(<MainContent />);

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking Code tab switches to code view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  await user.click(codeTab);

  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking Preview tab switches back to preview view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  await user.click(screen.getByRole("tab", { name: "Code" }));
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(screen.getByRole("tab", { name: "Preview" }));
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("toggling rapidly between Code and Preview tabs works", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  const previewTab = screen.getByRole("tab", { name: "Preview" });

  await user.click(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  await user.click(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
});
