import { useEffect, useState } from 'react'

import matchSorter from 'match-sorter'

import { useDocumentRepositoryContext } from '../context/use-document-repository-context'

interface SearchResult {
  title: string
  list: IBrandForm[]
}

export function useFolders(): [SearchResult[], boolean] {
  const [isSearching, setIsSearching] = useState(false)
  const [list, setList] = useState<SearchResult[]>([])

  const { activeCategoryIndex, forms, searchCriteria, categoryNames } =
    useDocumentRepositoryContext()

  useEffect(() => {
    setIsSearching(true)

    // use async searching technique to avoid page lock for huge lists
    setTimeout(() => {
      const getFolder = (index: number) => {
        const title = categoryNames?.[index]
        const formsList = forms?.[title] ?? []

        const list = searchCriteria
          ? matchSorter(formsList, searchCriteria, {
              keys: ['name']
            })
          : formsList

        return {
          title,
          list
        }
      }

      const results =
        searchCriteria.length === 0
          ? [getFolder(activeCategoryIndex)]
          : Object.values(forms).map((_, index) => getFolder(index))

      setList(results.filter(item => item.list.length > 0))
      setIsSearching(false)
    }, 0)
  }, [searchCriteria, categoryNames, forms, activeCategoryIndex])

  return [list, isSearching]
}
