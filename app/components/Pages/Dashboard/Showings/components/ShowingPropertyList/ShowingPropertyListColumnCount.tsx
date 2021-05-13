import { Box, Typography } from '@material-ui/core'

interface ShowingPropertyListColumnCountProps {
  label: string
  value: number
}

function ShowingPropertyListColumnCount({
  label,
  value
}: ShowingPropertyListColumnCountProps) {
  return (
    <>
      <Typography noWrap variant="caption" component="span">
        <Box color="grey.600" component="span">
          {label}{' '}
        </Box>
      </Typography>
      <Typography variant="body2" component="span">
        {value}
      </Typography>
    </>
  )
}

export default ShowingPropertyListColumnCount
