import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { addNotification as notify } from 'reapop'
import { Box, Button } from '@material-ui/core'

import { ThunkDispatch } from 'redux-thunk'

import { AnyAction } from 'redux'

import Table from 'components/Grid/Table'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getActiveTeamId } from 'utils/user-teams'
import { goTo } from 'utils/go-to'
import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { deleteBrandFlow } from 'models/flows/delete-brand-flow'

import { RenderProps } from 'components/Grid/Table/types'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import { getFlowEditUrl, createFlow } from '../helpers'
import New from '../New'

import { getFlowActions } from './helpers'

import Name from './columns/Name'
import EnrolledContacts from './columns/EnrolledContacts'
import Actions from './columns/Actions'

import { PageContainer } from './styled'

interface Props {
  user: IUser
  notify: IAsyncActionProp<typeof notify>
}

function List(props: Props) {
  const brand = getActiveTeamId(props.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<IBrandFlow | null>(null)
  const { flows, reloadFlows, isFetching, error } = useGetBrandFlows(brand)
  const confirmation = useContext(ConfirmationModalContext)

  async function newFlowSubmitHandler(flowData: IBrandFlowInput) {
    try {
      const brandId = getActiveTeamId(props.user)

      if (brandId === null) {
        props.notify({
          message: 'You need to be in a team in order to create a flow',
          status: 'error'
        })

        return
      }

      await createFlow(brandId, flowData, selectedFlow, createdFlow => {
        goTo(
          getFlowEditUrl(createdFlow.id),
          null,
          {},
          {
            flow: createdFlow
          }
        )
      })
    } catch (err) {
      console.error(err)
      props.notify({
        message: 'Unexpected error happened',
        status: 'error'
      })
      setIsModalOpen(false)
      setSelectedFlow(null)
    }
  }

  const columns = [
    {
      header: 'Name',
      id: 'name',
      primary: true,
      render: ({ row }: RenderProps<IBrandFlow>) => (
        <Name id={row.id} name={row.name} description={row.description} />
      )
    },
    {
      header: 'Enrolled Contacts',
      id: 'cotnacts',
      render: ({ row }: RenderProps<IBrandFlow>) => (
        <EnrolledContacts activeFlows={row.active_flows} />
      )
    },
    {
      id: 'actions',
      render: ({ row }: RenderProps<IBrandFlow>) => {
        const actions = getFlowActions(row)

        return (
          <Actions
            actions={actions}
            onSelect={action => {
              switch (action.value) {
                case 'duplicate':
                  setSelectedFlow(row)
                  setIsModalOpen(true)

                  return
                case 'delete':
                  confirmation.setConfirmationModal({
                    message: `Delete "${row.name}" Flow?`,
                    description: `This Flow will be deleted 
                    and you can not use it anymore. Are you sure?`,
                    onConfirm: async () => {
                      if (!brand) {
                        return
                      }

                      await deleteBrandFlow(brand, row.id)
                      await reloadFlows()
                      props.notify({
                        message: `"${row.name}" Flow deleted.`,
                        status: 'success'
                      })
                    }
                  })

                  return
                case 'edit':
                case 'view':
                  goTo(getFlowEditUrl(row.id))
              }
            }}
          />
        )
      }
    }
  ]

  return (
    <>
      <Helmet>
        <title>Flows | Rechat</title>
      </Helmet>
      {isModalOpen && (
        <New
          onClose={() => {
            setIsModalOpen(false)
            setSelectedFlow(null)
          }}
          onSubmit={newFlowSubmitHandler}
          flow={selectedFlow}
        />
      )}
      <Box p={2} my={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Create Flow
        </Button>
      </Box>

      <PageContainer>
        {isFetching && !error && <LoadingComponent />}
        {!isFetching && !error && (
          <Table<IBrandFlow>
            columns={columns}
            rows={flows}
            totalRows={(flows || []).length}
            loading={isFetching ? 'middle' : null}
            LoadingStateComponent={LoadingComponent}
          />
        )}
        {error && <h4>{error}</h4>}
      </PageContainer>
    </>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    notify: (...args: Parameters<typeof notify>) => dispatch(notify(...args))
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
