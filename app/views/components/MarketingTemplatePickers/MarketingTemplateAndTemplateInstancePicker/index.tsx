import { Grid, Tabs, Tab } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import useControllableState from 'react-use-controllable-state'

import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import MarketingTemplateInstancePicker from '@app/views/components/MarketingTemplatePickers/MarketingTemplateInstancePicker'
import TemplatesList from '@app/views/components/MarketingTemplatePickers/MarketingTemplatePicker/TemplatesList'
import {
  MarketingTemplateAndTemplateInstancePickerProps,
  MyDesignsOrTemplateType
} from '@app/views/components/MarketingTemplatePickers/types'

interface Props extends MarketingTemplateAndTemplateInstancePickerProps {
  tabs?: IMarketingTemplateType[]
}

export default function MarketingTemplateAndTemplateInstancePicker({
  tabs,
  templateTypes,
  selectedTab: passedSelectedTab,
  onSelectTab,
  shouldShowMyDesigns = true,
  ...props
}: Props) {
  const [selectedTab, setSelectedTab] = useControllableState(
    passedSelectedTab,
    onSelectTab,
    shouldShowMyDesigns ? 'MyDesigns' : tabs ? tabs[0] : templateTypes[0]
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
          {shouldShowMyDesigns && <Tab value="MyDesigns" label="My Designs" />}

          {tabs
            ? tabs.map(templateType => (
                <Tab
                  key={templateType}
                  value={templateType}
                  label={getTemplateTypeLabel(templateType)}
                />
              ))
            : templateTypes.map(templateType => (
                <Tab
                  disabled
                  key={templateType}
                  label={
                    <Skeleton
                      variant="text"
                      animation="wave"
                      height={35}
                      width={90}
                    />
                  }
                />
              ))}
        </Tabs>
      </Grid>
      <Grid container item>
        {shouldShowMyDesigns && selectedTab === 'MyDesigns' && (
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
