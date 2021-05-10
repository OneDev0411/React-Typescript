import { Box, Button } from '@material-ui/core'

export interface ShowingStepPropertyChangeButtonProps {
  onClick: () => void
  label?: string
}

function ShowingStepPropertyChangeButton({
  onClick,
  label = 'Change Property'
}: ShowingStepPropertyChangeButtonProps) {
  return (
    <Box mt={2} display="flex" justifyContent="flex-end">
      <Button variant="outlined" size="small" onClick={onClick}>
        {label}
      </Button>
    </Box>
  )
}

export default ShowingStepPropertyChangeButton
