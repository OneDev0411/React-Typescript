import { useMemo } from 'react'

import { Autocomplete } from '@material-ui/lab'
import Fuse from 'fuse.js'

import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { SearchInput } from '@app/views/components/SearchInput'

import { MarketingSearchInputOption, MarketingSearchInputProps } from './types'

const HIDDEN_SECTIONS = ['overview', 'designs']

export default function MarketingSearchInput({
  sections,
  templateTypeMediums,
  onSelect
}: MarketingSearchInputProps) {
  const options: MarketingSearchInputOption[] = useMemo(() => {
    return Object.keys(sections)
      .filter(sectionName => !HIDDEN_SECTIONS.includes(sectionName))
      .flatMap(sectionName => {
        const section = sections[sectionName]

        return section.items.flatMap(sectionItem => {
          const sectionMediums =
            sectionItem.value &&
            typeof sectionItem.value === 'string' &&
            templateTypeMediums[sectionItem.value]
              ? templateTypeMediums[sectionItem.value]
              : null

          if (!sectionMediums) {
            return []
          }

          return sectionMediums.map(medium => ({
            label: `${sectionItem.title} ${getTemplateMediumLabel(medium)}`,
            url: `${sectionItem.link}/${medium}`,
            section: section.title.split(':')[0]
          }))
        })
      })
  }, [sections, templateTypeMediums])

  const handleSelect = (
    option: Nullable<MarketingSearchInputOption | string>
  ) => {
    if (!option || typeof option === 'string') {
      return
    }

    onSelect(option)
  }

  return (
    <Autocomplete<MarketingSearchInputOption, false, true, true>
      freeSolo
      openOnFocus
      ListboxProps={{ style: { maxHeight: '50vh' } }}
      options={options}
      onChange={(e, option) => handleSelect(option)}
      getOptionLabel={option => option.label}
      groupBy={option => option.section}
      noOptionsText="No results"
      filterOptions={(options, state) => {
        if (!state.inputValue) {
          return options
        }

        return new Fuse(options, {
          keys: ['label', 'section'],
          threshold: 0.3
        })
          .search(state.inputValue)
          .sort((a, b) => a.section.localeCompare(b.section))
      }}
      renderInput={params => (
        <SearchInput
          {...params}
          fullWidth
          placeholder="Search by category or topic"
        />
      )}
    />
  )
}
