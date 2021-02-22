import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { withRouter, WithRouterProps } from 'react-router'
import {
  Grid,
  Box,
  Paper,
  Tab,
  Tabs,
  Chip,
  Theme,
  makeStyles
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import PageLayout from 'components/GlobalPageLayout'

import { getEmailTemplates } from 'models/email-templates/get-email-templates'
import { getBrandFlow } from 'models/flows/get-brand-flow'
import { deleteBrandFlowStep } from 'models/flows/delete-brand-flow-step'
import { editBrandFlowStep } from 'models/flows/edit-brand-flow-step'
// import { editBrandFlowSteps } from 'models/flows/edit-brand-flow-steps'
import { createStep } from 'models/flows/create-step'
import { editBrandFlow } from 'models/flows/edit-brand-flow'
import { stopFlow } from 'models/flows/stop-flow'

import { getActiveTeamId } from 'utils/user-teams'
import { goTo } from 'utils/go-to'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import LoadingContainer from 'components/LoadingContainer'
import EmailTemplateDrawer from 'components/AddOrEditEmailTemplateDrawer'

import { selectUser } from 'selectors/user'

import { getFlowEditUrl, createFlow } from '../helpers'
import New from '../New'

import Header from './Header'
import Steps from './Steps'
import Contacts from './Contacts'

// import {
//   shouldUpdateNextSteps,
//   updateStepsDue,
//   getUpdatedStepsOnMove
// } from './helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    chip: {
      margin: theme.spacing(0, 1)
    },
    headerContainer: {
      padding: theme.spacing(2, 4, 0)
    },
    tabContainer: {
      marginTop: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    contentContainer: {
      width: '100%',
      height: 'auto',
      minHeight: '100vh',
      padding: theme.spacing(4),
      background: theme.palette.grey[50]
    },
    warnContainer: {
      marginTop: theme.spacing(2),
      color: theme.palette.warning.contrastText,
      ...theme.typography.body2
    },
    tab: theme.typography.body1
  }),
  { name: 'FlowEditPage' }
)

function Edit(props: WithRouterProps) {
  const classes = useStyles()

  const user = useSelector(selectUser)
  const brand = getActiveTeamId(user) || ''

  const [error, setError] = useState('')
  const [flow, setFlow] = useState<IBrandFlow | null>(null)
  const [emailTemplates, setEmailTemplates] = useState<
    Nullable<IBrandEmailTemplate[]>
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [
    selectedEmailTemplate,
    setSelectedEmailTemplate
  ] = useState<IBrandEmailTemplate | null>(null)
  const [isEmailTemplateDrawerOpen, setIsEmailTemplateDrawerOpen] = useState(
    false
  )
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [warning, setWarning] = useState<string | null>(null)
  const modal = useContext(ConfirmationModalContext)

  const getFlow = useCallback(
    async (brand: string, flowId: UUID, reload): Promise<IBrandFlow> => {
      if (
        !reload &&
        props.location.state &&
        props.location.state.flow &&
        props.location.state.flow.id === flowId
      ) {
        return props.location.state.flow as IBrandFlow
      }

      return getBrandFlow(brand, flowId)
    },
    [props.location.state]
  )

  const loadFlowData = useCallback(
    async (reload = false) => {
      if (!brand) {
        setError('You need to be in a team in order to get this Flow')

        return
      }

      setIsLoading(true)

      const flowData = await getFlow(brand, props.params.id, reload)

      setFlow(flowData)

      if (!flowData.is_editable) {
        setWarning(
          "This Flow is not editable, because it doesn't belong to your team. You can make a duplicate of this and edit it." // eslint-disable-line
        )
      } else if (flowData.active_flows > 0) {
        setWarning(
          'This Flow is in use! All of your changes will happen to the future steps and contacts.'
        )
      } else if (flowData.active_flows === 0) {
        setWarning(null)
      }

      setIsLoading(false)
    },
    [brand, getFlow, props.params.id]
  )

  useEffect(() => {
    loadFlowData()
  }, [brand, getFlow, loadFlowData, props.location.state, props.params.id])

  useEffect(() => {
    async function fetchEmailTemplates() {
      if (!brand) {
        return
      }

      const fetchedTemplates = await getEmailTemplates(brand)

      setEmailTemplates(fetchedTemplates)
    }

    fetchEmailTemplates()
  }, [brand])

  const newStepSubmitHandler = useCallback(
    async (step: IBrandFlowStepInput) => {
      if (!flow || !brand) {
        return
      }

      await createStep(brand, flow.id, [step])

      loadFlowData(true)
    },
    [brand, flow, loadFlowData]
  )

  const stepDeleteHandler = useCallback(
    async (step: IBrandFlowStep) => {
      if (!flow || !brand) {
        return
      }

      modal.setConfirmationModal({
        message: 'Delete Flow step?',
        description: `Are you sure about deleting "${step.title}" step?`,
        confirmLabel: 'Yes, I am sure',
        onConfirm: async () => {
          // const [
          //   shouldUpdateSteps,
          //   stepDueDiff,
          //   stepsToUpdate
          // ] = shouldUpdateNextSteps(flow, step.id, step, true)

          // if (shouldUpdateSteps) {
          //   await updateStepsDue(brand, flow.id, stepsToUpdate, stepDueDiff)
          // }

          await deleteBrandFlowStep(brand, flow.id, step.id)
          loadFlowData(true)
        }
      })
    },
    [brand, flow, loadFlowData, modal]
  )

  const stepUpdateHandler = useCallback(
    async (step: IBrandFlowStepInput, stepId: UUID) => {
      if (!flow || !brand) {
        return
      }

      // const [
      //   shouldUpdateSteps,
      //   stepDueDiff,
      //   stepsToUpdate
      // ] = shouldUpdateNextSteps(flow, stepId, step)

      // if (shouldUpdateSteps) {
      //   await updateStepsDue(brand, flow.id, stepsToUpdate, stepDueDiff)
      // }

      await editBrandFlowStep(brand, flow.id, stepId, step)

      loadFlowData(true)
    },
    [brand, flow, loadFlowData]
  )

  const stepMoveHandler = useCallback(async (source: number, destination) => {
    console.log('stepMoveHandler', { source, destination })

    // if (!flow || !brand || !flow.steps) {
    //   return
    // }

    // if (source === destination) {
    //   return
    // }

    // const newSteps = getUpdatedStepsOnMove(flow.steps, source, destination)

    // setIsLoading(true)

    // await editBrandFlowSteps(brand, flow.id, newSteps)

    // loadFlowData(true)
  }, [])

  const flowUpdateHandler = useCallback(
    async data => {
      if (!brand || !flow) {
        return
      }

      data.name = data.name || flow.name
      data.description =
        data.description === undefined ? flow.description : data.description

      await editBrandFlow(brand, flow.id, data)
      setFlow({
        ...flow,
        ...data
      })
    },
    [brand, flow]
  )

  const flowStopHandler = useCallback(
    async (flowInstanceId: UUID) => {
      await stopFlow(flowInstanceId)
      await loadFlowData(true)
    },
    [loadFlowData]
  )

  const duplicateFlowHandler = useCallback(
    async (flowData: IBrandFlowInput) => {
      if (!brand || !flow) {
        return
      }

      await createFlow(brand, flowData, flow, createdFlow => {
        setIsDuplicateModalOpen(false)
        goTo(
          getFlowEditUrl(createdFlow.id),
          null,
          {},
          {
            flow: createdFlow
          }
        )
      })
    },
    [brand, flow]
  )

  const reviewEmailTemplateClickHandler = useCallback(
    (emailTemplate: IBrandEmailTemplate) => {
      if (!brand || !flow) {
        return
      }

      setSelectedEmailTemplate(emailTemplate)
      setIsEmailTemplateDrawerOpen(true)
    },
    [brand, flow]
  )

  const newEmailTemplateClickHandler = useCallback(() => {
    if (!brand || !flow) {
      return
    }

    setIsEmailTemplateDrawerOpen(true)
  }, [brand, flow])

  if (error) {
    return (
      <Box className={classes.contentContainer}>
        {error && <Paper>{error}</Paper>}
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {flow ? `${flow.name} | Flows | Rechat` : 'Flow | Rechat'}
        </title>
      </Helmet>
      <PageLayout gutter={0}>
        <Box className={classes.headerContainer}>
          {flow && (
            <Header
              name={flow.name}
              onDuplicateClick={() => {
                setIsDuplicateModalOpen(true)
              }}
              description={flow.description}
              onChange={flowUpdateHandler}
              disableEdit={!flow.is_editable}
            />
          )}
          <Box className={classes.tabContainer}>
            <Tabs
              value={selectedTabIndex}
              onChange={(_, newTabIndex) => setSelectedTabIndex(newTabIndex)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab disabled={isLoading} className={classes.tab} label="Steps" />
              <Tab
                disabled={isLoading}
                className={classes.tab}
                label={
                  <Grid container alignItems="center" justify="center">
                    <span>Contacts</span>
                    <Chip
                      className={classes.chip}
                      label={flow ? flow.active_flows : 0}
                    />
                  </Grid>
                }
              />
            </Tabs>
          </Box>
        </Box>

        <PageLayout.Main mt={0} className={classes.contentContainer}>
          {warning && (
            <Alert
              severity="warning"
              className={classes.warnContainer}
              onClose={() => setWarning(null)}
            >
              {warning}
            </Alert>
          )}
          {isLoading && <LoadingContainer style={{ padding: '20% 0' }} />}
          {!isLoading && emailTemplates && flow && selectedTabIndex === 0 && (
            <Steps
              disableEdit={!flow.is_editable}
              onNewStepSubmit={newStepSubmitHandler}
              onStepDelete={stepDeleteHandler}
              onStepUpdate={stepUpdateHandler}
              onStepMove={stepMoveHandler}
              onNewEmailTemplateClick={newEmailTemplateClickHandler}
              onReviewEmailTemplateClick={reviewEmailTemplateClickHandler}
              items={flow.steps || []}
              emailTemplates={emailTemplates}
              defaultSelectedEmailTemplate={
                selectedEmailTemplate ? selectedEmailTemplate.id : undefined
              }
            />
          )}
          {!isLoading && flow && selectedTabIndex === 1 && (
            <Contacts
              onStop={flowStopHandler}
              onContactClick={contactId =>
                props.router.push(`/dashboard/contacts/${contactId}`)
              }
              flowId={flow.id}
            />
          )}
        </PageLayout.Main>
      </PageLayout>

      {flow && isDuplicateModalOpen && (
        <New
          onClose={() => {
            setIsDuplicateModalOpen(false)
          }}
          onSubmit={duplicateFlowHandler}
          flow={flow}
        />
      )}
      <EmailTemplateDrawer
        isOpen={isEmailTemplateDrawerOpen}
        onClose={() => {
          setIsEmailTemplateDrawerOpen(false)
        }}
        submitCallback={emailTemplate => {
          setSelectedEmailTemplate(emailTemplate)
        }}
        emailTemplate={selectedEmailTemplate}
      />
    </>
  )
}

export default withRouter(Edit)
