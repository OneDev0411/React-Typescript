import { useEffect, useState } from 'react'

import { parse, ParseError, ParseResult } from 'papaparse'

import useNotify from '@app/hooks/use-notify'

export function useParseCsv(
  file: Nullable<File>,
  {
    onError = () => {}
  }: {
    onError: (error: ParseError) => void
  }
): [typeof results, typeof error] {
  const [results, setResults] = useState<Nullable<ParseResult<unknown>>>(null)
  const [error, setError] = useState<Nullable<ParseError>>(null)
  const notify = useNotify()

  useEffect(() => {
    if (!file) {
      return
    }

    parse<unknown, File>(file, {
      skipEmptyLines: true,
      complete: (data: ParseResult<unknown>) => {
        if (data.errors.length) {
          setError(data.errors[0])
          onError(data.errors[0])

          notify({
            status: 'error',
            message: data.errors[0].message
          })

          return
        }

        setResults(data)
      }
    })
  }, [file, notify, onError])

  return [results, error]
}
