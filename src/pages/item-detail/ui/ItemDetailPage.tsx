import { Redirect, useLocalSearchParams } from "expo-router";

import { ItemDetail, useItem } from "@/entities/item";
import { ErrorState, LoadingState } from "@/shared/ui";

export function ItemDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isError, isFetching, refetch } = useItem(id);

  if (data === null) {
    return <Redirect href="/" />;
  }
  if (data) {
    return <ItemDetail item={data} />;
  }
  if (isError && !isFetching) {
    return (
      <ErrorState
        testIdPrefix="detail"
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }
  return <LoadingState testIdPrefix="detail" />;
}
