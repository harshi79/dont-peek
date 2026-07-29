"use client";

import React from "react";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({
  code,
  language = "json",
  title,
}: CodeBlockProps) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-blood-border bg-blood-charcoal/90 my-3">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-blood-surface/90 border-b border-blood-border text-xs font-mono text-gray-300">
          <span>{title}</span>
          <span className="uppercase text-[10px] text-blood-muted tracking-wider">
            {language}
          </span>
        </div>
      )}
      <div className="relative p-4 font-mono text-xs sm:text-sm text-gray-200 overflow-x-auto">
        <div className="absolute top-3 right-3">
          <CopyButton
            textToCopy={code}
            label="Copy"
            className="!px-2.5 !py-1 bg-blood-black/80 hover:bg-blood-black"
          />
        </div>
        <pre className="pr-16 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
