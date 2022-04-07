import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'

import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function bookSearchConfig(query, user) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
    config: {
      onSuccess(books) {
        books.forEach(book => {
          queryCache.setQueryData(['book', {bookId: book.id}], book)
        })
      },
    },
  }
}

function useBookSearch(query, user) {
  const queryResult = useQuery(bookSearchConfig(query, user))

  return {...queryResult, books: queryResult.data ?? loadingBooks}
}

function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(bookSearchConfig('', user))
}

export {useBookSearch, refetchBookSearchQuery}
