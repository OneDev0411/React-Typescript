import { useMemo } from 'react'

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Fuse from 'fuse.js'

import { TemplateTypeToMediumsMap } from '@app/hooks/use-marketing-center-mediums'
import { SectionCollection } from '@app/hooks/use-marketing-center-sections'
import { goTo } from '@app/utils/go-to'
import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'

const HIDDEN_SECTIONS = ['overview', 'designs']

interface Option {
  label: string
  url: string
  section: string
}

interface Props {
  sections: SectionCollection
  templateTypeMediums: TemplateTypeToMediumsMap
}

export default function MarketingSearch({
  sections,
  templateTypeMediums
}: Props) {
  console.log({ sections, templateTypeMediums })

  const options: Option[] = useMemo(() => {
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

  const handleSelect = (option: Nullable<Option | string>) => {
    if (!option || typeof option === 'string') {
      return
    }

    goTo(option.url)
  }

  return (
    <Autocomplete<Option, false, true, true>
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
