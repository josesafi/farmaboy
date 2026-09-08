"use client";

import React from "react";
import { LiveSearchBar } from "./LiveSearchBar";

interface CatalogSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

export const CatalogSearchAutocomplete: React.FC<CatalogSearchAutocompleteProps> = ({
  placeholder,
  className = "",
  onSearchSubmit,
}) => {
  return (
    <LiveSearchBar
      placeholder={placeholder}
      className={className}
      onSelect={() => {
        if (onSearchSubmit) onSearchSubmit("");
      }}
    />
  );
};
