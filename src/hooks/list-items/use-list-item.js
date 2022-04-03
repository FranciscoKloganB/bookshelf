import { useListItems } from "./use-list-items"

export function useListItem(user, bookId) {
  const {listItems} = useListItems(user)

  return listItems?.find(item => item.bookId === bookId) ?? null
}
