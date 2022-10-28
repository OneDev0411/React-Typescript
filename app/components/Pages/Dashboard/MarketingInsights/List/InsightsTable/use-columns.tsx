import { Box } from '@material-ui/core'

import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { useInsightsContext } from '../../context/use-insights-context'

import { ActionsColumn } from './columns/ActionsColumn'
import { ClickedColumn } from './columns/ClickedColumn'
import { DeliveredColumn } from './columns/DeliveredColumn'
import { OpenedColumn } from './columns/OpenedColumn'
import { RecipientsColumn } from './columns/Recipients'
import { ThumbnailColumn } from './columns/ThumbnailColumn'
import { TitleColumn } from './columns/TitleColumn'

export function useColumns(
  refetch: () => void
): TableColumn<IEmailCampaign<'template'>>[] {
  const { status } = useInsightsContext()

  return [
    {
      id: 'thumb',
      header: '',
      width: '70px',
      render: ({ row }) => <ThumbnailColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Title" />,
      id: 'title-date',
      primary: true,
      width: status === 'scheduled' ? '85%' : '22%',
      accessor: row => row.due_at,
      render: ({ row }) => <TitleColumn item={row} reload={() => {}} />
    },
    {
      header: () => <HeaderColumn text="Recipients" />,
      id: 'recipients',
      width: '12%',
      hidden: status === 'scheduled',
      render: ({ row }) => <RecipientsColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Delivered" />,
      id: 'delivered',
      width: '16%',
      hidden: status === 'scheduled',
      render: ({ row }) => <DeliveredColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Opened" />,
      id: 'opened',
      width: '12%',
      hidden: status === 'scheduled',
      render: ({ row }) => <OpenedColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Clicked" />,
      id: 'clicked',
      width: '12%',
      hidden: status === 'scheduled',
      render: ({ row }) => <ClickedColumn item={row} />
    },
    {
      header: '',
      id: 'actions',
      width: '5%',
      render: ({ row }) => (
        <Box width="100%" textAlign="right">
          <ActionsColumn item={row} refetch={refetch} />
        </Box>
      )
    }
  ]
}
