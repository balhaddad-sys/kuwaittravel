import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomNav, type BottomNavItem } from "./BottomNav";

let currentPathname = "/app/discover";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

const navItems: BottomNavItem[] = [
  {
    label: "Discover",
    href: "/app/discover",
    icon: <span data-testid="discover-default-icon">D</span>,
    activeIcon: <span data-testid="discover-active-icon">A</span>,
  },
  {
    label: "Alerts",
    href: "/app/notifications",
    icon: <span data-testid="alerts-icon">N</span>,
    notification: true,
  },
];

describe("BottomNav", () => {
  beforeEach(() => {
    currentPathname = "/app/discover";
  });

  it("highlights the active route and uses active icon", () => {
    render(<BottomNav items={navItems} />);

    const activeLink = screen.getByRole("link", { name: /discover/i });
    expect(activeLink).toHaveClass("text-indigo-600");
    expect(screen.getByTestId("discover-active-icon")).toBeInTheDocument();
  });

  it("renders notification dot for flagged items", () => {
    const { container } = render(<BottomNav items={navItems} />);
    expect(container.querySelector("span.bg-orange-500")).toBeInTheDocument();
  });

  it("updates active route styles when pathname changes", () => {
    currentPathname = "/app/notifications";
    render(<BottomNav items={navItems} />);

    const alertsLink = screen.getByRole("link", { name: /alerts/i });
    expect(alertsLink).toHaveClass("text-indigo-600");
  });
});
