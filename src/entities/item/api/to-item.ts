import type { Item } from "../model/item";
import { ApiError } from "@/shared/api";

/** An item as the backend sends it. */
type ItemDto = { id: string; name: string; details: string };

function isItemDto(body: unknown): body is ItemDto {
  if (typeof body !== "object" || body === null) {
    return false;
  }
  const { id, name, details } = body as Record<string, unknown>;
  return (
    typeof id === "string" &&
    typeof name === "string" &&
    typeof details === "string"
  );
}

export function toItem(body: unknown): Item {
  if (!isItemDto(body)) {
    throw new ApiError("invalid-response", "The item has the wrong shape");
  }
  return { id: body.id, title: body.name, description: body.details };
}

export function toItems(body: unknown): Item[] {
  if (!Array.isArray(body)) {
    throw new ApiError("invalid-response", "The item list is not a list");
  }
  return body.map(toItem);
}
