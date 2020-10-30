import React from 'react'
import { Select, MenuItem, makeStyles, Theme } from '@material-ui/core'

import {
  useMarketingCenterSections,
  SectionCollection
} from 'hooks/use-marketing-center-sections'

function getValueToLabelMapping(
  sections: SectionCollection
): { [value: string]: string } {
  const resultMapping = {}
  const rootSectionKeys = Object.keys(sections)

  rootSectionKeys.forEach(sectionKey => {
    sections[sectionKey].items.forEach(item => {
      if (!item.value) {
        return
      }

      if (Array.isArray(item.value)) {
        item.value.forEach(value => {
          resultMapping[value] = item.title
        })
      }

      resultMapping[item.value as string] = item.title
    })
  })

  return resultMapping
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      margin: theme.spacing(1, 2, 2),
      width: '90%'
    }
  }),
  { name: 'TemplateTypesSelect' }
)

interface Props {
  items: MarketingTemplateType[]
  value: string
  onSelect: (value: string) => void
}

export default function TemplateTypesSelect({ items, value, onSelect }: Props) {
  const classes = useStyles()

  const sections = useMarketingCenterSections({ types: items })
  const valueToLabelMapping = getValueToLabelMapping(sections)

  const handleChange = (e: React.ChangeEvent<{ value: string }>) => {
    onSelect(e.target.value)
  }

  return (
    <Select
      variant="outlined"
      className={classes.root}
      value={value}
      onChange={handleChange}
    >
      {items.map(item => (
        <MenuItem key={item} value={item}>
          {valueToLabelMapping[item] || item}
        </MenuItem>
      ))}
    </Select>
  )
}
