"use client";

import { ReactNode } from "react";
import Button from "@/components/atoms/Button";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export default function ButtonGroup({ children, className }: ButtonGroupProps) {
  return <div className={className}>{children}</div>;
}

ButtonGroup.Button = Button;
