import { useMemo, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import pluralize from 'pluralize'

import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import Table from 'components/Grid/Table'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import RecipientsColumn from './Column/Recipients'
import StatsColumn from './Column/Stats'
import ThumbnailColumn from './Column/Thumbnail'
import TitleColumn from './Column/Title'
import { valueAndPercent, hasPixelTracking } from './helpers'
import Layout from './Layout'
import Actions from './MarketingInsightsActions'
import { InsightFilterType } from './types'
import useListData from './useListData'
import { EmailInsightsZeroState } from './ZeroState'

const useCustomGridStyles = makeStyles(
  theme => ({
    row: {
      '& td': {
        '&.actions svg': {
          fill: theme.palette.grey['500']
        }
      },
      '&:hover td': {
        '&.actions svg': {
          fill: theme.palette.text.primary
        }
      }
    }
  }),
  { name: 'InsightList' }
)

export default function List(props) {
  const customGridClasses = useCustomGridStyles()
  const gridClasses = useGridStyles()

  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFilterType.SCHEDULED
    : InsightFilterType.SENT

  const { isLoading, hasError, list, counts, reloadList, reloadItem } =
    useListData(filterType)

  useEffect(() => {
    function handleEmailCampaignSentEvent(event) {
      const ids = event?.ids ?? []

      ids.forEach(reloadItem)
    }

    window.socket.on('email_campaign:send', handleEmailCampaignSentEvent)

    return () => {
      window.socket.off('email_campaign:send', handleEmailCampaignSentEvent)
    }
  }, [reloadItem])

  const columns = useMemo(
    () => [
      {
        header: 'Thumbnail',
        id: 'thumbnail',
        class: 'opaque',
        width: '70px',
        verticalAlign: 'center',
        render: ({ row }) => <ThumbnailColumn data={row} />
      },
      {
        header: 'Title',
        id: 'title-date',
        primary: true,
        width: isScheduled ? '100%' : '38%',
        accessor: row => row.due_at,
        render: ({ row }) => <TitleColumn data={row} reloadList={reloadList} />
      },
      {
        header: 'Recipients',
        id: 'recipients',
        class: 'opaque',
        width: '23%',
        verticalAlign: 'center',
        hidden: isScheduled,
        render: ({ row }) => <RecipientsColumn data={row} />
      },
      {
        header: 'Delivered',
        id: 'delivered',
        class: 'opaque',
        width: '13%',
        verticalAlign: 'center',
        hidden: isScheduled,
        render: ({ row }) => {
          const { executed_at, delivered, sent, failed } = row

          if (!executed_at || hasPixelTracking(row)) {
            return null
          }

          return (
            <StatsColumn
              title={`Delivered: ${valueAndPercent(delivered, sent)}`}
              details={`${valueAndPercent(failed, sent)} Bounced`}
            />
          )
        }
      },
      {
        header: 'Opened',
        id: 'opened',
        class: 'opaque',
        width: '13%',
        verticalAlign: 'center',
        hidden: isScheduled,
        render: ({ row }) => {
          const { executed_at, opened, delivered } = row

          if (!executed_at) {
            return null
          }

          if (hasPixelTracking(row)) {
            return (
              <StatsColumn
                title={`Opens: ${opened}`}
                details={`Email is opened ${pluralize('time', opened, true)}`}
              />
            )
          }

          return (
            <StatsColumn
              title={`Opened: ${valueAndPercent(opened, delivered)}`}
              details={`${opened} People have opened the email`}
            />
          )
        }
      },
      {
        header: 'Clicked',
        id: 'clicked',
        class: 'opaque',
        width: '13%',
        verticalAlign: 'center',
        hidden: isScheduled,
        render: ({ row }) => {
          const { executed_at, clicked, delivered } = row

          if (!executed_at) {
            return null
          }

          if (hasPixelTracking(row)) {
            return (
              <StatsColumn
                title={`Clicks: ${clicked}`}
                details={`Email is clicked ${pluralize('time', clicked, true)}`}
              />
            )
          }

          return (
            <StatsColumn
              title={`Clicked: ${valueAndPercent(clicked, delivered)}`}
              details={`${clicked} People have clicked the email`}
            />
          )
        }
      },
      {
        header: '',
        id: 'actions-th',
        class: 'actions',
        verticalAlign: 'center',
        width: '2rem',
        render: ({ row }) => (
          <Actions
            emailCampaign={row}
            reloadList={reloadList}
            reloadItem={reloadItem}
            isSent={!!row.executed_at}
          />
        )
      }
    ],
    [isScheduled, reloadItem, reloadList]
  )

  const renderContent = ({ sortBy, onChangeSort }) => {
    if (isLoading) {
      return <LoadingComponent />
    }

    if (hasError) {
      return <EmailInsightsZeroState />
    }

    return (
      <Table
        virtualize
        rows={list}
        totalRows={list.length}
        columns={columns}
        EmptyStateComponent={() => <EmailInsightsZeroState />}
        sorting={{
          sortBy: {
            value: sortBy.value,
            ascending: sortBy.ascending
          },
          onChange: onChangeSort
        }}
        classes={{
          row: classNames(gridClasses.row, customGridClasses.row)
        }}
      />
    )
  }

  return (
    <Layout
      sentCount={counts.sent}
      scheduledCount={counts.scheduled}
      onCreateEmail={reloadList}
      renderContent={props => renderContent(props)}
    />
  )
}
