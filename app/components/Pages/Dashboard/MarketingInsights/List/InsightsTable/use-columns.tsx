import { Box } from '@material-ui/core'

import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

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
      width: '27%',
      accessor: row => row.due_at,
      render: ({ row }) => <TitleColumn item={row} reload={() => {}} />
    },
    {
      header: () => <HeaderColumn text="Recipients" />,
      id: 'recipients',
      width: '12%',
      render: ({ row }) => <RecipientsColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Delivered" />,
      id: 'delivered',
      width: '12%',
      render: ({ row }) => <DeliveredColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Opened" />,
      id: 'opened',
      width: '12%',
      render: ({ row }) => <OpenedColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Clicked" />,
      id: 'clicked',
      width: '12%',
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
