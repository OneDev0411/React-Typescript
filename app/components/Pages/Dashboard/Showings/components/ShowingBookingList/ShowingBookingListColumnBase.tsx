import { ReactNode } from 'react'

import { Typography } from '@material-ui/core'

interface ShowingBookingListColumnBaseProps {
  children: ReactNode
}

function ShowingBookingListColumnBase({
  children
}: ShowingBookingListColumnBaseProps) {
  return (
    <Typography variant="body2" component="div">
      {children}
    </Typography>
  )
}

export default ShowingBookingListColumnBase
