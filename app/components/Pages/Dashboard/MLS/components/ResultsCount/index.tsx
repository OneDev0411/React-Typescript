import { makeStyles, Typography, Grid } from '@material-ui/core'
import cn from 'classnames'

import { getResultsCountText } from '../../helpers/pagination-utils'

const useStyles = makeStyles(
  theme => ({
    resultsCountContainer: {
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
      color: theme.palette.text.secondary
    }
  }),
  { name: 'ResultsCount' }
)

interface Props {
  className?: string
  resultsCounts: number
  currentPage: number
  pageSize: number
}

export function ResultsCount({
  resultsCounts,
  currentPage,
  pageSize,
  className
}: Props) {
  const classes = useStyles()

  return (
    <Grid container className={cn(classes.resultsCountContainer, className)}>
      <Typography variant="body2">
        {getResultsCountText(resultsCounts, currentPage, pageSize)}
      </Typography>
    </Grid>
  )
}
