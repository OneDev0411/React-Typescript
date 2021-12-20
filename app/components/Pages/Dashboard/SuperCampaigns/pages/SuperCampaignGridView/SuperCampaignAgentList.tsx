import { memo, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import { useGetMySuperCampaignsWithEnrollment } from '@app/hooks/use-get-my-super-campaigns-with-enrollment'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import SuperCampaignPreviewDrawer from '@app/views/components/SuperCampaignPreviewDrawer'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'

import SuperCampaignAgentListColumnActions from './SuperCampaignAgentListColumnActions'
import SuperCampaignAgentListColumnCreatedBy from './SuperCampaignAgentListColumnCreatedBy'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'

function SuperCampaignAgentList() {
  const gridClasses = useGridStyles()
  const dispatch = useDispatch()

  // Load existing tags because the actions component needs it
  useEffectOnce(() => {
    dispatch(getContactsTags())
  })

  const {
    superCampaignsWithEnrollment,
    isLoading,
    enrollToSuperCampaign,
    unenrollFromSuperCampaign
  } = useGetMySuperCampaignsWithEnrollment()

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

  const handleEnroll = (enrollment: ISuperCampaignEnrollment) => {
    if (!selectedSuperCampaignId) {
      return
    }

    enrollToSuperCampaign(selectedSuperCampaignId, enrollment)
  }

  const handleUnenroll = () => {
    if (!selectedSuperCampaignId) {
      return
    }

    unenrollFromSuperCampaign(selectedSuperCampaignId)
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
          onParticipateClick={() => setSelectedSuperCampaignId(row.id)}
          onNotify={() => console.log('onNotify')} // TODO: implement this when the API is ready
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
          hasUnenroll={!!selectedSuperCampaign.enrollment}
          initialSelectedTags={selectedSuperCampaign.enrollment?.tags}
        />
      )}
    </>
  )
}

export default memo(SuperCampaignAgentList)
