import { Button, makeStyles } from '@material-ui/core'

import ListingsListColumnActionsDealButton from './ListingsListColumnActionsDealButton'
import ListingsListColumnActionsOpenHouseButton, {
  ListingsListColumnActionsOpenHouseButtonProps
} from './ListingsListColumnActionsOpenHouseButton'
import ListingsListColumnActionsViewListingButton from './ListingsListColumnActionsViewListingButton'

const useStyles = makeStyles(
  theme => ({
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ListingsListColumnActions' }
)

export interface ListingsListColumnActionsProps
  extends Pick<ListingsListColumnActionsOpenHouseButtonProps, 'row'> {
  className: string
  hasActions: boolean
}

function ListingsListColumnActions({
  className,
  row,
  hasActions
}: ListingsListColumnActionsProps) {
  const classes = useStyles()

  return (
    <div className={className}>
      <ListingsListColumnActionsOpenHouseButton
        className={classes.button}
        variant="outlined"
        size="small"
        row={row}
      />
      <ListingsListColumnActionsViewListingButton
        className={classes.button}
        variant="outlined"
        size="small"
        listingId={row.id}
      />
      <Button
        className={classes.button}
        variant="outlined"
        size="small"
        onClick={() => alert('The action is not implemented')}
      >
        {/* TODO: Connect this to Mamal's page */}
        Market Listing
      </Button>
      {hasActions && (
        <ListingsListColumnActionsDealButton
          className={classes.button}
          variant="contained"
          size="small"
          color="secondary"
          listingId={row.id}
          target="_blank"
        />
      )}
    </div>
  )
}

export default ListingsListColumnActions
