import { render, screen, fireEvent } from '@testing-library/react';
import { useUtilityStore } from '@store/utilityStore';
import { useWindowSize } from 'usehooks-ts';
import Drawer, { formatSize } from './Drawer';
import { expect, type Mock } from 'vitest';

// Mock the store
vi.mock('@store/utilityStore', () => ({
    useUtilityStore: vi.fn(),
}));

// Mock useWindowSize hook
vi.mock('usehooks-ts', () => ({
    useWindowSize: vi.fn(),
}));

describe('Drawer Component', () => {
    let setDrawer: Mock;

    beforeEach(() => {
        setDrawer = vi.fn();
        (useUtilityStore as any).mockReturnValue({
            drawer: { open: false, content: null, anchor: 'left' },
            setDrawer,
        });

        (useWindowSize as any).mockReturnValue({ width: 1024, height: 768 });
    });

    it('renders the Drawer component', () => {
        render(<Drawer />);
        // @ts-ignore
        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('opens and closes the drawer', () => {
        (useUtilityStore as any).mockReturnValue({
            drawer: { open: true, content: <p>Drawer Content</p>, anchor: 'left' },
            setDrawer,
        });

        render(<Drawer />);
        // @ts-ignore
        expect(screen.getByText('Drawer Content')).toBeInTheDocument();

        // Simulate closing the drawer
        fireEvent.click(screen.getByRole('presentation'));
        expect(setDrawer).toHaveBeenCalledWith({ open: false });
    });

    it('sets anchor dynamically based on screen size', () => {
        (useUtilityStore as any).mockReturnValue({
            drawer: { open: true, anchor: { sm: 'left', md: 'right', lg: 'bottom' } },
            setDrawer,
        });

        (useWindowSize as any).mockReturnValue({ width: 1024, height: 768 });

        render(<Drawer />);
        // @ts-ignore
        expect(screen.getByRole('presentation')).toHaveAttribute('data-anchor', 'right');
    });

    it('formats size correctly', () => {
        expect(formatSize({ width: 200, height: 800 })).toBe('xs');
        expect(formatSize({ width: 500, height: 800 })).toBe('sm');
        expect(formatSize({ width: 800, height: 800 })).toBe('md');
        expect(formatSize({ width: 1100, height: 800 })).toBe('lg');
        expect(formatSize({ width: 1400, height: 800 })).toBe('xl');
    });
});