"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";

/** Edit + delete buttons for a table row. Clicks don't bubble to the row. */
export default function RowActions({
  onEdit,
  onDelete,
  deleteDescription,
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleteDescription?: string;
}) {
  const t = useTranslations("common");
  return (
    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={t("edit")} title={t("edit")}>
        <Pencil />
      </Button>
      <ConfirmDialog
        title={t("confirmDelete")}
        description={deleteDescription ?? t("confirmDeleteDescription")}
        onConfirm={onDelete}
        trigger={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={t("delete")}
            title={t("delete")}
          >
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
