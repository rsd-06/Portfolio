"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ children, ...props }: any) {
  const [copied, setCopied] = useState(false);

  // Extract the raw code string from the nested <code> element
  // next-mdx-remote usually passes children as the <code> element
  const codeString = children?.props?.children || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group my-8 rounded-lg overflow-hidden border border-[color-mix(in_srgb,var(--color-text)_10%,transparent)]">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-[color-mix(in_srgb,var(--color-text)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-text)_20%,transparent)] transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto text-sm f-mono bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)]" {...props}>
        {children}
      </pre>
    </div>
  );
}
