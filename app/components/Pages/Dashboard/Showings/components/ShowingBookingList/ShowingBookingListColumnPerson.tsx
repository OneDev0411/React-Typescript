import { Box } from '@material-ui/core'

import ShowingBookingListColumnBase from './ShowingBookingListColumnBase'

interface ShowingBookingListColumnPersonProps {
  name: string
  company: Nullable<string>
}

function ShowingBookingListColumnPerson({
  name,
  company
}: ShowingBookingListColumnPersonProps) {
  return (
    <ShowingBookingListColumnBase>
      {name}
      {company && ', '}
      {company && (
        <Box color="grey.500" component="span">
          {company}
        </Box>
      )}
    </ShowingBookingListColumnBase>
  )
}

export default ShowingBookingListColumnPerson
