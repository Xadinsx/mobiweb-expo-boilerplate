import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { itemApi } from "../api/item-api";
import { useItem } from "./use-item";
import { useItems } from "./use-items";
import { ApiError } from "@/shared/api";

function wrapper({ children }: { children: ReactNode }) {
  // gcTime Infinity: no cache timers, so Jest can exit once the tests are done.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useItems", () => {
  it("goes from loading to the three items", async () => {
    const { result } = renderHook(() => useItems(), { wrapper });

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.data).toHaveLength(3));
  });

  it("ends in an error that says what kind of failure it was", async () => {
    jest
      .spyOn(itemApi, "list")
      .mockRejectedValue(new ApiError("network", "offline"));

    const { result } = renderHook(() => useItems(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ kind: "network" });
  });
});

describe("useItem", () => {
  it("loads one item by id", async () => {
    const { result } = renderHook(() => useItem("2"), { wrapper });

    await waitFor(() => expect(result.current.data?.title).toBe("Item two"));
  });

  it("resolves null, not an error, for an id that does not exist", async () => {
    const { result } = renderHook(() => useItem("999"), { wrapper });

    await waitFor(() => expect(result.current.data).toBeNull());
    expect(result.current.isError).toBe(false);
  });
});
