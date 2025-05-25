"use client";

import { Clipboard, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodeContext } from "@/providers/CodeProvider";
import { useState } from "react";

const CopyButton = () => {
  const { code, fullBoilerplates, language } = useCodeContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(fullBoilerplates?.[language].replace('###USER_CODE_HERE###', code) || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      {copied ? (
        <>
          <ClipboardCheck className="h-4 w-4 text-green-500" />
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default CopyButton;
