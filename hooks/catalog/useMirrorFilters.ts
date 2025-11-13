"use client";

import { useMemo, useState } from "react";
import { MirrorTemplate } from "../../lib/mocks/mirrors";

export function useMirrorFilters(mirrors: MirrorTemplate[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [shapeFilter, setShapeFilter] = useState<string | "all">("all");

  const filteredMirrors = useMemo(() => {
    return mirrors.filter((mirror) => {
      const matchesShape = shapeFilter === "all" || mirror.shape === shapeFilter;
      const matchesSearch =
        !searchTerm ||
        mirror.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mirror.shapeName.toLowerCase().includes(searchTerm.toLowerCase());
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

