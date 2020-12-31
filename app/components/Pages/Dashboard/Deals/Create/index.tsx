import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { QuestionWizard } from 'components/QuestionWizard'

import { DealType } from './form/DealType'
import { DealSide } from './form/DealSide'
import { DealPropertyType } from './form/DealPropertyType'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '80%',
      height: '100vh',
      paddingTop: '10%',
      margin: '0 auto'
    }
  }),
  {
    name: 'CreateDeal'
  }
)

export default function CreateDeal() {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <QuestionWizard defaultStep={0}>
        <DealType />
        <DealSide />
        <DealPropertyType />
      </QuestionWizard>
    </Box>
  )
}
