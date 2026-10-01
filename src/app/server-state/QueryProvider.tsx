import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function QueryProvider({ children }: Props) {
  // One retry, not the library's three with backoff, so a failed request reaches the
  // error screen within a couple of seconds.
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
