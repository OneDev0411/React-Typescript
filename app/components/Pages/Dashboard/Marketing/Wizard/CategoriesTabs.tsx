import React from 'react'
import { Tabs, Tab } from '@material-ui/core'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

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
          label={getTemplateTypeLabel(templateType)}
        />
      ))}
    </Tabs>
  )
}
