import { ACL } from 'constants/acl'

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'
import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'
import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import { Callout } from 'components/Callout'

import { RenderProps } from 'components/Grid/Table/types'

import EmptyState from './EmptyState'
import CreateNewOpenHouse from './CreateNewOpenHouse'
import Info from './columns/Info'
import Actions from './columns/Actions'
import Registrants from './columns/Registrants'

interface Associations {
  deal?: IDeal
  listing?: ICompactListing
}

interface Props {
  activeBrandId: UUID
}

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

function OpenHousesList(props: Props) {
  const theme = useTheme<Theme>()
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
      header: 'Info',
      id: 'info',
      primary: true,
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
      id: 'actions',
      render: ({ row }: RenderProps<TableRow>) => (
        <Actions
          activeBrandId={props.activeBrandId}
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

      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Open House Registration Pages</PageHeader.Heading>
        </PageHeader.Title>

        <PageHeader.Menu>
          <CreateNewOpenHouse onOpenDrawer={onOpenOHDrawer} />
        </PageHeader.Menu>
      </PageHeader>

      <div style={{ padding: theme.spacing(0, 3, 9) }}>
        <Acl access={ACL.DEALS}>
          <Callout type="info" style={{ margin: theme.spacing(1.5, 0) }}>
            To Notify your Office to Book an Open House on the MLS please find
            the button inside of your{' '}
            <a href="/dashboard/deals" target="_blank">
              deals
            </a>
            . This page is only for creating Open House Registration pages and
            events for your listings or other agents listings that you are
            holding an open house for.
          </Callout>
        </Acl>
        {renderContent()}
      </div>

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
    </>
  )
}

export default connect((state: { user: IUser }) => ({
  activeBrandId: getActiveTeamId(state.user)
}))(OpenHousesList)
