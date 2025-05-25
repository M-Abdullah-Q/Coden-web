"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
};

export const NewTabs = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <div>
      {/* Tabs List */}
      <div
        className={cn(
          "flex space-x-4 border-b border-gray-900 pb-2",
          containerClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-2 rounded-t-md transition-colors",
              activeTab === tab.value
                ? "bg-gray-200 dark:bg-gray-900 font-semibold"
                : "hover:bg-gray-200 dark:hover:bg-gray-700",
              tabClassName
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className={cn("p-4", contentClassName)}>
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
};
