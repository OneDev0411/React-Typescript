import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import Table from 'components/Grid/Table'
import { RenderProps } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'

import Message from './columns/Message'
import Time from './columns/Time'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      height: 'auto !important',
      '& .column': {
        padding: theme.spacing(2, 0)
      }
    }
  }),
  {
    name: 'Notifications-Table'
  }
)

interface Props {
  notifications: INotification[]
  isFetching: boolean
  handleNotifClick: (row: INotification) => void
}

export default function List({
  notifications,
  isFetching,
  handleNotifClick
}: Props) {
  const classes = useStyles()
  const columns = [
    {
      header: 'Message',
      id: 'message',
      width: '90%',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<INotification>) => (
        <Message
          onClick={() => handleNotifClick(row)}
          title={row.title}
          message={row.message}
          isSeen={row.seen}
        />
      )
    },
    {
      header: 'Time',
      id: 'time',
      width: '10%',
      verticalAlign: 'center',
      render: ({ row }: RenderProps<INotification>) => (
        <Time date={row.created_at} />
      )
    }
  ]

  return (
    <Table
      virtualize={false}
      columns={columns}
      rows={notifications}
      totalRows={(notifications || []).length}
      loading={isFetching ? 'middle' : null}
      LoadingStateComponent={LoadingContainer}
      classes={{
        row: classes.row
      }}
    />
  )
}
