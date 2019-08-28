import React from 'react'
import { Helmet } from 'react-helmet'
import { Button } from '@material-ui/core'

import Table from 'components/Grid/Table'
import PageHeader from 'components/PageHeader'

import { useGetOpenHouses } from 'hooks/use-get-open-houses'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import Name from './columns/Name'

import { PageContainer } from './styled'

function OHList() {
  const { list, isFetching, error } = useGetOpenHouses()

  const columns = [
    {
      header: 'Name',
      id: 'name',
      width: '70%',
      verticalAlign: 'center',
      render: (props: { rowData: IEvent }) => (
        <Name
          id={props.rowData.id}
          name={props.rowData.title}
          description={props.rowData.description}
        />
      )
    }
  ]

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
        {isFetching && !error && <LoadingComponent />}
        {!isFetching && !error && (
          <Table
            data={list}
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

export default OHList
