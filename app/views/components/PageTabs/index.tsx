import React, { useState } from 'react'
import { Tabs, createStyles, makeStyles, Theme } from '@material-ui/core'

export * from './Tab'
export * from './TabLink'
export * from './DropdownTab'
export * from './TabSpacer'

type SelectedTab = string | number | null

interface Props {
  tabs: React.ReactNode[]
  actions?: React.ReactNode[]
  defaultValue?: SelectedTab
  value?: SelectedTab
  onChange?: (value: SelectedTab) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%'
    },
    tabContainer: {
      width: '100%',
      margin: theme.spacing(1, 0),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      '& > div': {
        maxWidth: 30,
        width: '100%',
        borderRadius: theme.spacing(
          theme.shape.borderRadius,
          theme.shape.borderRadius,
          0,
          0
        ),
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
  value,
  onChange = () => {},
  actions,
  tabs
}: Props) {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(defaultValue)
  const activeTab =
    defaultValue && selectedTab !== defaultValue ? defaultValue : selectedTab

  const handleChange = (e: React.MouseEvent<{}>, tab: SelectedTab) => {
    setSelectedTab(tab)

    onChange(tab)
  }

  return (
    <div className={classes.container}>
      <Tabs
        value={value || activeTab}
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

      {actions && (
        <div>
          <Tabs
            value={false}
            classes={{
              root: classes.tabContainer
            }}
          >
            {actions.map(tab => tab)}
          </Tabs>
        </div>
      )}
    </div>
  )
}
