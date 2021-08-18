import { useState, useMemo } from 'react'

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Fuse from 'fuse.js'

import { SectionCollection } from '@app/hooks/use-marketing-center-sections'
import { goTo } from '@app/utils/go-to'

const HIDDEN_SECTIONS = ['overview', 'designs']

interface Option {
  label: string
  url: string
  section: string
}

interface Props {
  sections: SectionCollection
}

export default function MarketingSearch({ sections }: Props) {
  const options: Option[] = useMemo(() => {
    return Object.keys(sections)
      .filter(sectionName => !HIDDEN_SECTIONS.includes(sectionName))
      .flatMap(sectionName => {
        const section = sections[sectionName]

        return section.items.map(sectionItem => ({
          label: sectionItem.title,
          url: sectionItem.link,
          section: section.title.split(':')[0]
        }))
      })
  }, [sections])

  const [searchResults, setSearchResults] = useState<Option[]>(options)

  const handleSelect = (option: Nullable<Option | string>) => {
    if (!option || typeof option === 'string') {
      return
    }

    goTo(option.url)
  }

  const handleInputChange = (value: string) => {
    if (!value) {
      setSearchResults(options)

      return
    }

    const results = new Fuse(options, {
      keys: ['label', 'section']
    }).search(value)

    setSearchResults(results)
  }

  return (
    <Autocomplete<Option, false, true, true>
      freeSolo
      openOnFocus
      ListboxProps={{ style: { maxHeight: '50vh' } }}
      options={searchResults}
      onChange={(e, option) => handleSelect(option)}
      onInputChange={(e, value) => handleInputChange(value)}
      getOptionLabel={option => option.label}
      groupBy={option => option.section}
      noOptionsText="No results"
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label="Search by category or topic"
          variant="outlined"
        />
      )}
    />
  )
}
