import { ReactNode } from 'react'

import { Typography } from '@material-ui/core'

import ShowingInstructionsTextField, {
  ShowingInstructionsTextFieldProps
} from '../ShowingInstructionsTextField'

interface ShowingDetailTabSettingsTabInstructionsProps
  extends ShowingInstructionsTextFieldProps {
  children: ReactNode
}

function ShowingDetailTabSettingsTabInstructions({
  children,
  ...otherProps
}: ShowingDetailTabSettingsTabInstructionsProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Are there any access information you’d like to provide?
      </Typography>
      <ShowingInstructionsTextField {...otherProps} />
      {children}
    </>
  )
}

export default ShowingDetailTabSettingsTabInstructions
