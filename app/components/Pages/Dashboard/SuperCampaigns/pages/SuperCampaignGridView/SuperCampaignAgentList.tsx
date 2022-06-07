import { memo, useMemo, useState } from 'react'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import SuperCampaignPreviewDrawer, {
  useLoadExistingTags
} from '@app/views/components/SuperCampaignPreviewDrawer'

import { useGetMySuperCampaignsWithEnrollment } from '../../hooks/use-get-my-super-campaigns-with-enrollment'

import SuperCampaignAgentListColumnActions from './SuperCampaignAgentListColumnActions'
import SuperCampaignAgentListColumnCreatedBy from './SuperCampaignAgentListColumnCreatedBy'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'

function SuperCampaignAgentList() {
  const gridClasses = useGridStyles()

  // Load existing tags because useGetSuperCampaignInitialEmailTo which is called by
  // actions column needs it
  useLoadExistingTags()

  const { superCampaignsWithEnrollment, isLoading } =
    useGetMySuperCampaignsWithEnrollment()

  const [selectedSuperCampaignId, setSelectedSuperCampaignId] =
    useState<Nullable<UUID>>(null)

  const selectedSuperCampaign = useMemo<
    Optional<ISuperCampaignWithEnrollment>
  >(() => {
    if (!selectedSuperCampaignId) {
      return
    }

    return superCampaignsWithEnrollment.find(
      superCampaignWithEnrollment =>
        superCampaignWithEnrollment.id === selectedSuperCampaignId
    )
  }, [selectedSuperCampaignId, superCampaignsWithEnrollment])

  const openPreviewDrawer = (superCampaign: ISuperCampaignWithEnrollment) =>
    setSelectedSuperCampaignId(superCampaign.id)

  const closePreviewDrawer = () => setSelectedSuperCampaignId(null)

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
          onParticipateClick={() => setSelectedSuperCampaignId(row.id)}
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
          hasUnenroll={!!selectedSuperCampaign.enrollment}
          initialSelectedTags={selectedSuperCampaign.enrollment?.tags}
        />
      )}
    </>
  )
}

export default memo(SuperCampaignAgentList)
