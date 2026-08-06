import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LaunchConsole from "./App.jsx";
import { APPS } from "./missions.js";

describe("LaunchConsole search and filter", () => {
  it("renders a tile for every app initially", () => {
    render(<LaunchConsole />);
    for (const app of APPS) {
      expect(screen.getByRole("button", { name: new RegExp(app.name) })).toBeInTheDocument();
    }
    expect(screen.getByText(`${APPS.length} of ${APPS.length} missions ready for launch`)).toBeInTheDocument();
  });

  it("narrows the grid when searching by name", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.type(screen.getByLabelText("Search missions"), "Schoology");

    expect(screen.getByRole("button", { name: /Schoology/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /BrainPOP/ })).not.toBeInTheDocument();
    expect(screen.getByText(`1 of ${APPS.length} missions shown`)).toBeInTheDocument();
  });

  it("shows the empty state when no missions match the query", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.type(screen.getByLabelText("Search missions"), "zzzznomatch");

    expect(screen.getByText(/No missions match "zzzznomatch"/)).toBeInTheDocument();
    expect(screen.getByText(`0 of ${APPS.length} missions shown`)).toBeInTheDocument();
  });

  it("narrows the grid when selecting an audience filter", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    const librariansFilter = screen.getByRole("button", { name: "Staff" });
    await user.click(librariansFilter);

    expect(librariansFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");

    // Only apps whose audience includes "Staff" should remain.
    const expectedNames = APPS.filter((a) => a.audience.toLowerCase().includes("staff")).map((a) => a.name);
    for (const name of expectedNames) {
      expect(screen.getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
    }
    expect(screen.getByText(`${expectedNames.length} of ${APPS.length} missions shown`)).toBeInTheDocument();
  });

  it("combines filter and search query", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: "Staff" }));
    await user.type(screen.getByLabelText("Search missions"), "zzzznomatch");

    expect(screen.getByText(/No missions match/)).toBeInTheDocument();
  });
});

describe("LaunchConsole mission briefing modal", () => {
  it("opens the modal with the selected app's details on tile click", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "Schoology" })).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "mission-briefing-title");
  });

  it("closes the modal via the close button", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close mission briefing" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal when clicking the backdrop", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    const dialog = screen.getByRole("dialog");

    // The backdrop is the dialog's parent overlay element.
    await user.click(dialog.parentElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close the modal when clicking inside the card", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByRole("heading", { name: "Schoology" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the modal on Escape key", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves focus to the close button when opened", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    expect(screen.getByRole("button", { name: "Close mission briefing" })).toHaveFocus();
  });

  it("locks and restores body scroll while the modal is open", async () => {
    const user = userEvent.setup();
    render(<LaunchConsole />);

    expect(document.body.style.overflow).not.toBe("hidden");

    await user.click(screen.getByRole("button", { name: /Schoology/ }));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
