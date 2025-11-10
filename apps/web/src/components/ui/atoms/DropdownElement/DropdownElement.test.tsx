import { render, screen } from "@testing-library/react";
import { HiSun } from "react-icons/hi";
import { DropdownElement } from "./DropdownElement";

describe("DropdownElement", () => {
    it("renders icon and label", () => {
        render(
            <DropdownElement
                icon={<HiSun data-testid="icon" />}
                label="Light"
            />
        );

        expect(screen.getByTestId("icon")).toBeInTheDocument();
        expect(screen.getByText("Light")).toBeInTheDocument();
    });

    it("applies selected state", () => {
        const { container } = render(
            <DropdownElement icon={<HiSun />} label="Light" selected={true} />
        );

        const element = container.firstChild as HTMLElement;
        expect(element).toHaveAttribute("aria-selected", "true");
    });

    it("applies disabled state", () => {
        const { container } = render(
            <DropdownElement icon={<HiSun />} label="Light" disabled={true} />
        );

        const element = container.firstChild as HTMLElement;
        expect(element).toHaveAttribute("aria-disabled", "true");
        expect(element).toHaveClass("opacity-50", "pointer-events-none");
    });

    it("renders with custom className", () => {
        const { container } = render(
            <DropdownElement
                icon={<HiSun />}
                label="Light"
                className="custom-class"
            />
        );

        const element = container.firstChild as HTMLElement;
        expect(element).toHaveClass("custom-class");
    });
});
