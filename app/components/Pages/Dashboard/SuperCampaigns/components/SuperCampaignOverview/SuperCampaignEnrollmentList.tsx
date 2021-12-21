import { Dispatch, SetStateAction } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { isSuperCampaignDueAtTimeout } from '../../helpers'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { isSuperCampaignEnrollmentOptedOut } from './helpers'
import SuperCampaignColumnPerson from './SuperCampaignColumnPerson'
import SuperCampaignEnrollmentListColumnActions from './SuperCampaignEnrollmentListColumnActions'
import SuperCampaignEnrollmentListColumnTags from './SuperCampaignEnrollmentListColumnTags'
import SuperCampaignListEmptyState from './SuperCampaignListEmptyState'
import SuperCampaignListLoadingState from './SuperCampaignListLoadingState'
import { useDeleteSuperCampaignEnrollment } from './use-delete-super-campaign-enrollment'
import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'
import { useUpdateSuperCampaignEnrollmentTags } from './use-update-super-campaign-enrollment-tags'

const useStyles = makeStyles(
  theme => ({
    row: { '&:hover $hide': { opacity: 1 } },
    hide: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    },
    tags: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }),
  { name: 'SuperCampaignEnrollmentList' }
)

interface SuperCampaignEnrollmentListProps {
  isLoading: boolean
  superCampaignEnrollments: ISuperCampaignEnrollment<'user' | 'brand'>[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user' | 'brand'>[]>
  >
}

function SuperCampaignEnrollmentList({
  isLoading,
  superCampaignEnrollments,
  setSuperCampaignEnrollments
}: SuperCampaignEnrollmentListProps) {
  const { superCampaign } = useSuperCampaignDetail()
  const isCampaignDueAtTimeout = isSuperCampaignDueAtTimeout(superCampaign)

  const classes = useStyles()
  const listClasses = useSuperCampaignListStyles()

  const updateSuperCampaignEnrollmentTags =
    useUpdateSuperCampaignEnrollmentTags(
      superCampaign.id,
      superCampaignEnrollments,
      setSuperCampaignEnrollments
    )

  const deleteSuperCampaignEnrollment = useDeleteSuperCampaignEnrollment(
    superCampaign.id,
    superCampaignEnrollments,
    setSuperCampaignEnrollments
  )

  const columns: TableColumn<ISuperCampaignEnrollment<'user' | 'brand'>>[] = [
    {
      id: 'person',
      width: '35%',
      sortable: false,
      render: ({ row }) => (
        <SuperCampaignColumnPerson
          isOptedOut={isSuperCampaignEnrollmentOptedOut(row)}
          user={row.user}
          brand={row.brand}
        />
      )
    },
    {
      id: 'tags',
      width: '45%',
      sortable: false,
      class: classes.tags,
      render: ({ row }) => (
        <SuperCampaignEnrollmentListColumnTags
          isOptedOut={isSuperCampaignEnrollmentOptedOut(row)}
          tags={row.tags}
          onTagsChange={tags => updateSuperCampaignEnrollmentTags(row.id, tags)}
        />
      )
    },
    {
      id: 'actions',
      width: '20%',
      align: 'right',
      sortable: false,
      render: ({ row }) => {
        const isOptedOut = isSuperCampaignEnrollmentOptedOut(row)

        return (
          <SuperCampaignEnrollmentListColumnActions
            className={!isOptedOut ? classes.hide : undefined}
            isOptedOut={isOptedOut}
            onDelete={() => deleteSuperCampaignEnrollment(row.id)}
          />
        )
      }
    }
  ]

  if (isCampaignDueAtTimeout) {
    return <SuperCampaignListLoadingState />
  }

  return (
    <>
      <Table
        columns={columns}
        rows={superCampaignEnrollments}
        totalRows={superCampaignEnrollments.length}
        rowSize={5}
        getTrProps={() => ({
          className: classNames(
            classes.row,
            listClasses.row,
            listClasses.rowBorderTop
          )
        })}
        loading={
          isLoading
            ? superCampaignEnrollments.length === 0
              ? 'static'
              : 'top'
            : undefined
        }
        LoadingStateComponent={SuperCampaignListLoadingState}
        EmptyStateComponent={SuperCampaignListEmptyState}
      />
    </>
  )
}

export default SuperCampaignEnrollmentList
