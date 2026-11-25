"use client";

import { useField } from "formik";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldShellProps {
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ name, label, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface BaseProps {
  name: string;
  label: string;
  hint?: ReactNode;
  className?: string;
}

export function TextField({
  type = "text",
  dir,
  ...props
}: BaseProps & { type?: "text" | "date"; dir?: "rtl" | "ltr" }) {
  const [field, meta] = useField<string>(props.name);
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell {...props} error={error}>
      <Input id={props.name} type={type} dir={dir} aria-invalid={!!error} {...field} />
    </FieldShell>
  );
}

/** Keeps the raw string while typing; the Yup schema casts it to a number. */
export function NumberField({ step = "any", ...props }: BaseProps & { step?: string }) {
  const [field, meta] = useField<string | number>(props.name);
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell {...props} error={error}>
      <Input
        id={props.name}
        type="number"
        inputMode="decimal"
        step={step}
        aria-invalid={!!error}
        {...field}
        value={field.value ?? ""}
      />
    </FieldShell>
  );
}

/** Label-less number input for table cells (e.g. one row per year). */
export function CellNumberField({
  name,
  ariaLabel,
  suffix,
}: {
  name: string;
  ariaLabel: string;
  suffix?: string;
}) {
  const [field, meta] = useField<string | number | null>(name);
  const error = meta.touched ? meta.error : undefined;
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-1">
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          aria-label={ariaLabel}
          aria-invalid={!!error}
          className="h-8 min-w-20"
          {...field}
          value={field.value ?? ""}
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TextareaField({ dir, ...props }: BaseProps & { dir?: "rtl" | "ltr" }) {
  const [field, meta] = useField<string>(props.name);
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell {...props} error={error}>
      <Textarea id={props.name} rows={2} dir={dir} aria-invalid={!!error} {...field} />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export function SelectField({ options, ...props }: BaseProps & { options: SelectOption[] }) {
  const [field, meta, helpers] = useField<string>(props.name);
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell {...props} error={error}>
      <Select
        items={options}
        value={field.value}
        onValueChange={(value) => {
          void helpers.setValue((value as string) ?? "");
          void helpers.setTouched(true, false);
        }}
      >
        <SelectTrigger id={props.name} className="w-full" aria-invalid={!!error}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}
