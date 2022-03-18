import { makeStyles, Theme } from '@material-ui/core'
import {
  mdiCake,
  mdiCalendar,
  mdiEmail,
  mdiFlash,
  mdiPhone,
  mdiTag
} from '@mdi/js'

import { useBreakpoint } from '@app/hooks/use-breakpoint'
import { getAttributeFromSummary } from '@app/models/contacts/helpers'
import ALink from '@app/views/components/ALink'
import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { TagsInlineEdit } from './columns-inline-edit/Tags'
import LastTouched from './columns/LastTouched'
import { SelectedRowsCount } from './columns/SelectedRowsCount'

const useStyles = makeStyles(
  (theme: Theme) => ({
    cell: {
      paddingLeft: theme.spacing(2)
    }
  }),
  {
    name: 'Contacts-Table-Columns'
  }
)

interface Data {
  totalRows: number
}

export function useColumns({ totalRows }: Data): TableColumn<IContact>[] {
  const classes = useStyles()
  const breakpoint = useBreakpoint()

  return [
    {
      id: 'name',
      header: () => <SelectedRowsCount totalRows={totalRows} />,
      render: ({ row: contact }) => (
        <ALink to={`/dashboard/contacts/${contact.id}`}>
          {getAttributeFromSummary(contact, 'display_name')}
        </ALink>
      )
    },
    {
      id: 'tags',
      hidden: ['xs', 'sm'].includes(breakpoint),
      header: () => <HeaderColumn text="Tags" iconPath={mdiTag} />,
      render: ({ row: contact }) => (
        <span className={classes.cell}>
          {contact.tags?.slice(0, 2).join(', ')}
        </span>
      ),
      renderInlineEdit: ({ row: contact }) => (
        <TagsInlineEdit contact={contact} />
      )
    },
    {
      id: 'phone',
      header: () => <HeaderColumn text="Phone" iconPath={mdiPhone} />,
      render: ({ row: contact }) => (
        <span className={classes.cell}>{contact.phone_number}</span>
      ),
      renderInlineEdit: ({ row: contact }) => <div>11</div>
    },
    {
      id: 'email',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Email" iconPath={mdiEmail} />,
      render: ({ row: contact }) => (
        <span className={classes.cell}>{contact.email}</span>
      ),
      renderInlineEdit: ({ row: contact }) => <div>22</div>
    },
    {
      id: 'last-touch',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Last Touch" iconPath={mdiCalendar} />,
      render: ({ row: contact }) => (
        <span className={classes.cell}>
          <LastTouched contact={contact} title="" />
        </span>
      )
    },
    {
      id: 'flows',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Flows" iconPath={mdiFlash} />,
      render: ({ row: contact }) => <span>-</span>
    },
    {
      id: 'birthday',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Birthday" iconPath={mdiCake} />,
      render: ({ row: contact }) => <span>-</span>
    }
  ]
}
