import { useState, useEffect } from 'react'

import { Grid, Tabs, Tab } from '@material-ui/core'

import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { MarketingTemplatePickerProps } from '@app/views/components/MarketingTemplatePickers/types'

import TemplatesList from './TemplatesList'

export default function MarketingTemplatePicker({
  templateTypes,
  selectedTab: passedSelectedTab,
  ...templatesListProps
}: MarketingTemplatePickerProps) {
  const [selectedTab, setSelectedTab] = useState<IMarketingTemplateType>(
    passedSelectedTab ?? templateTypes[0]
  )

  useEffect(() => {
    if (!passedSelectedTab) {
      return
    }

    setSelectedTab(passedSelectedTab)
  }, [passedSelectedTab])

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
