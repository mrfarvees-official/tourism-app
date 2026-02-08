"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useQueryParamApi } from "@/src/utils/queryParamProvider"; // your single-writer provider

type Options<T> = {
  defaultValue: T;
  parse?: (raw: string | null) => T;
  serialize?: (value: T) => string | null;
};

export function useQueryState<T>(
  key: string,
  opts: Options<T>
): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
  const {
    defaultValue,
    parse = (raw) => (raw ?? defaultValue) as T,
    serialize = (v) => (v == null ? null : String(v)),
  } = opts;

  const searchParams = useSearchParams();
  const { setParam } = useQueryParamApi();

  const updatingFromUrlRef = React.useRef(false);
  const didMountRef = React.useRef(false);

  const [state, setState] = React.useState<T>(() => parse(searchParams.get(key)));

  // URL -> state
  React.useEffect(() => {
    const next = parse(searchParams.get(key));
    if (Object.is(next, state)) return;

    updatingFromUrlRef.current = true;
    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, key]);

  // state -> URL
  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    //  if state change came from URL, don't write it back
    if (updatingFromUrlRef.current) {
      updatingFromUrlRef.current = false;
      return;
    }

    const encoded = serialize(state);
    const isDefault = Object.is(state, defaultValue);
    setParam(key, isDefault ? null : encoded);
  }, [state, key, defaultValue, serialize, setParam]);

  return [state, setState] as const;
}
