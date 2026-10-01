import { ItemsList } from "./ItemsList";
import { useItems } from "@/entities/item";
import { ErrorState, LoadingState } from "@/shared/ui";

export function ItemsPage() {
  const { data, isError, isFetching, refetch } = useItems();

  if (data) {
    return <ItemsList items={data} />;
  }
  if (isError && !isFetching) {
    return (
      <ErrorState
        testIdPrefix="items"
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }
  return <LoadingState testIdPrefix="items" />;
}
