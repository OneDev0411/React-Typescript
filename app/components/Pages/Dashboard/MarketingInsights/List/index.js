import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import pluralize from 'pluralize'
import classNames from 'classnames'

import Table from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import NoSearchResults from '../../../../Partials/no-search-results'

import Layout from './Layout'
import Actions from './MarketingInsightsActions'
import ThumbnailColumn from './Column/Thumbnail'
import TitleColumn from './Column/Title'
import RecipientsColumn from './Column/Recipients'
import StatsColumn from './Column/Stats'
import { InsightContainer } from './styled'
import useListData from './useListData'
import { InsightFilterType } from './types'
import { valueAndPercent, hasPixelTracking } from './helpers'

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

function List(props) {
  const customGridClasses = useCustomGridStyles()
  const gridClasses = useGridStyles()

  const isScheduled = props.route && props.route.path === 'scheduled'
  const filterType = isScheduled
    ? InsightFilterType.SCHEDULED
    : InsightFilterType.SENT

  const {
    isLoading,
    hasError,
    list,
    counts,
    reloadList,
    reloadItem
  } = useListData(props.user, filterType)

  useEffect(() => {
    window.socket.on('email_campaign:send', () => reloadList())
    // TODO: Shouldn't we simply remove the event listener on component unmounting?
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'Thumbnail',
        id: 'thumbnail',
        class: 'opaque',
        width: 70,
        verticalAlign: 'center',
        render: ({ row }) => <ThumbnailColumn data={row} />
      },
      {
        header: 'Title',
        id: 'title-date',
        primary: true,
        width: '32%',
        verticalAlign: 'center',
        accessor: row => row.due_at,
        render: ({ row }) => (
          <TitleColumn data={row} reloadList={() => reloadList()} />
        )
      },
      {
        header: 'Recipients',
        id: 'recipients',
        class: 'opaque',
        width: '26%',
        verticalAlign: 'center',
        render: ({ row }) => <RecipientsColumn data={row} />
      },
      {
        header: 'Delivered',
        id: 'delivered',
        class: 'opaque',
        width: '14%',
        verticalAlign: 'center',
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
        width: '14%',
        verticalAlign: 'center',
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
        width: '14%',
        verticalAlign: 'center',
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
            reloadList={() => reloadList()}
            reloadItem={emailCampaignId => reloadItem(emailCampaignId)}
            isSent={!!row.executed_at}
          />
        )
      }
    ],
    []
  )

  const renderContent = ({ sortBy, onChangeSort }) => {
    if (isLoading) {
      return <LoadingComponent />
    }

    if (hasError) {
      return (
        <NoSearchResults description='Try sending your first campaign using "Create" button and click on "Email".' />
      )
    }

    return (
      <Table
        rows={list}
        totalRows={list.length}
        columns={columns}
        EmptyStateComponent={() => (
          <NoSearchResults description='Try sending your first campaign using "Create" button and click on "Email".' />
        )}
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
      onCreateEmail={() => reloadList()}
      renderContent={props => (
        <InsightContainer>{renderContent(props)}</InsightContainer>
      )}
    />
  )
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(List)
