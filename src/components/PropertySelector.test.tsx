import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertySelector from './PropertySelector';

describe('PropertySelector', () => {
  const mockProperties = [
    { id: '1', name: 'Villa Sunny' },
    { id: '2', name: 'Beach House' },
  ];

  it('renders property label and reload button', () => {
    render(
      <PropertySelector
        properties={mockProperties}
        selectedProperty="1"
        onSelect={vi.fn()}
        onReload={vi.fn()}
        loading={false}
      />,
    );

    expect(screen.getByText(/Property/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload/i })).toBeInTheDocument();
  });

  it('calls onReload when reload button is clicked', () => {
    const mockOnReload = vi.fn();
    render(
      <PropertySelector
        properties={mockProperties}
        selectedProperty="1"
        onSelect={vi.fn()}
        onReload={mockOnReload}
        loading={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Reload/i }));
    expect(mockOnReload).toHaveBeenCalled();
  });

  it('disables interactions when loading', () => {
    render(
      <PropertySelector
        properties={mockProperties}
        selectedProperty="1"
        onSelect={vi.fn()}
        onReload={vi.fn()}
        loading={true}
      />,
    );

    expect(screen.getByRole('button', { name: /Loading.../i })).toBeDisabled();
  });
});
