import * as React from "react";

export default function Container({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-8xl px-4 ${className}`} {...props} />
  );
}

