import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { ItemsPage } from "./ItemsPage";
import { itemApi } from "@/entities/item";
import { setLanguage } from "@/shared/config";
import { ApiError } from "@/shared/api";

function renderPage() {
  // gcTime Infinity: no cache timers, so Jest can exit once the tests are done.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ItemsPage />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  jest.restoreAllMocks();
  setLanguage("en");
});

describe("ItemsPage", () => {
  it("shows a loading text, then the items", async () => {
    renderPage();

    expect(screen.getByTestId("items-loading-text")).toBeTruthy();
    expect(await screen.findByTestId("items-main-list")).toBeTruthy();
    expect(screen.getByText("Item two")).toBeTruthy();
  });

  it("shows an error with Retry when loading fails, and the list after Retry", async () => {
    jest
      .spyOn(itemApi, "list")
      .mockRejectedValueOnce(new ApiError("network", "offline"));
    renderPage();

    expect(await screen.findByTestId("items-error-text")).toBeTruthy();

    fireEvent.press(screen.getByTestId("items-retry-button"));

    expect(await screen.findByTestId("items-main-list")).toBeTruthy();
    expect(screen.queryByTestId("items-error-text")).toBeNull();
  });

  it("shows the empty message when there are no items", async () => {
    jest.spyOn(itemApi, "list").mockResolvedValue([]);
    renderPage();

    expect(await screen.findByTestId("items-empty-text")).toBeTruthy();
  });

  it("shows the loading text in Portuguese", async () => {
    setLanguage("pt");
    renderPage();

    expect(screen.getByText("A carregar...")).toBeTruthy();
    await screen.findByTestId("items-main-list");
  });
});
