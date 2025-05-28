"use client";

import { useState } from "react";
import { Sparkles, Upload, Bot, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeContext } from "@/providers/CodeProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import { HintsDrawer } from "./HintsDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FloatingDock() {
  const [visible, setVisible] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false); // 👈 new modal state
  const [hintsDrawerOpen, setHintsDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { code, saveFunctions, language, resetFunctions } = useCodeContext();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        const fileExtension = selectedFile.name.split(".").pop();
        const languageMap: { [key: string]: string } = {
          cpp: "cpp",
          js: "javascript",
          java: "java",
          py: "python",
        };
        const language = languageMap[fileExtension || ""] || "Unknown";

        const storedData = localStorage.getItem("uploadedCode");
        let newData = storedData
          ? JSON.parse(storedData)
          : { cpp: null, java: null, javascript: null, python: null };

        if (language in newData) {
          newData[language] = content;
        }

        localStorage.setItem("uploadedCode", JSON.stringify(newData));
      }
    };
    reader.readAsText(selectedFile);
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const handleReset = () => {
    resetFunctions();
    setSaveModalOpen(false);
    toast({
      title: "Code Reset",
      description: "Your Code has been set to Default",
    });
  };

  const handleSave = () => {
    saveFunctions();
    toast({
      title: "Code Saved",
      description: "Your channges have been saved locally",
    });
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "fixed right-0 top-1/4 w-3 h-10 bg-accent rounded-l cursor-pointer",
          visible ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
        )}
        onMouseEnter={() => setVisible(true)}
      ></div>
      <div
        className={cn(
          "fixed right-2 top-1/4 flex flex-col gap-4 p-2 bg-accent rounded-lg shadow-lg transition-all",
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        )}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div>
          <button
            className="p-3 bg-neutral-700 rounded hover:bg-gray-600"
            onClick={() => setHintsDrawerOpen(true)}
            aria-label="Open Hints"
          >
            <Sparkles size={24} color="white" />
          </button>
        </div>
        <button
          className=" flex p-3 bg-neutral-700 rounded hover:bg-gray-600"
          onClick={() => setSaveModalOpen(true)}
          aria-label="Save code"
        >
          <Save size={24} color="white" />
        </button>
        <button
          className="p-3 bg-neutral-700 rounded hover:bg-gray-600"
          onClick={() => setVisible(false)}
          aria-label="Close Dock"
        >
          <X size={24} color="white" />
        </button>
      </div>
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Code File</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            accept=".cpp,.js,.java,.py"
            onChange={handleFileChange}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setUploadModalOpen(false)}>Close</Button>
            <Button onClick={handleFileUpload} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Settings</DialogTitle>
          </DialogHeader>

          {/* Your custom content goes here */}
          <div className="mt-4 mb-6">
            <Card className="p-4 flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
                <div className="flex gap-2 py-2 items-center">
                  <LanguageSelector className="mx-auto" />
                </div>
              </div>
              <div className="mt-4">
                <CodeEditor />
              </div>
            </Card>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="destructive" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <HintsDrawer open={hintsDrawerOpen} onOpenChange={setHintsDrawerOpen} />
    </div>
  );
}
