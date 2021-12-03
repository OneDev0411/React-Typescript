import { memo, useState } from 'react'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import { useGetMySuperCampaignsWithEnrollment } from '@app/hooks/use-get-my-super-campaigns-with-enrollment'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import SuperCampaignPreviewDrawer from '@app/views/components/SuperCampaignPreviewDrawer'

import SuperCampaignAgentListColumnActions from './SuperCampaignAgentListColumnActions'
import SuperCampaignAgentListColumnCreatedBy from './SuperCampaignAgentListColumnCreatedBy'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'

function SuperCampaignAgentList() {
  const gridClasses = useGridStyles()
  const {
    superCampaignsWithEnrollment,
    isLoading,
    enrollToSuperCampaign,
    unenrollFromSuperCampaign
  } = useGetMySuperCampaignsWithEnrollment()

  const [selectedSuperCampaign, setSelectedSuperCampaign] =
    useState<Nullable<ISuperCampaignWithEnrollment>>(null)

  const openPreviewDrawer = (superCampaign: ISuperCampaignWithEnrollment) =>
    setSelectedSuperCampaign(superCampaign)

  const closePreviewDrawer = () => setSelectedSuperCampaign(null)

  const handleEnroll = (enrollment: ISuperCampaignEnrollment) => {
    if (!selectedSuperCampaign) {
      return
    }

    enrollToSuperCampaign(selectedSuperCampaign.id, enrollment)
  }

  const handleUnenroll = () => {
    if (!selectedSuperCampaign) {
      return
    }

    unenrollFromSuperCampaign(selectedSuperCampaign.id)
  }

  const columns: TableColumn<ISuperCampaignWithEnrollment>[] = [
    {
      id: 'subject',
      primary: true,
      width: '30%',
      render: ({ row }) => (
        <SuperCampaignListColumnSubject
          subject={row.subject}
          dueAt={row.due_at}
        />
      )
    },
    {
      id: 'created_by',
      width: '20%',
      render: ({ row }) => (
        <SuperCampaignAgentListColumnCreatedBy user={row.created_by} />
      )
    },
    {
      id: 'tags',
      width: '25%',
      render: ({ row }) =>
        row.enrollment && (
          <SuperCampaignListColumnTags
            label="Recipients Tags"
            tags={row.enrollment.tags}
          />
        )
    },
    {
      id: 'actions',
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignAgentListColumnActions
          superCampaign={row}
          onParticipateClick={() => setSelectedSuperCampaign(row)}
          onNotify={() => console.log('onNotify')}
          onDuplicate={() => console.log('onDuplicate')}
          onUnenroll={() => unenrollFromSuperCampaign(row.id)}
        />
      )
    }
  ]

  return (
    <>
      <Table
        rows={superCampaignsWithEnrollment}
        totalRows={superCampaignsWithEnrollment.length}
        columns={columns}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={LoadingComponent}
        getTrProps={() => ({
          className: gridClasses.row
        })}
        getTdProps={({ column, row }) => ({
          onClick: () => {
            if (column.id !== 'actions') {
              openPreviewDrawer(row)
            }
          }
        })}
        EmptyStateComponent={() => (
          <EmailInsightsZeroState title="There are no campaigns" />
        )}
      />
      {selectedSuperCampaign && (
        <SuperCampaignPreviewDrawer
          open
          onClose={closePreviewDrawer}
          superCampaign={selectedSuperCampaign}
          onEnroll={handleEnroll}
          onUnenroll={handleUnenroll}
          hasUnenroll={!!selectedSuperCampaign?.enrollment}
        />
      )}
    </>
  )
}

export default memo(SuperCampaignAgentList)
