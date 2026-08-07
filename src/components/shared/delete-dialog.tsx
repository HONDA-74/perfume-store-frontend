import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  deleteLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

/**
 * DeleteDialog — specialized confirmation dialog for delete actions.
 * Uses danger styling and clear destructive language.
 */
export function DeleteDialog({
  isOpen,
  onClose,
  onDelete,
  title = 'Delete item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  deleteLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
}: DeleteDialogProps) {
  const finalDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : description;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-50">
            <Trash2 className="h-6 w-6 text-error-500" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{finalDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
          >
            {deleteLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
