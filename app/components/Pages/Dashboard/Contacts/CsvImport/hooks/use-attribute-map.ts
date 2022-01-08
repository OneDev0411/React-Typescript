import { useState } from 'react'

import { ParseResult } from 'papaparse'
import superagent from 'superagent'
import useDeepCompareEffect from 'use-deep-compare-effect'

import useNotify from '@app/hooks/use-notify'
import config from 'config'

import { convertOptionToAttribute } from '../helpers/convert-option-to-attribute'
import { getCsvColumns } from '../helpers/get-csv-columns'
import { MappedField, AttributeOption } from '../types'

import { useOptions } from './attribute-options/use-attribute-options'

export function useAttributeMap(
  csv: Nullable<ParseResult<unknown>>
): [
  Record<string, Nullable<MappedField>>,
  typeof setList,
  Nullable<'doing' | 'done'>
] {
  const [list, setList] = useState<Record<string, Nullable<MappedField>>>({})
  const [status, setStatus] = useState<Nullable<'doing' | 'done'>>(null)
  const options: AttributeOption[] = useOptions({}, '')
  const notify = useNotify()

  useDeepCompareEffect(() => {
    if (
      status !== null ||
      !csv ||
      csv?.errors.length > 0 ||
      options.length === 0
    ) {
      return
    }

    const columns = getCsvColumns(csv)

    const request = async () => {
      console.log('Start Mapping...')
      setStatus('doing')

      try {
        const response = await superagent
          .post(`${config.nlp.server}/csv/similarity`)
          .send({
            columns,
            attributes: options
          })

        const { data: results } = response.body

        const list = Object.entries(results).reduce(
          (list, [colName, value]) => {
            const { attribute: option, rate } = value as {
              attribute: AttributeOption
              rate: number
            }

            if (rate < 0.25) {
              return list
            }

            return {
              ...list,
              [colName]: {
                ...convertOptionToAttribute(option),
                index: option.index,
                multiValued: option.multiValued,
                isPartner: option.isPartner
              } as MappedField
            }
          },
          {} as Record<string, MappedField>
        )

        setList(list)
      } catch (e) {
        notify({
          status: 'error',
          message: 'Could not connect to nlp server'
        })
      } finally {
        setStatus('done')
      }
    }

    request()
  }, [csv, options, notify])

  return [list, setList, status]
}
