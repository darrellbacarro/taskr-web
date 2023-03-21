import { useState, useMemo, useCallback } from "react";
import { supabase } from "../supabase";
import useSWR from "swr";
import { useDebouncedState } from "@mantine/hooks";

export type Sorter = [string, boolean]; // true = asc, false = desc

type Params = {
  table: string;
  queryFields?: string[];
  returnFields?: string[];
  defaultSorter?: Sorter;
};

export const useSWRQuery = ({
  table,
  queryFields = [],
  returnFields = ['*'],
  defaultSorter = ['id', true],
}: Params) => {
  const [search, setSearch] = useDebouncedState("", 500);
  const [sorter, setSorter] = useState(defaultSorter);
  const swrKey = useMemo(() => [table, search, sorter], [search, table, sorter]);

  const result = useSWR(swrKey, async ([_key, search, sorter]: (string | Sorter)[]) => {
    const [sortField, sortOrder] = sorter as Sorter;
    let query = supabase.from(table).select(returnFields.join(','));

    if (search) {
      const conditions = queryFields.map((field) => `${field}.ilike.%${search}%`);
      query = query.or(conditions.join(','));
    }

    query = query.order(sortField, { ascending: sortOrder });

    return await query;
  });

  const sort = useCallback((sorter: Sorter | null) => {
    if (!sorter) setSorter(['id', true]);
    else setSorter(sorter);
  }, [setSorter]);

  return {
    ...result,
    setSearch,
    sort,
    sorter,
  };
};