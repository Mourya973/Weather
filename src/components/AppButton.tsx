import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

interface AppButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function AppButton({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  ...props
}: AppButtonProps) {
  return (
    <Button variant={variant} color={color} size={size} {...props}>
      {children}
    </Button>
  );
}
