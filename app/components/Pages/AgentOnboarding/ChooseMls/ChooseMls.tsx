import React from 'react'
import { useSelector } from 'react-redux'
import { browserHistory, WithRouterProps } from 'react-router'
import { Helmet } from 'react-helmet'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { IAppState } from 'reducers'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import Container from '../Container'
import NextButton from '../NextButton'

import { MlsSelect } from './MlsSelect'

interface FormValues {
  agentId: UUID
}

export function ChooseMls(props: WithRouterProps) {
  const agents = props.location.state.agents
  const mlsId = props.location.query.mlsId
  const brand = useSelector((store: IAppState) => store.brand)

  const onSubmit = (values: FormValues) => {
    const agent = agents.find(a => a.id === values.agentId)

    browserHistory.push({
      pathname: '/onboarding/confirm-agent-id/security-question',
      state: { agent }
    })
  }

  return (
    <>
      <Helmet>
        <title>Confirm Agent ID | Onboarding | Rechat</title>
      </Helmet>

      <Container>
        <Header
          brand={brand}
          title="Choose MLS"
          subtitle={`You entred ${mlsId} for MLS #, Choose which MLS you are in.`}
        />

        <Form
          onSubmit={onSubmit}
          initialValues={{ agentId: agents[0].id }}
          render={({ handleSubmit, form }) => {
            const { submitError, submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                <Box mb={5}>
                  <Box mb={5}>
                    <MlsSelect items={agents} />
                    {submitError && !submitting && (
                      <Box mt={3}>
                        <Alert severity="error">{submitError}</Alert>
                      </Box>
                    )}
                  </Box>

                  {submitting ? (
                    <CircleSpinner />
                  ) : (
                    <NextButton type="submit" disabled={submitting} />
                  )}
                </Box>
              </form>
            )
          }}
        />
      </Container>
    </>
  )
}
