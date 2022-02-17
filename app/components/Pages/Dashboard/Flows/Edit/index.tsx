import { useState, useContext, useCallback, useMemo } from 'react'

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
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useUnsafeActiveBrandId } from '@app/hooks/brand/use-unsafe-active-brand-id'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { addNotification as notify } from 'components/notification'
import { createStep } from 'models/flows/create-step'
import { deleteBrandFlowStep } from 'models/flows/delete-brand-flow-step'
import { editBrandFlow } from 'models/flows/edit-brand-flow'
import { editBrandFlowStep } from 'models/flows/edit-brand-flow-step'
import { editBrandFlowStepOrder } from 'models/flows/edit-brand-flow-step-order'
import { getBrandFlow } from 'models/flows/get-brand-flow'
import { stopFlow } from 'models/flows/stop-flow'
import { goTo } from 'utils/go-to'

import { getFlowEditUrl, createFlow } from '../helpers'
import New from '../New'

import Contacts from './Contacts'
import Header from './Header'
import Steps from './Steps'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
      marginBottom: theme.spacing(2),
      color: theme.palette.warning.contrastText,
      ...theme.typography.body2
    },
    chip: {
      marginLeft: theme.spacing(1)
    },
    tab: theme.typography.body1
  }),
  { name: 'FlowEditPage' }
)

function Edit(props: WithRouterProps) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const activeBrandId = useUnsafeActiveBrandId()

  const [error, setError] = useState('')
  const [flow, setFlow] = useState<IBrandFlow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [warning, setWarning] = useState<string | null>(null)

  const indexToOrderMap: number[] = useMemo(
    () => (flow?.steps || []).map(step => step.order),
    [flow?.steps]
  )

  const modal = useContext(ConfirmationModalContext)

  const getFlow = useCallback(
    async (brand: string, flowId: UUID, reload): Promise<IBrandFlow> => {
      try {
        if (
          !reload &&
          props.location.state &&
          props.location.state.flow &&
          props.location.state.flow.id === flowId
        ) {
          return props.location.state.flow as IBrandFlow
        }

        const flow = await getBrandFlow(brand, flowId)

        return flow
      } catch (error) {
        if (error.status === 404) {
          dispatch(
            notify({
              message: "The flow you're looking for doesn't exist!",
              status: 'info'
            })
          )
          goTo('/dashboard/flows')
        }

        throw error
      }
    },
    [dispatch, props.location.state]
  )

  const loadFlowData = useCallback(
    async (reload = false) => {
      if (!activeBrandId) {
        setError('You need to be in a team in order to get this Flow')

        return
      }

      setIsLoading(true)

      const flowData = await getFlow(activeBrandId, props.params.id, reload)

      setFlow(flowData)

      if (!flowData.is_editable) {
        setWarning(
          "This Flow is not editable, because it doesn't belong to your team. You can make a duplicate of this and edit it." // eslint-disable-line
        )
      } else if (flowData.active_flows > 0) {
        setWarning(
          // eslint-disable-next-line max-len
          'This Flow is in use! All of your changes will happen to the future steps and contacts.'
        )
      } else if (flowData.active_flows === 0) {
        setWarning(null)
      }

      setIsLoading(false)
    },
    [activeBrandId, getFlow, props.params.id]
  )

  useEffectOnce(() => {
    loadFlowData(true)
  })

  const newStepSubmitHandler = useCallback(
    async (step: IBrandFlowStepInput) => {
      if (!flow || !activeBrandId) {
        return
      }

      await createStep(activeBrandId, flow.id, step)

      loadFlowData(true)
    },
    [activeBrandId, flow, loadFlowData]
  )

  const stepDeleteHandler = useCallback(
    async (step: IBrandFlowStep) => {
      if (!flow || !activeBrandId) {
        return
      }

      modal.setConfirmationModal({
        message: 'Delete Flow step?',
        description: `Are you sure about deleting "${step.title}" step?`,
        confirmLabel: 'Yes, I am sure',
        onConfirm: async () => {
          await deleteBrandFlowStep(activeBrandId, flow.id, step.id)
          loadFlowData(true)
        }
      })
    },
    [activeBrandId, flow, loadFlowData, modal]
  )

  const stepUpdateHandler = useCallback(
    async (step: IBrandFlowStepInput, stepId: UUID) => {
      if (!flow || !activeBrandId) {
        return
      }

      await editBrandFlowStep(activeBrandId, flow.id, stepId, step)

      loadFlowData(true)
    },
    [activeBrandId, flow, loadFlowData]
  )

  const stepMoveHandler = useCallback(
    async (id: UUID, source: number, destination: number) => {
      if (
        !activeBrandId ||
        !flow ||
        !id ||
        source === destination ||
        destination < 1 ||
        destination > (flow.steps || []).length
      ) {
        return
      }

      const destinationOrder = indexToOrderMap[destination - 1]
      const nextDestination =
        destination > source ? destinationOrder + 1 : destinationOrder - 1

      setIsLoading(true)

      await editBrandFlowStepOrder(activeBrandId, flow.id, id, nextDestination)

      loadFlowData(true)
    },
    [activeBrandId, flow, indexToOrderMap, loadFlowData]
  )

  const flowUpdateHandler = useCallback(
    async data => {
      if (!activeBrandId || !flow) {
        return
      }

      data.name = data.name || flow.name
      data.description =
        data.description === undefined ? flow.description : data.description

      await editBrandFlow(activeBrandId, flow.id, data)
      setFlow({
        ...flow,
        ...data
      })
    },
    [activeBrandId, flow]
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
      if (!activeBrandId || !flow) {
        return
      }

      await createFlow(activeBrandId, flowData, flow, createdFlow => {
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
    [activeBrandId, flow]
  )

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
                  <Grid container alignItems="center" justifyContent="center">
                    <span>Contacts</span>
                    <Chip
                      size="small"
                      className={classes.chip}
                      label={flow ? flow.active_flows : 0}
                    />
                  </Grid>
                }
              />
            </Tabs>
          </Box>
        </Box>

        <Box className={classes.contentContainer}>
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
          {!isLoading && flow && selectedTabIndex === 0 && (
            <Steps
              items={flow.steps || []}
              disableEdit={!flow.is_editable}
              onNewStepSubmit={newStepSubmitHandler}
              onStepDelete={stepDeleteHandler}
              onStepUpdate={stepUpdateHandler}
              onStepMove={stepMoveHandler}
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
        </Box>
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
    </>
  )
}

export default withRouter(Edit)
