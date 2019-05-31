
export function notDeleted(input: {deleted_at?: number | string | null}): boolean {
  return !input.deleted_at
}