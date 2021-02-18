import React, { ReactNode } from 'react'
import {
  Grid,
  Typography,
  GridProps,
  Theme,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(4)
    },
    headerContainer: {
      paddingBottom: theme.spacing(2)
    },
    titleContainer: {
      paddingRight: theme.spacing(2)
    }
  }),
  {
    name: 'MarketingOverviewSectionLayout'
  }
)

interface Props {
  title: string
  actionNode: ReactNode
  children: ReactNode
  gridProps?: GridProps
}

export default function SectionLayout({
  title,
  actionNode,
  children,
  gridProps = {}
}: Props) {
  const classes = useStyles()

  return (
    <Grid
      container
      item
      direction="column"
      className={classes.container}
      {...gridProps}
    >
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        className={classes.headerContainer}
      >
        <Grid item className={classes.titleContainer}>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>{actionNode}</Grid>
      </Grid>
      <Grid container item spacing={1} direction="row">
        {children}
      </Grid>
    </Grid>
  )
}
