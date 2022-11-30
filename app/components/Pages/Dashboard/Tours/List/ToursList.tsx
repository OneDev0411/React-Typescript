import { useState } from 'react'

import { Button, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
import { connect } from 'react-redux'
import { useTitle, useEffectOnce } from 'react-use'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from 'components/GlobalActionsButton/hooks/use-global-action-context'
import PageLayout from 'components/GlobalPageLayout'
import Table from 'components/Grid/Table'
import { RenderProps } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import { TourDrawer } from 'components/tour/TourDrawer'
import { TourSheets } from 'components/tour/TourSheets'
import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'
import { ZeroState } from 'partials/ZeroState'
import { IAppState } from 'reducers/index'

import Actions from './columns/Actions'
import DueDate from './columns/DueDate'
import Participants from './columns/Participants'
import Title from './columns/Title'
import ViewToursheet from './columns/ViewToursheet'

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

export const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      '& .column': {
        padding: theme.spacing(0, 1)
      },
      '& .column.primary': {
        overflow: 'hidden'
      }
    }
  }),
  {
    name: 'ToursTitleTable'
  }
)

interface Props extends RouteComponentProps {
  user: IUser
}

function ToursList(props: Props) {
  const [, dispatch] = useGlobalActionContext()
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
  const [isOpenToursheetViewer, setIsOpenToursheetViewer] =
    useState<boolean>(false)
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

  const classes = useStyles()
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
      return (
        <ZeroState
          imageUrl="/static/images/zero-state/tours.png"
          title="No tours are scheduled, yet."
          // eslint-disable-next-line max-len
          subTitle="Make touring homes easier on buyers and yourself with Tours. Pick the right properties for your client, and we do the rest of the work."
          ctaNode={
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={onOpenTourDrawer}
            >
              Create a Toursheet
            </Button>
          }
        />
      )
    }

    return (
      <Table<TableRow>
        columns={columns}
        rows={list}
        totalRows={(list || []).length}
        loading={isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingContainer}
        classes={{
          row: cn(gridClasses.row, classes.row)
        }}
      />
    )
  }

  useTitle('Tours | Rechat')

  return (
    <>
      <PageLayout>
        <PageLayout.Header title="Tours" />

        <PageLayout.Main>
          <>
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
          </>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default withRouter(
  connect((state: IAppState) => ({ user: state.user }))(ToursList)
)
