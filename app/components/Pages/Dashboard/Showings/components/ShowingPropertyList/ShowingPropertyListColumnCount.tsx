import { Typography } from '@material-ui/core'

interface ShowingPropertyListColumnCountProps {
  label: string
  value: number
}

function ShowingPropertyListColumnCount({
  label,
  value
}: ShowingPropertyListColumnCountProps) {
  return (
    <Typography noWrap variant="body2">
      {label}: {value}
    </Typography>
  )
}

export default ShowingPropertyListColumnCount
