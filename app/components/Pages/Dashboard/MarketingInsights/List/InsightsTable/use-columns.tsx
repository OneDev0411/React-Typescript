import { Box } from '@material-ui/core'

import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { ActionsColumn } from './columns/ActionsColumn'
import { ClickedColumn } from './columns/ClickedColumn'
import { DeliveredColumn } from './columns/DeliveredColumn'
import { OpenedColumn } from './columns/OpenedColumn'
import { RecipientsColumn } from './columns/Recipients'
import { TitleColumn } from './columns/TitleColumn'

export function useColumns(): TableColumn<IEmailCampaign<'template'>>[] {
  return [
    {
      header: () => <HeaderColumn text="Title" />,
      id: 'title-date',
      primary: true,
      width: '35vw',
      accessor: row => row.due_at,
      render: ({ row }) => <TitleColumn item={row} reload={() => {}} />
    },
    {
      header: () => <HeaderColumn text="Recipients" />,
      id: 'recipients',
      width: '10vw',
      render: ({ row }) => <RecipientsColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Delivered" />,
      id: 'delivered',
      width: '10vw',
      render: ({ row }) => <DeliveredColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Opened" />,
      id: 'opened',
      width: '10vw',
      render: ({ row }) => <OpenedColumn item={row} />
    },
    {
      header: () => <HeaderColumn text="Clicked" />,
      id: 'clicked',
      width: '10vw',
      render: ({ row }) => <ClickedColumn item={row} />
    },
    {
      header: '',
      id: 'actions',
      width: '5vw',
      render: ({ row }) => (
        <Box width="100%" textAlign="right">
          <ActionsColumn
            item={row}
            reloadItem={() => {}}
            reloadList={() => {}}
          />
        </Box>
      )
    }
  ]
}
