import React, { useState, RefObject } from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'

import MarketingTemplatePicker from 'components/MarketingTemplatePicker'
import MarketingTemplateInstancePicker from 'components/MarketingTemplateInstancePicker'

type TabValue = 'MyDesigns' | 'MarketingTemplates'

interface Props {
  user: IUser
  templateTypes?: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
  containerRef?: RefObject<HTMLElement>
  onSelect: (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => void
}

export default function MarketingTemplateAndTemplateInstancePicker(
  props: Props
) {
  const [selectedTab, setSelectedTab] = useState<TabValue>('MyDesigns')

  return (
    <Grid container>
      <Grid container item>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          textColor="inherit"
          onChange={(event: unknown, newValue: TabValue) =>
            setSelectedTab(newValue)
          }
        >
          <Tab value="MyDesigns" label="My Designs" />
          <Tab value="MarketingTemplates" label="Marketing Templates" />
        </Tabs>
      </Grid>
      <Grid container item>
        {selectedTab === 'MyDesigns' && (
          <MarketingTemplateInstancePicker {...props} />
        )}
        {selectedTab === 'MarketingTemplates' && (
          <MarketingTemplatePicker {...props} />
        )}
      </Grid>
    </Grid>
  )
}
