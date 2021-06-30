import { Button, makeStyles } from '@material-ui/core'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import ListingsListColumnActionsDealButton from './ListingsListColumnActionsDealButton'
import ListingsListColumnActionsOpenHouseButton, {
  ListingsListColumnActionsOpenHouseButtonProps
} from './ListingsListColumnActionsOpenHouseButton'
import ListingsListColumnActionsViewListingButton from './ListingsListColumnActionsViewListingButton'
import useListingsOpenHouseHasAccess from './use-listings-open-house-has-access'

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

const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }

function ListingsListColumnActions({
  className,
  row,
  hasActions
}: ListingsListColumnActionsProps) {
  const classes = useStyles()
  const hasOpenHouseAccess = useListingsOpenHouseHasAccess()
  const hasDealsAccess = useAcl(dealsAccess)

  return (
    <div className={className}>
      {hasOpenHouseAccess && (
        <ListingsListColumnActionsOpenHouseButton
          className={classes.button}
          variant="outlined"
          size="small"
          row={row}
        />
      )}
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
      {hasDealsAccess && hasActions && (
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
