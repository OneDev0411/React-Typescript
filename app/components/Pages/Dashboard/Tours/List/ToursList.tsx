import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import { IAppState } from 'reducers/index'
import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { TourDrawer } from 'components/tour/TourDrawer'
import { TourSheets } from 'components/tour/TourSheets'

import { RenderProps } from 'components/Grid/Table/types'

import EmptyState from './EmptyState'
import CreateNewTour from './CreateNewTour'
import Info from './columns/Info'
import Actions from './columns/Actions'
import Participants from './columns/Participants'

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

function ToursList(props: { user: IUser }) {
  const theme = useTheme<Theme>()
  const { list, isFetching, error, reloadList } = useFilterCRMTasks(
    {
      order: '-due_date',
      task_type: 'Tour'
    },
    {
      isFetching: true
    }
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isOpenToursheetViewer, setIsOpenToursheetViewer] = useState<boolean>(
    false
  )
  const [selectedTour, setSelectedTour] = useState<ICRMTask<
    CRMTaskAssociation,
    CRMTaskAssociationType
  > | null>(null)

  const handleEdit = (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    setSelectedTour(tour)
    setIsDrawerOpen(true)
  }

  const columns = [
    {
      header: 'Info',
      id: 'info',
      width: '50%',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<TableRow>) => (
        <Info
          dueDate={row.due_date}
          description={row.description}
          onClick={() => handleEdit(row)}
          title={row.title}
        />
      )
    },
    {
      header: 'Participants',
      id: 'participants',
      width: '10%',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<TableRow>) => (
        <Participants
          participants={
            row.associations
              ? row.associations.filter(a => a.association_type === 'contact')
              : []
          }
        />
      )
    },
    {
      id: 'actions',
      width: '40%',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<TableRow>) => (
        <Actions
          onEdit={() => handleEdit(row)}
          onViewToursheet={() => {
            setSelectedTour(row)
            setIsOpenToursheetViewer(true)
          }}
          reloadList={reloadList}
          tour={row}
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
      <Table<TableRow>
        columns={columns}
        rows={list}
        totalRows={(list || []).length}
        loading={isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingContainer}
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

      {isOpenToursheetViewer && (
        <TourSheets
          agent={props.user}
          isOpen
          handleClose={() => {
            setSelectedTour(null)
            setIsOpenToursheetViewer(false)
          }}
          tour={selectedTour}
          listings={
            selectedTour && selectedTour.associations
              ? selectedTour.associations
                  .filter(a => a.association_type === 'listing')
                  .map(a => a.listing)
              : []
          }
        />
      )}
    </>
  )
}

export default connect((state: IAppState) => ({ user: state.user }))(ToursList)
