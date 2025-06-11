import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmDialog = ({ open, onClose, onConfirm, title, description }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Are you sure?"}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-500">{description || "This action cannot be undone."}</div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="ml-2">
            Yes, Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
