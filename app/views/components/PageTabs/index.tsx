import React, { useState } from 'react'
import { Tabs, createStyles, makeStyles, Theme } from '@material-ui/core'
import { TabProps } from '@material-ui/core/Tab'

export * from './Tab'
export * from './DropdownTab'

type SelectedTab = string | number | null

interface Props {
  tabs: React.ComponentType<TabProps>[]
  defaultValue?: SelectedTab
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabContainer: {
      margin: theme.spacing(1, 0),
      borderBottom: '2px solid #F4F5F9'
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      '& > div': {
        maxWidth: 30,
        width: '100%',
        backgroundColor: theme.palette.primary.main
      }
    }
  })
)

/**
 *  @example
 * <PageTabs
    tabs={[
      <Tab key={0} label="All" value={0} />,
      <Tab key={1} label="Drafts" value={1} />,
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
export function PageTabs({ defaultValue = null, tabs }: Props) {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(defaultValue)

  const handleChange = (e: React.MouseEvent<{}>, value: SelectedTab) => {
    setSelectedTab(value)
  }

  return (
    <Tabs
      value={selectedTab}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      onChange={handleChange}
      classes={{
        root: classes.tabContainer,
        indicator: classes.indicator
      }}
      TabIndicatorProps={{ children: <div /> }}
    >
      {tabs.map(tab => tab)}
    </Tabs>
  )
}
