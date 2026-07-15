import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

const LABELS = ["Home Tap", "Borewell", "River", "School Tank", "Hospital Tank", "RO Water", "Other"];

export default function AddWaterSourceDialog({ open, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [label, setLabel] = useState("Home Tap");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a water source name");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await base44.entities.WaterSource.create({
        name: name.trim(),
        label,
        notes: notes.trim(),
      });
      onSaved(created);
      setName("");
      setLabel("Home Tap");
      setNotes("");
      onClose();
    } catch (e) {
      setError(e.message || "Failed to save water source");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle>Add Water Source</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Water Source Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kitchen Tap"
            />
          </div>
          <div className="space-y-2">
            <Label>Label / Category</Label>
            <Select value={label} onValueChange={setLabel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LABELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this water source..."
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Source"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}