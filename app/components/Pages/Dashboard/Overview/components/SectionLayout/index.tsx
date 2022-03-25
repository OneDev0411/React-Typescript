import { ReactNode } from 'react'

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
      marginBottom: theme.spacing(3)
    },
    headerContainer: {
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
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
  containerGridProps?: Omit<
    GridProps,
    'container' | 'item' | 'direction' | 'className'
  >
  headerGridProps?: Omit<
    GridProps,
    'container' | 'item' | 'alignItems' | 'direction' | 'className'
  >
}

export default function SectionLayout({
  actionNode,
  children,
  containerGridProps,
  headerGridProps,
  title
}: Props) {
  const classes = useStyles()

  return (
    <Grid
      container
      item
      direction="column"
      className={classes.container}
      {...containerGridProps}
    >
      <Grid
        container
        item
        alignItems="center"
        direction="row"
        className={classes.headerContainer}
        {...headerGridProps}
      >
        <Grid item className={classes.titleContainer}>
          <Box pr={1}>
            <Typography variant="h6">{title}</Typography>
          </Box>
        </Grid>
        {actionNode && <Grid item>{actionNode}</Grid>}
      </Grid>
      <Grid container item spacing={2} direction="row">
        {children}
      </Grid>
    </Grid>
  )
}
