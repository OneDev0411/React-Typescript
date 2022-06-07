import { Typography, makeStyles, Theme } from '@material-ui/core'
import {
  mdiCake,
  mdiCalendar,
  mdiEmail,
  mdiFlash,
  mdiPhone,
  mdiTag
} from '@mdi/js'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'

import { useBreakpoint } from '@app/hooks/use-breakpoint'
import {
  getAttributeFromSummary,
  updateContactQuery as defaultUpdateContactQuery
} from '@app/models/contacts/helpers'
import { getContact } from '@app/store_actions/contacts/get-contact'
import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { SelectionCount } from '@app/views/components/Grid/Table/features/Selection/SelectionCount'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { BirthdayInlineEdit } from './columns-inline-edit/Birthday'
import { EmailsInlineEdit } from './columns-inline-edit/Emails'
import { FlowsInlineEdit } from './columns-inline-edit/Flows'
import { PhonesInlineEdit } from './columns-inline-edit/Phones'
import { TagsInlineEdit } from './columns-inline-edit/Tags'
import { BirthdayCell } from './columns/Birthday'
import { EmailsCell } from './columns/Emails'
import { FlowsCell } from './columns/Flows'
import LastTouched from './columns/LastTouched'
import { PhonesCell } from './columns/Phones'
import { TagsCell } from './columns/Tags'

const useStyles = makeStyles(
  (theme: Theme) => ({
    cell: {
      width: '100%',
      padding: theme.spacing(0, 1, 0, 2),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    cellName: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    nameTitleButton: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
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
  const dispatch = useDispatch()

  const handleReloadContact = (contactId: UUID) => {
    const query = {
      associations: [...defaultUpdateContactQuery.associations, 'contact.flows']
    }

    dispatch(getContact(contactId, query))
  }

  return [
    {
      id: 'name',
      header: () => <SelectionCount totalRows={totalRows} />,
      render: ({ row: contact }) => (
        <Link
          className={classes.cellName}
          to={`/dashboard/contacts/${contact.id}`}
        >
          <Typography noWrap variant="inherit">
            {getAttributeFromSummary(contact, 'display_name')}
          </Typography>
        </Link>
      )
    },
    {
      id: 'tags',
      hidden: ['xs', 'sm'].includes(breakpoint),
      header: () => <HeaderColumn text="Tags" iconPath={mdiTag} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <TagsCell contact={contact} />
        </div>
      ),
      renderInlineEdit: ({ row: contact }, close) => (
        <TagsInlineEdit
          contact={contact}
          callback={handleReloadContact}
          close={close}
        />
      )
    },
    {
      id: 'phone',
      header: () => <HeaderColumn text="Phone" iconPath={mdiPhone} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <PhonesCell contact={contact} />
        </div>
      ),
      renderInlineEdit: ({ row: contact }) => (
        <PhonesInlineEdit contact={contact} callback={handleReloadContact} />
      )
    },
    {
      id: 'email',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Email" iconPath={mdiEmail} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <EmailsCell contact={contact} />
        </div>
      ),
      renderInlineEdit: ({ row: contact }) => (
        <EmailsInlineEdit contact={contact} callback={handleReloadContact} />
      )
    },
    {
      id: 'last-touch',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Last Touch" iconPath={mdiCalendar} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <LastTouched contact={contact} />
        </div>
      )
    },
    {
      id: 'flows',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Flows" iconPath={mdiFlash} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <FlowsCell
            count={Array.isArray(contact.flows) ? contact.flows.length : 0}
          />
        </div>
      ),
      renderInlineEdit: ({ row: contact }, close) => (
        <FlowsInlineEdit
          contact={contact}
          callback={handleReloadContact}
          close={close}
        />
      )
    },
    {
      id: 'birthday',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Birthday" iconPath={mdiCake} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <BirthdayCell contact={contact} />
        </div>
      ),
      renderInlineEdit: ({ row: contact }, close) => (
        <BirthdayInlineEdit
          contact={contact}
          callback={handleReloadContact}
          close={close}
        />
      )
    }
  ]
}
