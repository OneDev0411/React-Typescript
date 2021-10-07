import { makeStyles } from '@material-ui/core'

interface Props {
  resultsCount: number
  currentPage: number
  pageSize: number
  total?: number
}

const useStyles = makeStyles(
  theme => ({
    bold: {
      margin: theme.spacing(0, 0.5),
      fontWeight: theme.typography.fontWeightBold
    }
  }),
  { name: 'ListingsResultsCount' }
)

export const ResultCount = ({
  resultsCount,
  currentPage,
  pageSize,
  total
}: Props) => {
  const classes = useStyles()

  const start = (currentPage - 1) * pageSize + 1
  const end = start + pageSize - 1

  if (resultsCount === 1) {
    return (
      <>
        <span>Showing </span>
        <b className={classes.bold}>1</b>
        <span> of </span>
        <b className={classes.bold}>1</b> listing
      </>
    )
  }

  return (
    <>
      <span>Showing </span>
      <b className={classes.bold}>{start}</b>
      {' - '}
      <b className={classes.bold}>{Math.min(end, resultsCount)}</b>
      <span> of </span>
      <b className={classes.bold}>{total || resultsCount}</b>
      <span> listings</span>
    </>
  )
}
