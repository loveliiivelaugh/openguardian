import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartButtons from "./ChartButtons";


describe("ChartButtons component", () => {
    it("renders the toggle button initially", () => {
        render(<ChartButtons setActiveChart={vi.fn()} />);
        
        const toggleButton = screen.getByRole("button");
        // @ts-ignore
        expect(toggleButton).toBeInTheDocument();
    });

    it("toggles buttons visibility on click", () => {
        render(<ChartButtons setActiveChart={vi.fn()} />);
        
        const toggleButton = screen.getByRole("button");
        fireEvent.click(toggleButton);

        expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
        
        fireEvent.click(toggleButton);
        expect(screen.getAllByRole("button").length).toBe(1);
    });

    it("calls setActiveChart with correct value when a button is clicked", () => {
        const setActiveChart = vi.fn();
        render(<ChartButtons setActiveChart={setActiveChart} />);
        
        const toggleButton = screen.getByRole("button");
        fireEvent.click(toggleButton);
        
        const barChartButton = screen.getByRole("button", { name: /bar/i });
        fireEvent.click(barChartButton);
        
        expect(setActiveChart).toHaveBeenCalledWith("bar");
    });
});
