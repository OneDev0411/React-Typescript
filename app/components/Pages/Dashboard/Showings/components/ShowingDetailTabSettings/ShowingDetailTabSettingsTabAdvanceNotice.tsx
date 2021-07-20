import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

import ShowingAdvanceNoticeRadioGroup, {
  ShowingAdvanceNoticeRadioGroupProps
} from '../ShowingAdvanceNoticeRadioGroup'

interface ShowingDetailTabSettingsTabAdvanceNoticeProps
  extends ShowingAdvanceNoticeRadioGroupProps {
  children: ReactNode
}

function ShowingDetailTabSettingsTabAdvanceNotice({
  children,
  ...otherProps
}: ShowingDetailTabSettingsTabAdvanceNoticeProps) {
  return (
    <Box maxWidth={580}>
      <Typography variant="h6" gutterBottom>
        Is there a need for advance notice?
      </Typography>
      <ShowingAdvanceNoticeRadioGroup {...otherProps} />
      {children}
    </Box>
  )
}

export default ShowingDetailTabSettingsTabAdvanceNotice
