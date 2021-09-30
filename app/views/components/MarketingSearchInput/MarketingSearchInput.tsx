import { useMemo } from 'react'

import { Autocomplete } from '@material-ui/lab'
import Fuse from 'fuse.js'

import { useTemplateTypeSections } from '@app/hooks/use-template-type-sections'
import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { SearchInput } from '@app/views/components/SearchInput'

import { MarketingSearchInputProps, TemplateTypeWithMedium } from './types'

interface TemplateTypeWithMediumAndCategory extends TemplateTypeWithMedium {
  category: string
}

export default function MarketingSearchInput({
  types,
  onSelect
}: MarketingSearchInputProps) {
  const { getSection } = useTemplateTypeSections()
  const typesWithCategory: TemplateTypeWithMediumAndCategory[] = useMemo(
    () =>
      types.map(data => ({
        ...data,
        category: getSection(data.type).title
      })),
    [types, getSection]
  )
  const handleSelect = (
    option: Nullable<TemplateTypeWithMediumAndCategory | string>
  ) => {
    if (!option || typeof option === 'string') {
      return
    }

    onSelect(option)
  }

  const getOptionLabel = (option: TemplateTypeWithMediumAndCategory) => {
    return `${getTemplateTypeLabel(option.type)}${
      option.medium ? ` ${getTemplateMediumLabel(option.medium)}` : ''
    }`
  }

  return (
    <Autocomplete<TemplateTypeWithMediumAndCategory, false, true, true>
      openOnFocus
      ListboxProps={{ style: { maxHeight: '50vh' } }}
      options={typesWithCategory}
      onChange={(e, option) => handleSelect(option)}
      getOptionLabel={getOptionLabel}
      groupBy={option => option.category}
      noOptionsText="No results"
      filterOptions={(options, state) => {
        if (!state.inputValue) {
          return options
        }

        return new Fuse(options, {
          keys: ['type', 'medium', 'category'],
          threshold: 0.3
        })
          .search(state.inputValue)
          .sort((a, b) => a.category.localeCompare(b.category))
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
