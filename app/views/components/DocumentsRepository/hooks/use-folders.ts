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
    console.log('XXXXX', {
      searchCriteria,
      categoryNames,
      forms,
      activeCategoryIndex
    })

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
  }, [searchCriteria, categoryNames, forms, activeCategoryIndex])

  return list
}
