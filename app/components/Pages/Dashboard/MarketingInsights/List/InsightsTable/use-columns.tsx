import { TableColumn } from '@app/views/components/Grid/Table/types'

import { DeliveredStatsColumn } from './columns/DeliveredStatsColumn'
import { RecipientsColumn } from './columns/Recipients'
import { TitleColumn } from './columns/TitleColumn'

export function useColumns(): TableColumn<IEmailCampaign<'template'>>[] {
  return [
    {
      header: 'Title',
      id: 'title-date',
      primary: true,
      // width: isScheduled ? '100%' : '38%',
      width: '50%',
      accessor: row => row.due_at,
      render: ({ row }) => <TitleColumn item={row} reload={() => {}} />
    },
    {
      header: 'Recipients',
      id: 'recipients',
      width: '25%',
      render: ({ row }) => <RecipientsColumn item={row} />
    },
    {
      header: 'Delivered',
      id: 'delivered',
      width: '25%',
      render: ({ row }) => <DeliveredStatsColumn item={row} />
    }
  ]
}
