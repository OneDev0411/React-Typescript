import { ReactNode } from 'react'
import { Typography } from '@material-ui/core'

interface ShowingDetailTabBookingsListColumnBaseProps {
  children: ReactNode
}

function ShowingDetailTabBookingsListColumnBase({
  children
}: ShowingDetailTabBookingsListColumnBaseProps) {
  return <Typography variant="body2">{children}</Typography>
}

export default ShowingDetailTabBookingsListColumnBase
