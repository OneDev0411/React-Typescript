import { Dispatch, SetStateAction } from 'react'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import SuperCampaignEnrollManuallyButton from '../SuperCampaignEnrollManuallyButton'

import { isSuperCampaignEnrollmentOptedOut } from './helpers'
import SuperCampaignColumnPerson from './SuperCampaignColumnPerson'
import SuperCampaignEnrollmentListColumnActions from './SuperCampaignEnrollmentListColumnActions'
import SuperCampaignEnrollmentListColumnTags from './SuperCampaignEnrollmentListColumnTags'
import { useAddSuperCampaignEnrollment } from './use-add-super-campaign-enrollment'
import { useDeleteSuperCampaignEnrollment } from './use-delete-super-campaign-enrollment'
import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'
import { useUpdateSuperCampaignEnrollmentTags } from './use-update-super-campaign-enrollment-tags'

interface SuperCampaignEnrollmentListProps {
  superCampaignId: UUID
  superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
}

function SuperCampaignEnrollmentList({
  superCampaignId,
  superCampaignEnrollments,
  setSuperCampaignEnrollments
}: SuperCampaignEnrollmentListProps) {
  const classes = useSuperCampaignListStyles()

  const updateSuperCampaignEnrollmentTags =
    useUpdateSuperCampaignEnrollmentTags(
      superCampaignId,
      superCampaignEnrollments,
      setSuperCampaignEnrollments
    )

  const deleteSuperCampaignEnrollment = useDeleteSuperCampaignEnrollment(
    superCampaignId,
    superCampaignEnrollments,
    setSuperCampaignEnrollments
  )

  const addSuperCampaignEnrollment = useAddSuperCampaignEnrollment(
    superCampaignId,
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
      render: ({ row }) => (
        <SuperCampaignEnrollmentListColumnActions
          isOptedOut={isSuperCampaignEnrollmentOptedOut(row)}
          onDelete={() => deleteSuperCampaignEnrollment(row.id)}
        />
      )
    }
  ]

  return (
    <>
      <SuperCampaignEnrollManuallyButton
        superCampaignId={superCampaignId}
        onEnroll={addSuperCampaignEnrollment}
      />
      <Table
        columns={columns}
        rows={superCampaignEnrollments}
        totalRows={superCampaignEnrollments.length}
        rowSize={5}
        getTrProps={() => ({ className: classes.row })}
      />
    </>
  )
}

export default SuperCampaignEnrollmentList
