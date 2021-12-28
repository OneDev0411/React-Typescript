import { useEffect, useState } from 'react'

import { parse, ParseResult } from 'papaparse'

export function useParseCsv(file: Nullable<File>) {
  const [results, setResults] = useState<Nullable<ParseResult<unknown>>>(null)

  useEffect(() => {
    if (!file) {
      return
    }

    parse<unknown, File>(file, {
      skipEmptyLines: true,
      complete: setResults
    })
  }, [file])

  return results
}
