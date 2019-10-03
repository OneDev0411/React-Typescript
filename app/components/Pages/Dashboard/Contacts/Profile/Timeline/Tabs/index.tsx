import React, { ChangeEvent } from 'react'
import { Tabs, Tab, createStyles, makeStyles, Theme } from '@material-ui/core'

export enum Filters {
  All = 0,
  Upcoming = 1
}

interface Props {
  activeFilter: Filters
  onChangeFilter(e: ChangeEvent<{}> | null, value: number): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: theme.typography.subtitle1.fontSize
    }
  })
)

export function TabsFilter(props: Props) {
  const classes = useStyles()

  return (
    <Tabs
      value={props.activeFilter}
      onChange={props.onChangeFilter}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab
        value={Filters.All}
        label="All Events"
        classes={{
          root: classes.root
        }}
      />
      <Tab
        value={Filters.Upcoming}
        label="Upcoming Events"
        classes={{
          root: classes.root
        }}
      />
    </Tabs>
  )
}
