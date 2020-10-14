import React, { useMemo } from 'react'
import { Tabs, Tab } from '@material-ui/core'

import { getTemplateTypeToLabelMapping } from 'hooks/use-marketing-center-sections'

interface Props {
  types: IMarketingTemplateType[]
  selectedType?: IMarketingTemplateType
  onChange: (type: IMarketingTemplateType) => void
}

export default function CategoriesTabs({
  types,
  selectedType,
  onChange
}: Props) {
  const templateTypeToLabelMapping = useMemo(getTemplateTypeToLabelMapping, [])

  const handleChange = (event: unknown, newValue: IMarketingTemplateType) => {
    onChange(newValue)
  }

  return (
    <Tabs
      value={selectedType ?? types[0]}
      variant="scrollable"
      indicatorColor="primary"
      textColor="inherit"
      onChange={handleChange}
    >
      {types.map(templateType => (
        <Tab
          key={templateType}
          value={templateType}
          label={templateTypeToLabelMapping[templateType] ?? templateType}
        />
      ))}
    </Tabs>
  )
}
