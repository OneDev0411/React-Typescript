import { useEffect, useState } from 'react'

import matchSorter from 'match-sorter'

import { useDocumentRepositoryContext } from '../context/use-document-repository-context'

interface SearchResult {
  title: string
  list: IBrandForm[]
}

export function useFolders(): SearchResult[] {
  const [list, setList] = useState<SearchResult[]>([])

  const { activeCategoryIndex, forms, searchCriteria, categoryNames } =
    useDocumentRepositoryContext()

  useEffect(() => {
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

    const activeFolder =
      activeCategoryIndex !== null ? [getFolder(activeCategoryIndex)] : []

    const results =
      searchCriteria.length === 0
        ? activeFolder
        : Object.values(forms).map((_, index) => getFolder(index))

    setList(results.filter(item => item.list.length > 0))
  }, [searchCriteria, categoryNames, forms, activeCategoryIndex])

  return list
}
