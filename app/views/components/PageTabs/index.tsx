import React, { useState, ReactNode } from 'react'
import { Tabs, makeStyles, Theme } from '@material-ui/core'

export * from './Tab'
export * from './TabLink'
export * from './DropdownTab'
export * from './TabSpacer'

type SelectedTab = string | number | boolean | null
type RenderMegaMenu = {
  selectedTab: SelectedTab
  close: () => void
}
interface Props {
  tabs: ReactNode[]
  actions?: ReactNode[]
  defaultValue?: SelectedTab
  defaultAction?: SelectedTab
  value?: SelectedTab
  actionValue?: SelectedTab
  onChange?: (value: SelectedTab) => void
  onChangeAction?: (value: SelectedTab) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      display: 'flex',
      width: '100%'
    },
    tabContainer: {
      width: '100%',
      marginTop: theme.spacing(1),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    tabsFlexContainer: {
      /* 
       shayan asked a 32px `marginRight` between each tab and since 
       there could be several node types with the different class name
       in tab container we use a general direct css selector
      */
      '& > *': {
        marginRight: theme.spacing(4)
      },
      '& .MuiTab-root': {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    actionsFlexContainer: {
      '& .MuiTab-root': {
        paddingRight: 0
      }
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      marginLeft: theme.spacing(-0.75 / 2),
      '& > div': {
        width: '100%',
        /* 
         as Shayan asked, @ramin add a negative `maerginLeft` in indicator container
         to be edge to edge,which cause an overflow for indicator ribbon
         and we need to neutralize that effect by adding this
        */
        marginLeft: theme.spacing(0.75 / 2),
        backgroundColor: theme.palette.primary.main
      }
    },
    scroller: {
      position: 'inherit'
    }
  }),
  {
    name: 'PageTabs'
  }
)

/**
 *  @example
 * <PageTabs
    tabs={[
      <Tab key={0} label="All" value={0} />,
      <TabLink key={1} label="Drafts" value={1} to="link" />,
      <Tab
        key={2}
        value={2}
        label={
          <DropdownTab title="Menu">
            {({ toggleMenu }) => (
              <>
                <MenuItem key={0} onClick={toggleMenu}>
                  Menu 1
                </MenuItem>
                <MenuItem key={1} onClick={toggleMenu}>
                  Menu 2
                </MenuItem>
                <MenuItem key={2} onClick={toggleMenu}>
                  Menu 3
                </MenuItem>
              </>
            )}
          </DropdownTab>
        }
      />
    ]}
  />
 */
export function PageTabs({
  defaultValue = null,
  defaultAction = null,
  value,
  actions,
  actionValue,
  tabs,
  onChange = () => {},
  onChangeAction = () => {}
}: Props) {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(defaultValue)
  const [selectedAction, setSelectedAction] = useState<SelectedTab>(
    defaultAction
  )

  const activeTab =
    defaultValue && selectedTab !== defaultValue ? defaultValue : selectedTab
  const activeAction =
    defaultAction && selectedAction !== defaultAction
      ? defaultAction
      : selectedAction

  const handleChangeTab = (tab: SelectedTab) => {
    setSelectedTab(tab)

    onChange(tab)
  }
  const handleChangeAction = (action: SelectedTab) => {
    setSelectedAction(action)

    onChangeAction(action)
  }

  return (
    <div className={classes.container}>
      <Tabs
        value={value || activeTab || false}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        onChange={(e, v) => handleChangeTab(v)}
        classes={{
          root: classes.tabContainer,
          scroller: classes.scroller,
          indicator: classes.indicator,
          flexContainer: classes.tabsFlexContainer
        }}
        TabIndicatorProps={{ children: <div /> }}
      >
        {tabs.map(tab => tab)}
      </Tabs>

      {actions && (
        <div>
          <Tabs
            value={actionValue || activeAction || false}
            onChange={(e, v) => handleChangeAction(v)}
            variant="scrollable"
            scrollButtons="auto"
            classes={{
              root: classes.tabContainer,
              indicator: classes.indicator,
              flexContainer: classes.actionsFlexContainer
            }}
            TabIndicatorProps={{ children: <div /> }}
          >
            {actions.map(tab => tab)}
          </Tabs>
        </div>
      )}
    </div>
  )
}
