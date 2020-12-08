import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useEffectOnce } from 'react-use'

import { Box } from '@material-ui/core'

import { IAppState } from 'reducers/index'
import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'
import { useGridStyles } from 'components/Grid/Table/styles'

import Table from 'components/Grid/Table'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { TourDrawer } from 'components/tour/TourDrawer'
import { TourSheets } from 'components/tour/TourSheets'

import { RenderProps } from 'components/Grid/Table/types'
import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from 'components/GlobalActionsButton/hooks/use-global-action-context'

import EmptyState from './EmptyState'

import DueDate from './columns/DueDate'
import Title from './columns/Title'
import Participants from './columns/Participants'
import ViewToursheet from './columns/ViewToursheet'
import Actions from './columns/Actions'

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

function ToursList(props: { user: IUser }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useGlobalActionContext()
  const gridClasses = useGridStyles()
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

  useEffectOnce(() => {
    dispatch({
      type: SET_CREATE_CALLBACK_HANDLER,
      handlers: {
        onCreateTour: reloadList
      }
    })
  })

  const handleEdit = (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    setSelectedTour(tour)
    setIsDrawerOpen(true)
  }

  const columns = [
    {
      header: 'Title',
      id: 'title',
      class: 'primary',
      render: ({ row }: RenderProps<TableRow>) => (
        <Title title={row.title} onClick={() => handleEdit(row)} />
      )
    },
    {
      header: 'Date',
      id: 'date',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<TableRow>) => (
        <DueDate dueDate={row.due_date} />
      )
    },
    {
      header: 'Participants',
      id: 'participants',
      verticalAlign: 'center',
      class: 'opaque',
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
      id: 'view-toursheet',
      verticalAlign: 'center',
      class: 'visible-on-hover',
      width: '150px',
      render: ({ row }: RenderProps<TableRow>) => (
        <ViewToursheet
          onViewToursheet={() => {
            setSelectedTour(row)
            setIsOpenToursheetViewer(true)
          }}
        />
      )
    },
    {
      id: 'actions',
      verticalAlign: 'center',
      width: '60px',
      class: 'visible-on-hover',
      render: ({ row }: RenderProps<TableRow>) => (
        <Actions
          onEdit={() => handleEdit(row)}
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
        classes={{
          row: gridClasses.row
        }}
      />
    )
  }

  return (
    <>
      <Helmet>
        <title>Tours | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Tours" />

        <PageLayout.Main>
          <Box>
            {renderContent()}

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
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default connect((state: IAppState) => ({ user: state.user }))(ToursList)
