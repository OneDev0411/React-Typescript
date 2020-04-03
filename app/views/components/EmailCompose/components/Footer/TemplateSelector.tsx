import React, { useState } from 'react'
import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

import EmailTemplateSelector from './EmailTemplateSelector'
import { MarketingTemplateSelector } from './MarketingTemplateSelector'

interface Props {
  onEmailTemplateSelected: (template: IBrandEmailTemplate) => void
  onMarketingTemplateSelected: (template: IMarketingTemplateInstance) => void
}

const styles = (theme: Theme) =>
  createStyles({
    tabsContainer: {
      padding: theme.spacing(0, 1),
      backgroundColor: theme.palette.grey['50']
    },
    tabsRoot: {
      minHeight: 'auto',
      position: 'sticky',
      top: 0
    },
    tabRoot: {
      minHeight: 'auto',
      minWidth: 'auto',
      padding: theme.spacing(1, 0),
      margin: theme.spacing(0, 1)
    }
  })
const useStyles = makeStyles(styles, { name: 'TemplateSelector' })

export function TemplateSelector(props: Props & ClassesProps<typeof styles>) {
  const [templateTabIndex, setTemplateTabIndex] = useState(0)

  const classes = useStyles(props)

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tabs
          className={classes.tabsRoot}
          value={templateTabIndex}
          onChange={(_, newTabIndex) => setTemplateTabIndex(newTabIndex)}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab className={classes.tabRoot} label="Email Templates" />
          <Tab className={classes.tabRoot} label="All Designs" />
        </Tabs>
      </div>
      {templateTabIndex === 0 && (
        <EmailTemplateSelector
          onTemplateSelected={props.onEmailTemplateSelected}
        />
      )}
      {templateTabIndex === 1 && (
        <MarketingTemplateSelector
          onTemplateSelected={props.onMarketingTemplateSelected}
        />
      )}
    </>
  )
}
