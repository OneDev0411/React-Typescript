import { useMemo } from 'react'

import { Autocomplete } from '@material-ui/lab'
import Fuse from 'fuse.js'

import { useTemplateTypeSections } from '@app/hooks/use-template-type-sections'
import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { SearchInput } from '@app/views/components/GlobalHeaderWithSearch/SearchInput'

import { MarketingSearchInputProps, TemplateTypeWithMedium } from './types'

interface MarketingSearchResult extends TemplateTypeWithMedium {
  category: string
  title: string
}

export default function MarketingSearchInput({
  types,
  onSelect
}: MarketingSearchInputProps) {
  const { getSection } = useTemplateTypeSections()
  const typesWithCategory: MarketingSearchResult[] = useMemo(
    () =>
      types.map(data => ({
        ...data,
        category: getSection(data.type).title,
        title: `${getTemplateTypeLabel(data.type)}${
          data.medium ? ` ${getTemplateMediumLabel(data.medium)}` : ''
        }`
      })),
    [types, getSection]
  )
  const handleSelect = (option: Nullable<MarketingSearchResult | string>) => {
    if (!option || typeof option === 'string') {
      return
    }

    onSelect(option)
  }

  return (
    <Autocomplete<MarketingSearchResult, false, true, true>
      openOnFocus
      ListboxProps={{ style: { maxHeight: '50vh' } }}
      options={typesWithCategory}
      onChange={(e, option) => handleSelect(option)}
      getOptionLabel={option => option.title}
      groupBy={option => option.category}
      noOptionsText="No results"
      filterOptions={(options, state) => {
        if (!state.inputValue) {
          return options
        }

        return new Fuse(options, {
          keys: ['title', 'type', 'medium', 'category'],
          threshold: 0.3
        })
          .search(state.inputValue)
          .sort((a, b) => a.category.localeCompare(b.category))
      }}
      renderInput={params => (
        <SearchInput
          {...params}
          fullWidth
          color="primary"
          variant="outlined"
          size="small"
          label="Search by category or topic"
        />
      )}
    />
  )
}
