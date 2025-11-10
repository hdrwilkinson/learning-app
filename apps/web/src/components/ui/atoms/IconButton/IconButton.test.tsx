import * as React from "react";
import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
    it("renders with aria-label", () => {
        render(<IconButton aria-label="Test button">Click</IconButton>);

        const button = screen.getByLabelText("Test button");
        expect(button).toBeInTheDocument();
    });

    it("applies icon size", () => {
        const { container } = render(
            <IconButton aria-label="Test button">Click</IconButton>
        );

        const button = container.querySelector("button");
        expect(button).toHaveClass("h-10", "w-10");
    });

    it("forwards ref correctly", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <IconButton ref={ref} aria-label="Test button">
                Click
            </IconButton>
        );

        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("applies custom className", () => {
        const { container } = render(
            <IconButton aria-label="Test button" className="custom-class">
                Click
            </IconButton>
        );

        const button = container.querySelector("button");
        expect(button).toHaveClass("custom-class");
    });

    it("passes through other button props", () => {
        render(
            <IconButton aria-label="Test button" disabled>
                Click
            </IconButton>
        );

        const button = screen.getByLabelText("Test button");
        expect(button).toBeDisabled();
    });
});
