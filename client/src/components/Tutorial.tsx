import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  const [showOnStartup, setShowOnStartup] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (!showOnStartup) {
      localStorage.setItem("hasSeenTutorial", "true");
    }
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8"
      >
        <Info className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Play 2048</DialogTitle>
            <DialogDescription>
              Combine tiles with the same number to reach 2048!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium mb-2">Keyboard Controls</h3>
              <p className="text-sm text-muted-foreground">
                Use arrow keys (←↑→↓) to move all tiles in that direction.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Touch/Mouse Controls</h3>
              <p className="text-sm text-muted-foreground">
                Swipe or drag in any direction to move tiles.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Game Rules</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>When two tiles with the same number touch, they merge!</li>
                <li>After each move, a new tile appears (2 or 4)</li>
                <li>Plan your moves to create larger numbers</li>
                <li>The game ends when you reach 2048 or can't move anymore</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showOnStartup"
                checked={showOnStartup}
                onCheckedChange={(checked) => setShowOnStartup(checked as boolean)}
              />
              <Label htmlFor="showOnStartup">Show on startup</Label>
            </div>
            <Button onClick={handleClose}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
