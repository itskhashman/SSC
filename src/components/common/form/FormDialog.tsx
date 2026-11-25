"use client";

import { Form, Formik, type FormikValues } from "formik";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { AnyObjectSchema } from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps<Values extends FormikValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initialValues: Values;
  validationSchema: AnyObjectSchema;
  /** Receives values already cast by the schema (numbers are numbers). */
  onSubmit: (values: Values) => void;
  children: ReactNode;
}

/** Dialog + Formik wrapper shared by every add / edit form. */
export default function FormDialog<Values extends FormikValues>({
  open,
  onOpenChange,
  title,
  description,
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormDialogProps<Values>) {
  const t = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Formik<Values>
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            onSubmit(validationSchema.cast(values) as Values);
            onOpenChange(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="grid gap-4">
              {children}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {t("save")}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
