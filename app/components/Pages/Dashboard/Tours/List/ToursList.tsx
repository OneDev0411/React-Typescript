import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import { IAppState } from 'reducers/index'
import { useGetTours } from 'hooks/use-get-tours'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { TourDrawer } from 'components/tour/TourDrawer'

import EmptyState from './EmptyState'
import CreateNewTour from './CreateNewTour'
import Info from './columns/Info'
import Actions from './columns/Actions'
import Registrants from './columns/Registrants'

function ToursList(props: { user: IUser }) {
  const theme = useTheme<Theme>()
  const { list, isFetching, error, reloadList } = useGetTours({
    isFetching: true
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<ICRMTask<
    CRMTaskAssociation,
    CRMTaskAssociationType
  > | null>(null)

  const columns = [
    {
      header: 'Info',
      id: 'info',
      width: '50%',
      verticalAlign: 'center',
      render: (props: {
        rowData: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
      }) => (
        <Info
          title={props.rowData.title}
          dueDate={props.rowData.due_date}
          description={props.rowData.description}
        />
      )
    },
    {
      header: 'Participants',
      id: 'participants',
      width: '10%',
      verticalAlign: 'center',
      render: (props: {
        rowData: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
      }) => (
        <Registrants
          registrants={
            props.rowData.associations
              ? props.rowData.associations.filter(
                  a => a.association_type === 'contact'
                )
              : []
          }
        />
      )
    },
    {
      id: 'actions',
      width: '40%',
      verticalAlign: 'center',
      render: (rowProps: {
        rowData: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
      }) => (
        <Actions
          tour={rowProps.rowData}
          onEdit={() => {
            setSelectedTour(rowProps.rowData)
            setIsDrawerOpen(true)
          }}
          reloadList={reloadList}
        />
      )
    }
  ]

  const onOpenTourDrawer = () => {
    setIsDrawerOpen(true)
  }

  const onCloseTourDrawer = () => {
    setSelectedTour(null)
    setIsDrawerOpen(false)
  }

  const drawerCallback = () => {
    onCloseTourDrawer()
    reloadList()
  }

  const renderContent = () => {
    if (isFetching) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    if (error) {
      return <h4>{error}</h4>
    }

    if (list.length === 0) {
      return <EmptyState onOpenDrawer={onOpenTourDrawer} />
    }

    return (
      <Table
        columns={columns}
        data={list}
        isFetching={isFetching}
        LoadingState={LoadingContainer}
        showToolbar={false}
      />
    )
  }

  return (
    <>
      <Helmet>
        <title>Toursheets | Rechat</title>
      </Helmet>

      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Toursheets</PageHeader.Heading>
        </PageHeader.Title>

        <PageHeader.Menu>
          <CreateNewTour onOpenDrawer={onOpenTourDrawer} />
        </PageHeader.Menu>
      </PageHeader>

      <div style={{ padding: theme.spacing(0, 3, 9) }}>{renderContent()}</div>

      {isDrawerOpen && (
        <TourDrawer
          deleteCallback={drawerCallback}
          isOpen
          onClose={onCloseTourDrawer}
          tour={selectedTour}
          submitCallback={drawerCallback}
          user={props.user}
        />
      )}
    </>
  )
}

export default connect((state: IAppState) => ({ user: state.user }))(ToursList)
