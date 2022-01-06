import { Box, Step, StepLabel, Stepper, Typography } from '@material-ui/core'

import { useImportCsv } from '../../hooks/use-import-csv'

interface Props {
  isUploadingContacts: boolean
}

export function UploadSteps({ isUploadingContacts }: Props) {
  const { file } = useImportCsv()

  const getActiveStep = () => {
    if (!file) {
      return 0
    }

    if (!isUploadingContacts) {
      return 1
    }

    return 2
  }

  const step = getActiveStep()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mb={5}
    >
      <Box my={2} textAlign="center">
        <Typography variant="h5">{step + 1} of 3</Typography>
      </Box>

      <Box width="60%">
        <Stepper activeStep={step} alternativeLabel>
          {[
            'Select a CSV File',
            'Map Columns Label From CSV to Rechat Property',
            'Upload Contacts'
          ].map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  )
}
