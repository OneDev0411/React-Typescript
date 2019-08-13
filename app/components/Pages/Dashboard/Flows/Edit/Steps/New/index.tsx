import React, { useState } from 'react'
import { Grid, Box, Card, CardContent } from '@material-ui/core'

import EventForm from './EventForm'
import { StepIndex } from '../styled'
import ScheduledEmailForm from './ScheduledEmailForm'
import AddButton from './AddButton'

interface Props {
  index: number
  startFrom: number
  emailTemplates: IBrandEmailTemplate[]
  isNewEventFormOpen?: boolean
  onSubmit: (data: IBrandFlowStepInput) => Promise<any>
}

export default function New({
  isNewEventFormOpen: passedIsNewEventFormOpen,
  index,
  startFrom,
  emailTemplates,
  onSubmit
}: Props) {
  const [isNewEventFormOpen, setIsNewEventFormOpen] = useState(
    passedIsNewEventFormOpen || false
  )
  const [
    isNewScheduledEmailFormOpen,
    setIsNewScheduledEmailFormOpen
  ] = useState(false)

  async function submitHandler(data: IBrandFlowStepInput) {
    const step: IBrandFlowStepInput = {
      ...data,
      due_in: data.due_in
    }

    await onSubmit(step)
    setIsNewEventFormOpen(false)
  }

  function cancelHandler() {
    setIsNewEventFormOpen(false)
    setIsNewScheduledEmailFormOpen(false)
  }

  function renderNewEventForm() {
    return (
      <Grid item xs={12} style={{ position: 'relative' }}>
        <StepIndex>{index}</StepIndex>
        <Box m={2}>
          <Card>
            <CardContent>
              <Grid container item alignItems="center" xs={12}>
                <EventForm
                  startFrom={startFrom}
                  onCancel={cancelHandler}
                  onSubmit={submitHandler}
                />
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    )
  }

  function renderNewScheduledEmailForm() {
    return (
      <Grid item xs={12} style={{ position: 'relative' }}>
        <StepIndex>{index}</StepIndex>
        <Box m={2}>
          <Card>
            <CardContent>
              <Grid container item alignItems="center" xs={12}>
                <ScheduledEmailForm
                  startFrom={startFrom}
                  templates={emailTemplates}
                  onCancel={cancelHandler}
                  onSubmit={submitHandler}
                />
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    )
  }

  function renderAddNewStep() {
    return (
      <Grid item xs={12}>
        <Box m={2}>
          <AddButton
            onNewEventClick={() => {
              setIsNewScheduledEmailFormOpen(false)
              setIsNewEventFormOpen(true)
            }}
            onNewScheduledEmailClick={() => {
              setIsNewEventFormOpen(false)
              setIsNewScheduledEmailFormOpen(true)
            }}
          />
        </Box>
      </Grid>
    )
  }

  return (
    <>
      {isNewEventFormOpen && renderNewEventForm()}
      {isNewScheduledEmailFormOpen && renderNewScheduledEmailForm()}
      {renderAddNewStep()}
    </>
  )
}
