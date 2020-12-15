import React, { useState } from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'

import { MarketingTemplatePickerProps } from 'components/MarketingTemplatePickers/types'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

import TemplatesList from './TemplatesList'

export default function MarketingTemplatePicker({
  templateTypes,
  ...templatesListProps
}: MarketingTemplatePickerProps) {
  const [selectedTab, setSelectedTab] = useState<IMarketingTemplateType>(
    templateTypes[0]
  )

  if (templateTypes.length === 1) {
    return (
      <TemplatesList templateTypes={templateTypes} {...templatesListProps} />
    )
  }

  return (
    <Grid container>
      <Grid container item>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          variant="scrollable"
          textColor="inherit"
          onChange={(event: unknown, newValue: IMarketingTemplateType) =>
            setSelectedTab(newValue)
          }
        >
          {templateTypes.map(templateType => (
            <Tab
              key={templateType}
              value={templateType}
              label={getTemplateTypeLabel(templateType)}
            />
          ))}
        </Tabs>
      </Grid>
      <Grid container item>
        <TemplatesList {...templatesListProps} templateTypes={[selectedTab]} />
      </Grid>
    </Grid>
  )
}
