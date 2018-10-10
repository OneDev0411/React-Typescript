import React from 'react'
import fecha from 'fecha'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

export class Grid extends React.Component {
  columns = [
    {
      header: 'Title',
      id: 'title',
      width: '30%',
      accessor: tour => tour.title,
      render: ({ rowData: tour }) => tour.title
    },
    {
      header: 'Due Date',
      id: 'due_date',
      accessor: tour => tour.due_date,
      render: ({ rowData: tour }) =>
        fecha.format(
          new Date(tour.due_date * 1000),
          'dddd, MMM dd, YYYY hh:mm A'
        )
    }
  ]

  render() {
    return (
      <div style={{ padding: '1.5em 1.5em 0.5em' }}>
        <Table
          columns={this.columns}
          data={this.props.tours.data}
          isFetching={this.props.isFetching}
          LoadingState={LoadingComponent}
          summary={{ entityName: 'tours', style: { color: '#000' } }}
          plugins={{
            sortable: {}
          }}
        />
      </div>
    )
  }
}
