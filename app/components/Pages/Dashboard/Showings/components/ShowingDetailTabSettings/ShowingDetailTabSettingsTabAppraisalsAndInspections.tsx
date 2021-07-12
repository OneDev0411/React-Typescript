import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

import ShowingYesNoRadioGroup, {
  ShowingYesNoRadioGroupProps
} from '../ShowingYesNoRadioGroup'

interface ShowingDetailTabSettingsTabAppraisalsAndInspectionsProps {
  allowAppraisalDefaultValue: ShowingYesNoRadioGroupProps['defaultValue']
  onAllowAppraisalChange: ShowingYesNoRadioGroupProps['onChange']
  allowInspectionDefaultValue: ShowingYesNoRadioGroupProps['defaultValue']
  onAllowInspectionChange: ShowingYesNoRadioGroupProps['onChange']
  children: ReactNode
}

function ShowingDetailTabSettingsTabAppraisalsAndInspections({
  allowAppraisalDefaultValue,
  onAllowAppraisalChange,
  allowInspectionDefaultValue,
  onAllowInspectionChange,
  children
}: ShowingDetailTabSettingsTabAppraisalsAndInspectionsProps) {
  return (
    <Box maxWidth={500}>
      <Box mb={9}>
        <Typography variant="h6" gutterBottom>
          Would you like to allow appraisals?
        </Typography>
        <ShowingYesNoRadioGroup
          name="allow-appraisals"
          defaultValue={allowAppraisalDefaultValue}
          onChange={onAllowAppraisalChange}
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        Do you want to allow inspections and walk-through?
      </Typography>
      <ShowingYesNoRadioGroup
        name="allow-inspection"
        defaultValue={allowInspectionDefaultValue}
        onChange={onAllowInspectionChange}
      />
      {children}
    </Box>
  )
}

export default ShowingDetailTabSettingsTabAppraisalsAndInspections
