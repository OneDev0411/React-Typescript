import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { addNotification as notify } from 'reapop'
import { Button } from '@material-ui/core'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getActiveTeamId } from 'utils/user-teams'
import { goTo } from 'utils/go-to'
import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { deleteBrandFlow } from 'models/flows/delete-brand-flow'

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
  notify: typeof notify
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
      width: '70%',
      verticalAlign: 'center',
      render: (props: { rowData: IBrandFlow }) => (
        <Name
          id={props.rowData.id}
          name={props.rowData.name}
          description={props.rowData.description}
        />
      )
    },
    {
      header: 'Enrolled Contacts',
      id: 'cotnacts',
      verticalAlign: 'center',
      render: (props: { rowData: IBrandFlow }) => (
        <EnrolledContacts activeFlows={props.rowData.active_flows} />
      )
    },
    {
      header: '',
      id: 'actions',
      verticalAlign: 'center',
      render: (renderProps: { rowData: IBrandFlow }) => {
        const actions = getFlowActions(renderProps.rowData)

        return (
          <Actions
            actions={actions}
            onSelect={action => {
              switch (action.value) {
                case 'duplicate':
                  setSelectedFlow(renderProps.rowData)
                  setIsModalOpen(true)

                  return
                case 'delete':
                  setSelectedFlow(renderProps.rowData)
                  confirmation.setConfirmationModal({
                    message: `Delete "${renderProps.rowData.name}" Flow?`,
                    description:
                      'This Flow will be deleted and you can not use it anymore. Are you sure?',
                    onConfirm: async () => {
                      if (!brand) {
                        return
                      }

                      await deleteBrandFlow(brand, renderProps.rowData.id)
                      await reloadFlows()
                      props.notify({
                        message: `"${renderProps.rowData.name}" Flow deleted.`,
                        status: 'success'
                      })
                    }
                  })

                  return
                case 'edit':
                case 'view':
                  goTo(getFlowEditUrl(renderProps.rowData.id))
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
      <PageHeader isFlat>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Flows</PageHeader.Heading>
        </PageHeader.Title>

        <PageHeader.Menu>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Flow
          </Button>
        </PageHeader.Menu>
      </PageHeader>

      <PageContainer>
        {isFetching && !error && <LoadingComponent />}
        {!isFetching && !error && (
          <Table
            data={flows}
            columns={columns}
            showToolbar={false}
            isFetching={isFetching}
            LoadingState={LoadingComponent}
          />
        )}
        {error && <h4>{error}</h4>}
      </PageContainer>
    </>
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(
  mapStateToProps,
  { notify }
)(List)
