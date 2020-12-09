import React, { useState } from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

import TemplatesList from 'components/MarketingTemplatePickers/MarketingTemplatePicker/TemplatesList'
import MarketingTemplateInstancePicker from 'components/MarketingTemplatePickers/MarketingTemplateInstancePicker'
import { MarketingTemplateAndTemplateInstancePickerProps } from 'components/MarketingTemplatePickers/types'

type MyDesignsOrTemplateType = 'MyDesigns' | IMarketingTemplateType

export default function MarketingTemplateAndTemplateInstancePicker({
  templateTypes,
  ...props
}: MarketingTemplateAndTemplateInstancePickerProps) {
  const [selectedTab, setSelectedTab] = useState<MyDesignsOrTemplateType>(
    'MyDesigns'
  )

  return (
    <Grid container>
      <Grid container item>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          variant="scrollable"
          textColor="inherit"
          onChange={(event: unknown, newValue: MyDesignsOrTemplateType) =>
            setSelectedTab(newValue)
          }
        >
          <Tab value="MyDesigns" label="My Designs" />
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
        {selectedTab === 'MyDesigns' && (
          <MarketingTemplateInstancePicker
            {...props}
            templateTypes={templateTypes}
          />
        )}
        {selectedTab !== 'MyDesigns' && (
          <TemplatesList {...props} templateTypes={[selectedTab]} />
        )}
      </Grid>
    </Grid>
  )
}
