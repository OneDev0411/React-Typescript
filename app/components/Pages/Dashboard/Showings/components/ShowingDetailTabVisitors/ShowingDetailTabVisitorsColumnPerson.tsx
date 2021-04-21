import { Box, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

interface ShowingDetailTabVisitorsColumnPersonProps {
  contact: IContact
}

function ShowingDetailTabVisitorsColumnPerson({
  contact
}: ShowingDetailTabVisitorsColumnPersonProps) {
  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>
        <Avatar contact={contact} />
      </Box>
      <Typography variant="body2">
        {contact.display_name}
        {/* {brand && (
          <>
            ,{' '}
            <Box component="span" color="grey.500">
              {TODO: add brand here}
            </Box>
          </>
        )} */}
      </Typography>
    </Box>
  )
}

export default ShowingDetailTabVisitorsColumnPerson
