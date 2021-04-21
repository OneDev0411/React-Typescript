import { Typography } from '@material-ui/core'

interface ShowingPropertyListColumnCountProps {
  value: number
}

function ShowingPropertyListColumnCount({
  value
}: ShowingPropertyListColumnCountProps) {
  return (
    <Typography noWrap variant="body2">
      {value}
    </Typography>
  )
}

export default ShowingPropertyListColumnCount
