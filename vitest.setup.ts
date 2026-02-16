import React from "react";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/image", () => ({
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      src: string;
      alt: string;
    }
  ) => React.createElement("img", props),
}));

vi.mock("next/link", () => ({
  default: (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string | { pathname?: string };
      children: React.ReactNode;
      prefetch?: boolean;
    }
  ) => {
    const { prefetch: _prefetch, href, children, ...rest } = props;
    void _prefetch;
    return React.createElement(
      "a",
      {
        ...rest,
        href: typeof href === "string" ? href : href?.pathname ?? "#",
      },
      children
    );
  },
}));
