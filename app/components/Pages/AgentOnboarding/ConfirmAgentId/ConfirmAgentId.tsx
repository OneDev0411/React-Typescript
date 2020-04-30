import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { IAppState } from 'reducers'
import { updateUser } from 'actions/user'

import searchAgent from 'models/agent/search'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import Container from '../Container'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import { useDocumentTitle } from '../use-document-title'
import { useCommonStyles } from '../common-styles'

interface FormValues {
  mlsId: string
}

export default function ConfirmAgentId(props: WithRouterProps) {
  useDocumentTitle('Confirm Agent ID')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles()
  const mlsId = props.location.query.mlsId
  const user = useSelector((store: IAppState) => store.user)
  const brand = useSelector((store: IAppState) => store.brand)

  const onSubmit = async (values: FormValues) => {
    try {
      const agents = await searchAgent(values.mlsId)

      let state: {
        agent?: IAgent
        agents?: IAgent[]
      } = { agent: agents[0] }
      let nextStepUrl = 'security-question'

      if (agents.length === 1) {
        dispatch(
          updateUser({
            ...user,
            agent: agents[0]
          })
        )
      } else {
        state = { agents }
        nextStepUrl = 'choose-mls'
      }

      props.router.push({
        pathname: `/onboarding/confirm-agent-id/${nextStepUrl}`,
        query: { mlsId: values.mlsId },
        state
      })
    } catch (errorCode) {
      if (errorCode === 404) {
        return {
          [FORM_ERROR]: `Agent corresponding to this MLS ID (${
            values.mlsId
          }) not found!`
        }
      }

      return {
        [FORM_ERROR]: 'There was an error with this request. Please try again.'
      }
    }
  }

  const validate = ({ mlsId }: FormValues) => {
    mlsId = mlsId && mlsId.trim()

    if (!mlsId) {
      return { mlsId: 'Required!' }
    }

    return {}
  }

  return (
    <Container>
      <SkipButton to="/onboarding/config-brand" />
      <Header
        brand={brand}
        title="Agent Verification"
        subtitle="Enter your agent license # to unlock MLS features."
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{ mlsId }}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Box mb={5}>
                  <Field
                    component={MUITextInput}
                    id="mlsId"
                    label="Agent Number"
                    placeholder="xxxxxx"
                    name="mlsId"
                    variant="filled"
                    classes={{ root: commonClasses.field }}
                  />
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
  )
}
