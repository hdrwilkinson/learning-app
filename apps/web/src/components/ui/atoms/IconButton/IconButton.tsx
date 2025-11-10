import * as React from "react";
import { Button, ButtonProps } from "../../shadcn/button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
    "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, "aria-label": ariaLabel, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size="icon"
                className={cn(className)}
                aria-label={ariaLabel}
                {...props}
            />
        );
    }
);
IconButton.displayName = "IconButton";

export { IconButton };
