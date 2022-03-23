import { Box, makeStyles, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

import { IContactWithAccess } from './types'

const useStyles = makeStyles(
  () => ({
    defaultCursor: {
      cursor: 'default'
    }
  }),
  { name: 'ShowingDetailTabVisitorsColumnPerson' }
)

interface ShowingDetailTabVisitorsColumnPersonProps {
  contact: IContactWithAccess
}

function ShowingDetailTabVisitorsColumnPerson({
  contact
}: ShowingDetailTabVisitorsColumnPersonProps) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      className={contact?.hasAccessToContact ? '' : classes.defaultCursor}
    >
      <Box mr={1}>
        <Avatar contact={contact} />
      </Box>
      <Typography variant="body2">
        {contact.display_name}
        {contact.company && (
          <>
            ,{' '}
            <Box component="span" color="grey.500">
              {contact.company}
            </Box>
          </>
        )}
      </Typography>
    </Box>
  )
}

export default ShowingDetailTabVisitorsColumnPerson
