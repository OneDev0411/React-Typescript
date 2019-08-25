import React from 'react'
import { Box, Typography, makeStyles } from '@material-ui/core'

import Icon from '../../../../components/Pages/Dashboard/Flows/Edit/Steps/Item/Icon'

import { StepContainer } from './styled'

const useStyles = makeStyles({
  title: {
    width: 'calc(100% - 1rem)'
  }
})

interface Props {
  step: IBrandFlowStep
}

export default function Step({ step }: Props) {
  const classes = useStyles()

  return (
    <StepContainer alignCenter justifyBetween>
      <Box display="flex" alignItems="center" width="70%">
        <Icon
          hasBackground={false}
          containerStyle={{ width: 'auto', height: 'auto', margin: 0 }}
          type={step.event ? step.event.task_type : 'Email'}
        />
        <Typography
          noWrap
          variant="body2"
          title={step.title}
          className={classes.title}
        >
          {step.title}
        </Typography>
      </Box>
      <div>
        {step.wait_days === 0 && 'The same day'}
        {step.wait_days > 0 && `Wait for ${step.wait_days} `}
        {step.wait_days === 1 && 'day'}
        {step.wait_days > 1 && 'days'}
      </div>
    </StepContainer>
  )
}
