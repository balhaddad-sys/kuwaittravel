import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DiscoverPage from './page';
import { getDocuments } from '@/lib/firebase/firestore';
import type { Trip, Campaign } from '@/types';

// Mock data
const mockTrips: Partial<Trip>[] = [
  { id: 'trip1', title: 'Amazing Trip to Paris', titleAr: 'رحلة رائعة إلى باريس', status: 'published', destinations: [{ city: 'Paris' }], campaignId: 'campaign1' },
  { id: 'trip2', title: 'Sunny Beach in Spain', titleAr: 'شاطئ مشمس في إسبانيا', status: 'published', destinations: [{ city: 'Spain' }], campaignId: 'campaign2' },
];

const mockCampaigns: Partial<Campaign>[] = [
  { id: 'campaign1', name: 'Travel Co', nameAr: 'شركة سفر' },
  { id: 'campaign2', name: 'Adventures Inc', nameAr: 'شركة مغامرات' },
];

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock providers
vi.mock('@/providers/DirectionProvider', () => ({
  useDirection: () => ({
    t: (key: string, fallback: string) => fallback || key,
    language: 'en',
  }),
}));

// Mock firebase
vi.mock('@/lib/firebase/firestore', () => ({
  getDocuments: vi.fn(),
}));

describe('DiscoverPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('shows a loading state initially', () => {
    (getDocuments as vi.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<DiscoverPage />);
    expect(screen.getByText(/Loading discovery content.../i)).toBeInTheDocument();
  });

  it('renders trips and campaigns after loading', async () => {
    (getDocuments as vi.Mock)
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);
    render(<DiscoverPage />);

    expect(await screen.findByText('Amazing Trip to Paris')).toBeInTheDocument();
    expect(screen.getByText('Sunny Beach in Spain')).toBeInTheDocument();
    expect(screen.getByText('Travel Co')).toBeInTheDocument();
    expect(screen.getByText('Adventures Inc')).toBeInTheDocument();
  });

  it('filters trips based on search query', async () => {
    (getDocuments as vi.Mock)
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);
    render(<DiscoverPage />);

    await screen.findByText('Amazing Trip to Paris');

    const searchInput = screen.getByPlaceholderText(/Search for a trip or campaign.../i);
    fireEvent.change(searchInput, { target: { value: 'Paris' } });

    expect(screen.getByText('Amazing Trip to Paris')).toBeInTheDocument();
    expect(screen.queryByText('Sunny Beach in Spain')).not.toBeInTheDocument();
  });

  it('shows an empty state if no trips match the search', async () => {
    (getDocuments as vi.Mock)
      .mockResolvedValueOnce(mockTrips)
      .mockResolvedValueOnce(mockCampaigns);
    render(<DiscoverPage />);

    await screen.findByText('Amazing Trip to Paris');

    const searchInput = screen.getByPlaceholderText(/Search for a trip or campaign.../i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentPlace' } });

    expect(screen.queryByText('Amazing Trip to Paris')).not.toBeInTheDocument();
    expect(screen.getByText(/No trips available at the moment/i)).toBeInTheDocument();
  });

  it('handles and displays a load error', async () => {
    (getDocuments as vi.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<DiscoverPage />);

    expect(await screen.findByText(/Unable to load discovery content right now./i)).toBeInTheDocument();
  });
});
