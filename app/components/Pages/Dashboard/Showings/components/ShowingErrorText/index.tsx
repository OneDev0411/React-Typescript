import { ReactNode } from 'react'
import { FormHelperText, Typography } from '@material-ui/core'

interface ShowingErrorTextProps {
  children: ReactNode
}

function ShowingErrorText({ children }: ShowingErrorTextProps) {
  return (
    <FormHelperText error>
      <Typography variant="body1" component="span">
        {children}
      </Typography>
    </FormHelperText>
  )
}

export default ShowingErrorText
