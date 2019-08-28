import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Button } from '@material-ui/core'

import { useGetOpenHouses } from 'hooks/use-get-open-houses'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import Name from './columns/Name'
import { PageContainer } from './styled'

function OHList() {
  const { list, isFetching, error, reloadList } = useGetOpenHouses()
  const [isOpenOHDrawer, setIsOpenOHDrawer] = useState(false)
  const [selectedOH, setSelectedOH] = useState<IEvent | null>(null)

  const columns = [
    {
      header: 'Name',
      id: 'name',
      width: '70%',
      verticalAlign: 'center',
      render: (props: { rowData: IEvent }) => (
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
          <Button variant="contained" color="primary">
            Create an Open House
          </Button>
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
        />
      )}
    </>
  )
}

export default OHList
