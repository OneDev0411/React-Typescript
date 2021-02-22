import React, { ReactNode } from 'react'
import {
  Box,
  Typography,
  Grid,
  Button,
  Tooltip,
  IconButton
} from '@material-ui/core'

import { mdiDrag } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { WaitFor } from '../BaseFields/WaitFor'
import { EventType } from '../BaseFields/EventType'
import { Time } from '../BaseFields/Time'
import { useStyles } from './styles'

interface Props {
  index: number
  title?: string
  step?: IBrandFlowStep
  submitting: boolean
  children: ReactNode
  handleSubmit: () => void
}

export const BaseFormLayout = ({
  index,
  title = 'Step',
  children,
  submitting,
  handleSubmit
}: Props) => {
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit} className={classes.form} noValidate>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Grid container alignItems="center" justify="space-between">
            <Grid container alignItems="center" xs={6}>
              <Box className={classes.dragBtn}>
                <Tooltip
                  title="Drag step to reorder"
                  aria-label="drag to reorder step"
                  // hidden={disableEdit}
                >
                  <SvgIcon path={mdiDrag} />
                </Tooltip>
              </Box>
              <Typography variant="body1" className={classes.title}>
                {index}. {title}
              </Typography>
            </Grid>
            <Grid container xs={6} justify="flex-end">
              <Button
                variant="contained"
                color="secondary"
                disabled={submitting}
                type="submit"
                size="small"
              >
                {submitting ? 'Saving' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.commonFieldsContainer}>
          <Typography variant="subtitle2" className={classes.commonFieldsTitle}>
            When is this reminder for?
          </Typography>
          <Box className={classes.commonFields}>
            <Box width={240}>
              <WaitFor />
            </Box>
            <Box flexGrow={1} px={0.75}>
              <EventType />
            </Box>
            <Box>
              <Time />
            </Box>
          </Box>
        </Box>
        {children}
      </Box>
    </form>
  )
}
