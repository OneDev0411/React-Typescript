import { Button, makeStyles } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { selectActiveTeamId } from '@app/selectors/team'
import LinkButton from '@app/views/components/LinkButton'

import { ListingRow } from './types'
import ListingsListColumnActionsDealButton from './ListingsListColumnActionsDealButton'

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
  const teamId = useSelector(selectActiveTeamId)

  return (
    <div className={className}>
      <LinkButton
        className={classes.button}
        variant="outlined"
        size="small"
        to={`/openhouse/${row.id}/${teamId}/register`}
        target="_blank"
      >
        {/* TODO: Ask this from Ramin or Emil */}
        OH Registrants Page
      </LinkButton>
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
