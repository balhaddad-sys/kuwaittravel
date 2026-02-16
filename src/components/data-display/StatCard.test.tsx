import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders title, value, and positive trend", () => {
    render(
      <StatCard
        title="Revenue"
        value="2,500"
        change={{ value: 12, label: "this month" }}
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("2,500")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("this month")).toBeInTheDocument();
  });

  it("renders negative trend text", () => {
    render(
      <StatCard
        title="Refunds"
        value="120"
        change={{ value: -5, label: "vs last week" }}
      />
    );

    expect(screen.getByText("-5%")).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });
});
