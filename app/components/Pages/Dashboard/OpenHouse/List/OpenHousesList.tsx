import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

import { useGetOpenHouses } from 'hooks/use-get-open-houses'
import { getActiveTeamId } from 'utils/user-teams'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

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

function OpenHousesList(props: Props) {
  const theme = useTheme<Theme>()
  const { list, isFetching, error, reloadList } = useGetOpenHouses({
    isFetching: true
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedOH, setSelectedOH] = useState<ICRMTask<
    CRMTaskAssociation,
    CRMTaskAssociationType
  > | null>(null)
  const [associations, setAssociations] = useState<Associations | null>(null)

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
      header: 'Registrants',
      id: 'registrants',
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
          activeBrandId={props.activeBrandId}
          openHouse={rowProps.rowData}
          onEdit={() => {
            setSelectedOH(rowProps.rowData)
            setIsDrawerOpen(true)
          }}
          reloadList={reloadList}
        />
      )
    }
  ]

  const onOpenOHDrawer = async (item: ICompactListing | IDeal) => {
    const associations: Associations = {}

    if (item.type === 'compact_listing') {
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
        <title>Open Houses | Rechat</title>
      </Helmet>

      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Open House</PageHeader.Heading>
        </PageHeader.Title>

        <PageHeader.Menu>
          <CreateNewOpenHouse onOpenDrawer={onOpenOHDrawer} />
        </PageHeader.Menu>
      </PageHeader>

      <div style={{ padding: theme.spacing(0, 3, 9) }}>{renderContent()}</div>

      {isDrawerOpen && (
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
