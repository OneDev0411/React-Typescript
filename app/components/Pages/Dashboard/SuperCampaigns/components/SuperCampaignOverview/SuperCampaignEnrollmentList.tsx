import { Dispatch, SetStateAction } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'
import SuperCampaignEnrollManuallyButton from '../SuperCampaignEnrollManuallyButton'

import { isSuperCampaignEnrollmentOptedOut } from './helpers'
import SuperCampaignColumnPerson from './SuperCampaignColumnPerson'
import SuperCampaignEnrollmentListColumnActions from './SuperCampaignEnrollmentListColumnActions'
import SuperCampaignEnrollmentListColumnTags from './SuperCampaignEnrollmentListColumnTags'
import SuperCampaignListEmptyState from './SuperCampaignListEmptyState'
import SuperCampaignListLoadingState from './SuperCampaignListLoadingState'
import { useAddSuperCampaignEnrollment } from './use-add-super-campaign-enrollment'
import { useDeleteSuperCampaignEnrollment } from './use-delete-super-campaign-enrollment'
import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'
import { useUpdateSuperCampaignEnrollmentTags } from './use-update-super-campaign-enrollment-tags'

const useStyles = makeStyles(
  theme => ({
    row: { '&:hover $hide': { opacity: 1 } },
    hide: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'SuperCampaignEnrollmentList' }
)

interface SuperCampaignEnrollmentListProps {
  isLoading: boolean
  superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
}

function SuperCampaignEnrollmentList({
  isLoading,
  superCampaignEnrollments,
  setSuperCampaignEnrollments
}: SuperCampaignEnrollmentListProps) {
  const { superCampaign } = useSuperCampaignDetail()

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

  const addSuperCampaignEnrollment = useAddSuperCampaignEnrollment(
    superCampaign.id,
    setSuperCampaignEnrollments
  )

  const columns: TableColumn<ISuperCampaignEnrollment<'user_and_brand'>>[] = [
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

  return (
    <>
      <SuperCampaignEnrollManuallyButton
        superCampaignTags={superCampaign.tags}
        onEnroll={addSuperCampaignEnrollment}
      />
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
        loading={isLoading ? 'middle' : undefined}
        LoadingStateComponent={SuperCampaignListLoadingState}
        EmptyStateComponent={SuperCampaignListEmptyState}
      />
    </>
  )
}

export default SuperCampaignEnrollmentList
