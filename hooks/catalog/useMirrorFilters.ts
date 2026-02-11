"use client";

import { useMemo, useState } from "react";
import type { Mirror } from "../../lib/api/mirrors";

export function useMirrorFilters(mirrors: Mirror[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [shapeFilter, setShapeFilter] = useState<string | "all">("all");

  const filteredMirrors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mirrors.filter((mirror) => {
      const matchesShape =
        shapeFilter === "all" || mirror.shape.id === shapeFilter;

      const matchesSearch =
        !normalizedSearch ||
        mirror.name.toLowerCase().includes(normalizedSearch) ||
        mirror.shape.name.toLowerCase().includes(normalizedSearch);

      return matchesShape && matchesSearch;
    });
  }, [mirrors, shapeFilter, searchTerm]);

  return {
    filteredMirrors,
    searchTerm,
    setSearchTerm,
    shapeFilter,
    setShapeFilter,
  };
}

