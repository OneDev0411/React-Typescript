import React from 'react'
import { withRouter } from 'react-router'

import Table from 'components/Grid/Table'

import LoadingContainer from 'components/LoadingContainer'

import Message from './columns/Message'
import Time from './columns/Time'

function Notifications({ notifications, isFetching, handleNotifClick }) {
  const columns = [
    {
      header: 'Message',
      id: 'message',
      width: '90%',
      verticalAlign: 'center',
      render: ({ row }) => (
        <Message
          onClick={() => handleNotifClick(row)}
          message={row.message}
          seen={row.seen}
        />
      )
    },
    {
      header: 'Time',
      id: 'time',
      width: '10%',
      verticalAlign: 'center',
      render: ({ row }) => <Time date={row.created_at} />
    }
  ]

  return (
    <Table
      columns={columns}
      rows={notifications}
      totalRows={(notifications || []).length}
      loading={isFetching ? 'middle' : null}
      LoadingStateComponent={LoadingContainer}
    />
  )
}

export default withRouter(Notifications)
