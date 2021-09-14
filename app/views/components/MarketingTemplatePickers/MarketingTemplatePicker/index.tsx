import { Grid, Tabs, Tab } from '@material-ui/core'
import useControllableState from 'react-use-controllable-state'

import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { MarketingTemplatePickerProps } from '@app/views/components/MarketingTemplatePickers/types'

import TemplatesList from './TemplatesList'

export default function MarketingTemplatePicker({
  templateTypes,
  selectedTab: passedSelectedTab,
  onSelectTab,
  ...templatesListProps
}: MarketingTemplatePickerProps) {
  const [selectedTab, setSelectedTab] = useControllableState(
    passedSelectedTab,
    onSelectTab,
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
