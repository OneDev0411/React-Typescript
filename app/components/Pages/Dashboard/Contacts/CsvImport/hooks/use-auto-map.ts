import { useCallback, useState } from 'react'

import { ParseResult } from 'papaparse'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { compareTwoStrings } from 'utils/dice-coefficient'

import { getCsvColumns } from '../helpers/get-csv-columns'
import type { IAttribute } from '../types'

import { useAttributeLabel } from './use-attribute-label'
import { useAttributes } from './use-attributes'

interface CompareMatches {
  attribute: IAttribute
  rate: number
}

export function useAutoMapFields(
  csv: Nullable<ParseResult<unknown>>
): [Record<string, IAttribute>, typeof setList, Nullable<'doing' | 'done'>] {
  const attributes = useAttributes()
  const getAttributeLabel = useAttributeLabel()
  const [list, setList] = useState<Record<string, IAttribute>>({})
  const [status, setStatus] = useState<Nullable<'doing' | 'done'>>(null)

  const findRelatedAttribute = useCallback(
    (column: string) => {
      const matches: CompareMatches[] = []

      attributes.some(attribute => {
        const label = getAttributeLabel(attribute)

        const rate = compareTwoStrings(
          column.trim().toLowerCase(),
          label.toLowerCase()
        )

        if (rate === 0) {
          return false
        }

        matches.push({
          attribute,
          rate
        })

        if (rate === 1) {
          // the best match is found. so skip the rest.
          return true
        }
      })

      if (!matches.length) {
        return null
      }

      const bestMatch = matches.sort((a, b) => b.rate - a.rate)[0]

      return bestMatch.rate > 0.32 ? bestMatch : null
    },
    [attributes, getAttributeLabel]
  )

  useDeepCompareEffect(() => {
    if (status !== null || !csv || csv?.errors.length > 0) {
      return
    }

    console.log('[ Csv Import ] Auto Mapping...')

    setStatus('doing')

    const list = getCsvColumns(csv).reduce((list, column) => {
      const match = findRelatedAttribute(column)

      return match
        ? {
            ...list,
            [column]: match.attribute
          }
        : list
    }, {})

    setStatus('done')
    setList(list)
  }, [csv, attributes, findRelatedAttribute])

  return [list, setList, status]
}
