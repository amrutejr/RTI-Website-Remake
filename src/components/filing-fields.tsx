import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const base =
  "w-full min-h-11 rounded-md border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, className)} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "min-h-24", className)} />;
}

export function Select({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <span className="relative block">
      <select
        {...props}
        className={cn(base, "appearance-none pr-10", className)}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground"
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-saffron"
      />
      <span className="text-[14px] leading-relaxed">{children}</span>
    </label>
  );
}
