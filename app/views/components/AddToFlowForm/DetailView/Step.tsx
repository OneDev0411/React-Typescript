import React from 'react'
import { Box, Typography, makeStyles } from '@material-ui/core'

// TODO: merge all events icon into one specific file
import { EVENT_ICONS } from '../../../../components/Pages/Dashboard/Flows/Edit/Steps/Item/icons'
import { SvgIcon } from '../../SvgIcons/SvgIcon'
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
  const type = step.event ? step.event.task_type : 'Email'
  const icon =
    EVENT_ICONS.find(icon => icon.type === type) ||
    EVENT_ICONS[EVENT_ICONS.length - 1]

  return (
    <StepContainer alignCenter justifyBetween>
      <Box display="flex" alignItems="center" width="70%">
        <SvgIcon path={icon.icon} />
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
