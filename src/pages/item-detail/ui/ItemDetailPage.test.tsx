import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, renderRouter, screen } from "expo-router/testing-library";
import { Text } from "react-native";

import { ItemDetailPage } from "./ItemDetailPage";
import { itemApi } from "@/entities/item";
import { ApiError } from "@/shared/api";

function DetailRoute() {
  // gcTime Infinity: no cache timers, so Jest can exit once the tests are done.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return (
    <QueryClientProvider client={client}>
      <ItemDetailPage />
    </QueryClientProvider>
  );
}

function openDetail(id: string) {
  return renderRouter(
    {
      index: () => <Text testID="list-screen">list</Text>,
      "item/[id]": DetailRoute,
    },
    { initialUrl: `/item/${id}` },
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ItemDetailPage", () => {
  it("shows a loading text, then the item", async () => {
    openDetail("2");

    expect(screen.getByTestId("detail-loading-text")).toBeTruthy();
    expect(await screen.findByTestId("detail-title-text")).toHaveTextContent(
      "Item two",
    );
  });

  it("shows an error with Retry when loading fails, and the item after Retry", async () => {
    jest
      .spyOn(itemApi, "get")
      .mockRejectedValueOnce(new ApiError("http", "Server error", 500));
    openDetail("2");

    expect(await screen.findByTestId("detail-error-text")).toBeTruthy();

    fireEvent.press(screen.getByTestId("detail-retry-button"));

    expect(await screen.findByTestId("detail-title-text")).toHaveTextContent(
      "Item two",
    );
  });

  it("sends an id that does not exist back to the list", async () => {
    const { getPathname } = openDetail("999");

    expect(await screen.findByTestId("list-screen")).toBeTruthy();
    expect(getPathname()).toBe("/");
  });
});
