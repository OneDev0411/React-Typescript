import { ACL } from 'constants/acl'

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { Alert } from '@material-ui/lab'
import { Box, Link, IconButton } from '@material-ui/core'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'
import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'
import Table from 'components/Grid/Table'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import { RenderProps } from 'components/Grid/Table/types'

import EmptyState from './EmptyState'
import CreateNewOpenHouse from './CreateNewOpenHouse'
import Photo from './columns/Photo'
import Title from './columns/Title'
import Date from './columns/Date'
import Registrants from './columns/Registrants'
import GuestRegistration from './columns/GuestRegistration'
import Actions from './columns/Actions'

interface Associations {
  deal?: IDeal
  listing?: ICompactListing
}

interface Props {
  activeBrandId: UUID
}

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

function OpenHousesList(props: Props) {
  const iconClasses = useIconStyles()
  const { list, isFetching, error, reloadList } = useFilterCRMTasks(
    {
      order: '-due_date',
      task_type: 'Open House'
    },
    {
      isFetching: true
    }
  )

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAlertOpen, setAlertToOpen] = useState(true)
  const [selectedOH, setSelectedOH] = useState<ICRMTask<
    CRMTaskAssociation,
    CRMTaskAssociationType
  > | null>(null)
  const [associations, setAssociations] = useState<Associations | null>(null)

  const handleEdit = (
    openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    setSelectedOH(openHouse)
    setIsDrawerOpen(true)
  }

  const columns = [
    {
      header: 'Photo',
      id: 'photo',
      render: ({ row }: RenderProps<TableRow>) => (
        <Photo
          listings={
            row.associations
              ? row.associations.filter(a => a.association_type === 'listing')
              : []
          }
        />
      )
    },
    {
      header: 'Infos',
      id: 'info',
      primary: true,
      render: ({ row }: RenderProps<TableRow>) => (
        <Title
          description={row.description}
          onClick={() => handleEdit(row)}
          title={row.title}
        />
      )
    },
    {
      header: 'Date',
      id: 'date',
      render: ({ row }: RenderProps<TableRow>) => (
        <Date dueDate={row.due_date} />
      )
    },
    {
      header: 'Registrants',
      id: 'registrants',
      render: ({ row }: RenderProps<TableRow>) => (
        <Registrants
          registrants={
            row.associations
              ? row.associations.filter(a => a.association_type === 'contact')
              : []
          }
        />
      )
    },
    {
      id: 'guest-registration',
      render: ({ row }: RenderProps<TableRow>) => (
        <GuestRegistration
          activeBrandId={props.activeBrandId}
          openHouse={row}
        />
      )
    },
    {
      id: 'actions',
      render: ({ row }: RenderProps<TableRow>) => (
        <Actions
          openHouse={row}
          onEdit={() => handleEdit(row)}
          reloadList={reloadList}
        />
      )
    }
  ]

  const onOpenOHDrawer = async (item: ICompactListing | IDeal) => {
    const associations: Associations = {}

    if (['compact_listing', 'property'].includes(item.type)) {
      // @ts-ignore TODO: This is temporary https://rechathq.slack.com/archives/CMXKY2L31/p1574616881213400
      associations.listing = item
    } else if (item.type === 'deal') {
      associations.deal = item
    }

    setAssociations(associations)
    setIsDrawerOpen(true)
  }

  const onCloseOHDrawer = () => {
    setSelectedOH(null)
    setIsDrawerOpen(false)
  }

  const drawerCallback = () => {
    onCloseOHDrawer()
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
      return <EmptyState onOpenDrawer={onOpenOHDrawer} />
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
        <title>Open House Registration Pages | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Open House Registration Pages">
          <Box textAlign="right">
            <CreateNewOpenHouse onOpenDrawer={onOpenOHDrawer} />
          </Box>
        </PageLayout.Header>
        <PageLayout.Main>
          <Box>
            <Acl access={ACL.DEALS}>
              {isAlertOpen && (
                <Alert
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertToOpen(false)
                      }}
                    >
                      <CloseIcon className={iconClasses.medium} />
                    </IconButton>
                  }
                >
                  <Box>
                    Visit <Link href="/dashboard/deals">deals</Link> to Notify
                    your Office to Book an Open House on the MLS. This page is
                    only for creating Open House Registration pages and events.
                  </Box>
                </Alert>
              )}
            </Acl>
            {renderContent()}

            {isDrawerOpen && (
              // @ts-ignore js component
              <OpenHouseDrawer
                deleteCallback={drawerCallback}
                isOpen
                onClose={onCloseOHDrawer}
                openHouse={selectedOH}
                submitCallback={drawerCallback}
                associations={associations}
              />
            )}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default connect((state: { user: IUser }) => ({
  activeBrandId: getActiveTeamId(state.user)
}))(OpenHousesList)
