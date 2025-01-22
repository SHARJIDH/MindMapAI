import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Collaborator {
  id: string;
  user: {
    id: string;
    email: string;
  };
  role: "VIEWER" | "EDITOR" | "ADMIN";
}

interface CollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mapId: string;
}

export function CollaborationDialog({
  isOpen,
  onClose,
  mapId,
}: CollaborationDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"VIEWER" | "EDITOR" | "ADMIN">("VIEWER");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, mapId]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`/api/collaboration?mapId=${mapId}`);
      if (!response.ok) throw new Error("Failed to fetch collaborators");
      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      toast.error("Failed to fetch collaborators");
    }
  };

  const handleAddCollaborator = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/collaboration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapId,
          userEmail: email,
          role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add collaborator");
      }

      toast.success("Collaborator added successfully");
      setEmail("");
      fetchCollaborators();
    } catch (error) {
      console.error("Error adding collaborator:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    try {
      const response = await fetch("/api/collaboration", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapId,
          userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove collaborator");
      }

      toast.success("Collaborator removed successfully");
      fetchCollaborators();
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
          <DialogDescription>
            Add or remove collaborators for this mind map.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Select
              value={role}
              onValueChange={(value: "VIEWER" | "EDITOR" | "ADMIN") =>
                setRole(value)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddCollaborator}
              disabled={!email || loading}
            >
              Add
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Current Collaborators</h4>
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {collaborator.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {collaborator.role.toLowerCase()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveCollaborator(collaborator.user.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
