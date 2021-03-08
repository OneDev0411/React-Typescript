import React, { ReactNode } from 'react'
import {
  Grid,
  Box,
  Typography,
  GridProps,
  Theme,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(8)
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
  children: ReactNode
  actionNode?: ReactNode
  gridProps?: GridProps
}

export default function SectionLayout({
  title,
  children,
  actionNode,
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
          <Box pr={1}>
            <Typography variant="h5">{title}</Typography>
          </Box>
        </Grid>
        {actionNode && <Grid item>{actionNode}</Grid>}
      </Grid>
      <Grid container item spacing={1} direction="row">
        {children}
      </Grid>
    </Grid>
  )
}
