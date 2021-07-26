import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

import ShowingYesNoRadioGroup from '../ShowingYesNoRadioGroup'

interface ShowingDetailTabSettingsTabFeedbackProps {
  children: ReactNode
}

function ShowingDetailTabSettingsTabFeedback({
  children
}: ShowingDetailTabSettingsTabFeedbackProps) {
  return (
    <Box maxWidth={500}>
      <Typography variant="h6" gutterBottom>
        Do you want to get feedback on this showing?
      </Typography>
      <ShowingYesNoRadioGroup
        name="has-feedback"
        // TODO: read this from showing and apply the change
        defaultValue="Yes"
        onChange={() => {}}
      />
      {children}
    </Box>
  )
}

export default ShowingDetailTabSettingsTabFeedback
