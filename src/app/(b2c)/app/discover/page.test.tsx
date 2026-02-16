import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DiscoverPage from "./page";
import { getDocuments } from "@/lib/firebase/firestore";
import type { Campaign, Trip } from "@/types";

const mockPush = vi.fn();
const mockPrefetch = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: mockPrefetch,
  }),
}));

vi.mock("@/providers/DirectionProvider", () => ({
  useDirection: () => ({
    language: "en",
    t: (_ar: string, en: string) => en,
  }),
}));

vi.mock("@/hooks/useWishlist", () => ({
  useWishlist: () => ({
    isWishlisted: () => false,
    toggle: vi.fn(),
  }),
}));

vi.mock("@/lib/firebase/firestore", () => ({
  getDocuments: vi.fn(),
}));

vi.mock("@/components/layout/Container", () => ({
  Container: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

vi.mock("@/components/shared/TripCard", () => ({
  TripCard: ({
    title,
    onClick,
  }: {
    title: string;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {title}
    </button>
  ),
}));

vi.mock("@/components/shared/CampaignCard", () => ({
  CampaignCard: ({ name }: { name: string }) => <div>{name}</div>,
}));

vi.mock("@/components/shared/CategoryPills", () => ({
  CategoryPills: () => <div data-testid="category-pills" />,
}));

vi.mock("@/components/shared/FilterSheet", () => ({
  FilterSheet: ({ open }: { open: boolean }) =>
    open ? <div data-testid="filter-sheet" /> : null,
}));

vi.mock("@/components/ui/SkeletonCard", () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
}));

vi.mock("@/components/forms/SearchInput", () => ({
  SearchInput: ({
    placeholder,
    onSearch,
  }: {
    placeholder: string;
    onSearch: (value: string) => void;
  }) => (
    <input
      aria-label="discover-search"
      placeholder={placeholder}
      onChange={(event) => onSearch(event.currentTarget.value)}
    />
  ),
}));

const mockTrips: Trip[] = [
  {
    id: "trip-1",
    campaignId: "campaign-1",
    campaignName: "Travel Co",
    title: "Amazing Trip to Paris",
    titleAr: "رحلة رائعة إلى باريس",
    description: "",
    descriptionAr: "",
    type: "umrah",
    galleryUrls: [],
    departureDate: "2026-03-10",
    returnDate: "2026-03-15",
    registrationDeadline: "2026-03-01",
    departureCity: "Kuwait",
    destinations: [
      {
        city: "Paris",
        country: "France",
        arrivalDate: "2026-03-10",
        departureDate: "2026-03-15",
      },
    ],
    totalCapacity: 40,
    bookedCount: 12,
    remainingCapacity: 28,
    basePriceKWD: 250,
    currency: "KWD",
    status: "published",
    isTemplate: false,
    tags: [],
    featured: false,
    adminApproved: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "trip-2",
    campaignId: "campaign-2",
    campaignName: "Adventures Inc",
    title: "Sunny Beach in Spain",
    titleAr: "شاطئ مشمس في إسبانيا",
    description: "",
    descriptionAr: "",
    type: "ziyarat",
    galleryUrls: [],
    departureDate: "2026-04-01",
    returnDate: "2026-04-08",
    registrationDeadline: "2026-03-20",
    departureCity: "Kuwait",
    destinations: [
      {
        city: "Spain",
        country: "Spain",
        arrivalDate: "2026-04-01",
        departureDate: "2026-04-08",
      },
    ],
    totalCapacity: 30,
    bookedCount: 8,
    remainingCapacity: 22,
    basePriceKWD: 180,
    currency: "KWD",
    status: "published",
    isTemplate: false,
    tags: [],
    featured: false,
    adminApproved: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    ownerId: "owner-1",
    name: "Travel Co",
    nameAr: "شركة سفر",
    slug: "travel-co",
    description: "",
    descriptionAr: "",
    galleryUrls: [],
    licenseNumber: "A1",
    licenseImageUrl: "license-1.png",
    contactPhone: "+96512345678",
    socialMedia: {},
    verificationStatus: "approved",
    acceptsOnlinePayment: false,
    paymentMethods: [],
    stats: {
      totalTrips: 3,
      activeTrips: 2,
      totalBookings: 20,
      averageRating: 4.5,
      totalReviews: 10,
    },
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "campaign-2",
    ownerId: "owner-2",
    name: "Adventures Inc",
    nameAr: "شركة مغامرات",
    slug: "adventures-inc",
    description: "",
    descriptionAr: "",
    galleryUrls: [],
    licenseNumber: "A2",
    licenseImageUrl: "license-2.png",
    contactPhone: "+96523456789",
    socialMedia: {},
    verificationStatus: "approved",
    acceptsOnlinePayment: false,
    paymentMethods: [],
    stats: {
      totalTrips: 2,
      activeTrips: 1,
      totalBookings: 12,
      averageRating: 4.2,
      totalReviews: 6,
    },
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

describe("DiscoverPage", () => {
  const getDocumentsMock = vi.mocked(getDocuments);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeletons while data is pending", () => {
    getDocumentsMock.mockImplementation(
      () => new Promise<Trip[] | Campaign[]>(() => undefined)
    );

    render(<DiscoverPage />);
    expect(screen.getAllByTestId("skeleton-card").length).toBeGreaterThan(0);
  });

  it("renders trips and campaigns after load", async () => {
    getDocumentsMock
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);

    render(<DiscoverPage />);

    expect(await screen.findByText("Amazing Trip to Paris")).toBeInTheDocument();
    expect(screen.getByText("Sunny Beach in Spain")).toBeInTheDocument();
    expect(screen.getByText("Travel Co")).toBeInTheDocument();
    expect(screen.getByText("Adventures Inc")).toBeInTheDocument();
  });

  it("filters trips using the search query", async () => {
    getDocumentsMock
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);

    render(<DiscoverPage />);
    await screen.findByText("Amazing Trip to Paris");

    fireEvent.change(
      screen.getByPlaceholderText("Search for a trip or campaign..."),
      {
        target: { value: "Paris" },
      }
    );

    expect(screen.getByText("Amazing Trip to Paris")).toBeInTheDocument();
    expect(screen.queryByText("Sunny Beach in Spain")).not.toBeInTheDocument();
  });

  it("shows empty state when no trip matches search", async () => {
    getDocumentsMock
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);

    render(<DiscoverPage />);
    await screen.findByText("Amazing Trip to Paris");

    fireEvent.change(
      screen.getByPlaceholderText("Search for a trip or campaign..."),
      {
        target: { value: "NotARealDestination" },
      }
    );

    expect(screen.getByText("No trips available at the moment")).toBeInTheDocument();
  });

  it("navigates to trip details when a trip card is clicked", async () => {
    getDocumentsMock
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);

    render(<DiscoverPage />);
    fireEvent.click(await screen.findByText("Amazing Trip to Paris"));

    expect(mockPush).toHaveBeenCalledWith("/app/campaigns/campaign-1/trips/trip-1");
  });

  it("shows a load error banner when API requests fail", async () => {
    getDocumentsMock.mockRejectedValue(new Error("Network failed"));

    render(<DiscoverPage />);

    expect(
      await screen.findByText("Unable to load discovery content right now.")
    ).toBeInTheDocument();
  });
});
