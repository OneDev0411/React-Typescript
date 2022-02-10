import { ReactNode } from 'react'

import {
  Grid,
  Box,
  Typography,
  GridProps,
  Theme,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'

import iff from '@app/utils/iff'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(8)
    },
    containerGray: {
      '&&': { padding: theme.spacing(3) }, // TODO: Find a better way to override the padding value
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius
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
  containerGridProps?: Omit<
    GridProps,
    'container' | 'item' | 'direction' | 'className'
  >
  headerGridProps?: Omit<
    GridProps,
    'container' | 'item' | 'alignItems' | 'direction' | 'className'
  >
  grayMode?: boolean
}

export default function SectionLayout({
  title,
  children,
  actionNode,
  containerGridProps,
  headerGridProps,
  grayMode = false
}: Props) {
  const classes = useStyles()

  return (
    <Grid
      container
      item
      direction="column"
      className={classNames(
        classes.container,
        iff(grayMode, classes.containerGray)
      )}
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
            <Typography variant="h5">{title}</Typography>
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
