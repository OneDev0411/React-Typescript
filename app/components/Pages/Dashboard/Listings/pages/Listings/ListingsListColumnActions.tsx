import { Button, makeStyles } from '@material-ui/core'

import LinkButton from '@app/views/components/LinkButton'

import ListingsListColumnActionsDealButton from './ListingsListColumnActionsDealButton'
import ListingsListColumnActionsOpenHouseButton, {
  ListingsListColumnActionsOpenHouseButtonProps
} from './ListingsListColumnActionsOpenHouseButton'

const useStyles = makeStyles(
  theme => ({
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ListingsListColumnActions' }
)

interface ListingsListColumnActionsProps
  extends Pick<ListingsListColumnActionsOpenHouseButtonProps, 'row'> {
  className: string
}

function ListingsListColumnActions({
  className,
  row
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
      <LinkButton
        className={classes.button}
        variant="outlined"
        size="small"
        to={`/dashboard/mls/${row.id}`}
        target="_blank"
      >
        View Listing
      </LinkButton>
      <Button className={classes.button} variant="outlined" size="small">
        {/* TODO: Connect this to Mamal's page */}
        Market Listing
      </Button>
      <ListingsListColumnActionsDealButton
        className={classes.button}
        variant="contained"
        size="small"
        color="secondary"
        listingId={row.id}
        target="_blank"
      />
    </div>
  )
}

export default ListingsListColumnActions
