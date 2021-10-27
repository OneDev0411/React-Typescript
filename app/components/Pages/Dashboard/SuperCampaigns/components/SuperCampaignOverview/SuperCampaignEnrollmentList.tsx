import { makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { isSuperCampaignEnrollmentOptedOut } from './helpers'
import SuperCampaignEnrollManuallyButton from './SuperCampaignEnrollManuallyButton'
import SuperCampaignEnrollmentListColumnActions from './SuperCampaignEnrollmentListColumnActions'
import SuperCampaignEnrollmentListColumnPerson from './SuperCampaignEnrollmentListColumnPerson'
import SuperCampaignEnrollmentListColumnTags from './SuperCampaignEnrollmentListColumnTags'
import { useDeleteSuperCampaignEnrollment } from './use-delete-super-campaign-enrollment'
import { useGetSuperCampaignEnrollments } from './use-get-super-campaign-enrollments'
import { useUpdateSuperCampaignEnrollmentTags } from './use-update-super-campaign-enrollment-tags'

const useStyles = makeStyles(
  theme => ({
    row: {
      borderTop: `1px solid ${theme.palette.grey[100]}`,
      paddingRight: theme.spacing(0.5)
    }
  }),
  { name: 'SuperCampaignEnrollmentList' }
)

interface SuperCampaignEnrollmentListProps {
  superCampaignId: UUID
}

function SuperCampaignEnrollmentList({
  superCampaignId
}: SuperCampaignEnrollmentListProps) {
  const classes = useStyles()

  const { superCampaignEnrollments, setSuperCampaignEnrollments } =
    useGetSuperCampaignEnrollments(superCampaignId)

  console.log('superCampaignEnrollments', superCampaignEnrollments)

  const updateSuperCampaignEnrollmentTags =
    useUpdateSuperCampaignEnrollmentTags(
      superCampaignId,
      superCampaignEnrollments,
      setSuperCampaignEnrollments
    )

  const deleteSuperCampaignEnrollment = useDeleteSuperCampaignEnrollment(
    setSuperCampaignEnrollments
  )

  const columns: TableColumn<ISuperCampaignEnrollment<'user_and_brand'>>[] = [
    {
      id: 'person',
      width: '35%',
      sortable: false,
      render: ({ row }) => (
        <SuperCampaignEnrollmentListColumnPerson
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
      <SuperCampaignEnrollManuallyButton />
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
