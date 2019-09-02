import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { useGetOpenHouses } from 'hooks/use-get-open-houses'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import CreateNewOH from './CreateNewOH'
import Name from './columns/Name'
import { PageContainer } from './styled'

interface Associations {
  deal?: IDeal
  listing?: ICompactListing
}

function OHList() {
  const { list, isFetching, error, reloadList } = useGetOpenHouses()
  const [isOpenOHDrawer, setIsOpenOHDrawer] = useState(false)
  const [selectedOH, setSelectedOH] = useState<ICRMTask<CRMTaskAssociation, CRMTaskAssociationType> | null>(null)
  const [associations, setAssociations] = useState<Associations | null>(null)

  const columns = [
    {
      header: 'Name',
      id: 'name',
      width: '70%',
      verticalAlign: 'center',
      render: (props: { rowData: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType> }) => (
        <Name
          name={props.rowData.title}
          description={props.rowData.description}
          onClick={() => {
            setIsOpenOHDrawer(true)
            setSelectedOH(props.rowData)
          }}
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
    setIsOpenOHDrawer(true)
  }

  const onCloseOHDrawer = () => {
    setSelectedOH(null)
    setIsOpenOHDrawer(false)
  }

  const drawerCallback = () => {
    onCloseOHDrawer()
    reloadList()
  }

  return (
    <>
      <Helmet>
        <title>Open Houses | Rechat</title>
      </Helmet>

      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Open Houses</PageHeader.Heading>
        </PageHeader.Title>

        <PageHeader.Menu>
          <CreateNewOH onOpenOHDrawer={onOpenOHDrawer} />
        </PageHeader.Menu>
      </PageHeader>

      <PageContainer>
        {isFetching && !error && (
          <LoadingContainer style={{ padding: '30% 0' }} />
        )}
        {!isFetching && !error && (
          <Table
            data={list}
            columns={columns}
            showToolbar={false}
            isFetching={isFetching}
            LoadingState={LoadingContainer}
          />
        )}
        {error && <h4>{error}</h4>}
      </PageContainer>

      {isOpenOHDrawer && (
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

export default OHList
