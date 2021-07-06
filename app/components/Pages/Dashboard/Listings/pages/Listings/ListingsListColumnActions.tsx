import { makeStyles } from '@material-ui/core'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import ListingsListColumnActionsDealButton from './ListingsListColumnActionsDealButton'
import ListingsListColumnActionsMarketListingButton from './ListingsListColumnActionsMarketListingButton'
import ListingsListColumnActionsMoreButton, {
  ListingsListColumnActionsMoreButtonProps
} from './ListingsListColumnActionsMoreButton'

const useStyles = makeStyles(
  theme => ({
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ListingsListColumnActions' }
)

const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }

export interface ListingsListColumnActionsProps
  extends Pick<ListingsListColumnActionsMoreButtonProps, 'row'> {
  className: string
  hasActions: boolean
}

function ListingsListColumnActions({
  className,
  row,
  hasActions
}: ListingsListColumnActionsProps) {
  const classes = useStyles()
  const hasDealsAccess = useAcl(dealsAccess)

  return (
    <div className={className}>
      {hasActions && hasDealsAccess && (
        <ListingsListColumnActionsDealButton
          variant="contained"
          size="small"
          color="secondary"
          listingId={row.id}
        />
      )}
      <ListingsListColumnActionsMarketListingButton
        className={classes.button}
        variant="outlined"
        size="small"
        listingId={row.id}
      />
      <ListingsListColumnActionsMoreButton
        className={classes.button}
        variant="outlined"
        size="small"
        row={row}
      />
    </div>
  )
}

export default ListingsListColumnActions
