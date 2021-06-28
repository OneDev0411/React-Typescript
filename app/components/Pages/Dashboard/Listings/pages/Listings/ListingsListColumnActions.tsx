import { Button, makeStyles } from '@material-ui/core'

import { ListingRow } from '../../types'

const useStyles = makeStyles(
  theme => ({
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ListingsListColumnActions' }
)

interface ListingsListColumnActionsProps {
  className: string
  row: ListingRow
}

function ListingsListColumnActions({
  className,
  row
}: ListingsListColumnActionsProps) {
  const classes = useStyles()

  return (
    <div className={className}>
      <Button className={classes.button} variant="outlined" size="small">
        OH Registrants Page
      </Button>
      <Button className={classes.button} variant="outlined" size="small">
        View Listing
      </Button>
      <Button className={classes.button} variant="outlined" size="small">
        Market Listing
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        size="small"
        color="secondary"
      >
        {/* TODO: Create deal or view deal according to the logic */}
        Create Deal
      </Button>
    </div>
  )
}

export default ListingsListColumnActions
