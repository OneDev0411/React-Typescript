import { RefObject } from 'react'

import { Typography, makeStyles, Theme, Tooltip, Link } from '@material-ui/core'
import {
  mdiAccountArrowLeft,
  mdiCake,
  mdiCalendar,
  mdiEmail,
  mdiFlash,
  mdiHomeCityOutline,
  mdiHomeOutline,
  mdiPhone,
  mdiTag
} from '@mdi/js'
import { useDispatch } from 'react-redux'

import { ACL } from '@app/constants/acl'
import {
  getAttributeFromSummary,
  updateContactQuery as defaultUpdateContactQuery
} from '@app/models/contacts/helpers'
import { getContact } from '@app/store_actions/contacts/get-contact'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { SelectionCount } from '@app/views/components/Grid/Table/features/Selection/SelectionCount'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { AssigneesInlineEdit } from './columns-inline-edit/Assignees'
import { EmailsInlineEdit } from './columns-inline-edit/Emails'
import { FlowsInlineEdit } from './columns-inline-edit/Flows'
import { PhonesInlineEdit } from './columns-inline-edit/Phones'
import { TagsInlineEdit } from './columns-inline-edit/Tags'
import { TriggerableInlineEdit } from './columns-inline-edit/Triggerable'
import { AssigneesCell } from './columns/Assignees'
import { BirthdayCell } from './columns/Birthday'
import { EmailsCell } from './columns/Emails'
import { FlowsCell } from './columns/Flows'
import { HomeAnniversary } from './columns/HomeAnniversary'
import LastTouch from './columns/LastTouch'
import NextTouch from './columns/NextTouch'
import { PhonesCell } from './columns/Phones'
import { TagsCell } from './columns/Tags'

const useStyles = makeStyles(
  (theme: Theme) => ({
    cell: {
      width: '100%',
      padding: theme.spacing(0, 1, 0, 0),
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
  onOpenContact: (id: UUID) => void
  totalRows: number
  tableContainerRef?: RefObject<HTMLDivElement>
}

export function useColumns({
  onOpenContact,
  totalRows,
  tableContainerRef
}: Data): TableColumn<IContact>[] {
  const hasLeadAssignmentAccess = useAcl(ACL.LEAD_ASSIGNMENT)
  const classes = useStyles()
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
      width: '250px',
      header: () => <SelectionCount totalRows={totalRows} />,
      render: ({ row: contact }) => (
        <Link
          className={classes.cellName}
          onClick={() => {
            onOpenContact(contact.id)
          }}
        >
          <Typography noWrap variant="inherit">
            {getAttributeFromSummary(contact, 'display_name')}
          </Typography>
        </Link>
      )
    },
    {
      id: 'email',
      width: '250px',
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
      id: 'phone',
      width: '180px',
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
      id: 'tags',
      width: '200px',
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
      id: 'last-touch',
      width: '150px',
      header: () => <HeaderColumn text="Last Touch" iconPath={mdiCalendar} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <LastTouch contact={contact} />
        </div>
      )
    },
    {
      id: 'next-touch',
      width: '150px',
      header: () => <HeaderColumn text="Next Touch" iconPath={mdiCalendar} />,
      render: ({ row: contact }) => {
        return (
          <div className={classes.cell}>
            <NextTouch contact={contact} />
          </div>
        )
      }
    },
    {
      id: 'flows',
      width: '150px',
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
      width: '180px',
      header: () => <HeaderColumn text="Birthday" iconPath={mdiCake} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <BirthdayCell contact={contact} />
        </div>
      ),
      inlineEditProps: {
        disableEnforceFocus: true,
        container: tableContainerRef?.current
      },
      renderInlineEdit: ({ row: contact }, close) => (
        <TriggerableInlineEdit
          attributeName="birthday"
          contact={contact}
          callback={handleReloadContact}
          close={close}
        />
      )
    },
    ...(hasLeadAssignmentAccess
      ? [
          {
            id: 'assignees',
            width: '160px',
            header: () => (
              <HeaderColumn text="Assignees" iconPath={mdiAccountArrowLeft} />
            ),
            render: ({ row: contact }) => {
              return (
                <div className={classes.cell}>
                  <AssigneesCell assignees={contact.assignees || []} />
                </div>
              )
            },
            renderInlineEdit: (
              { row: contact }: any,
              close: (() => void) | undefined
            ) => (
              <AssigneesInlineEdit
                contact={contact}
                callback={handleReloadContact}
                close={close}
              />
            )
          }
        ]
      : []),
    {
      id: 'home-anniversary',
      width: '190px',
      header: () => (
        <HeaderColumn text="Home Anniversary" iconPath={mdiHomeOutline} />
      ),
      render: ({ row: contact }) => (
        <HomeAnniversary contact={contact} className={classes.cell} />
      ),
      inlineEditProps: {
        disableEnforceFocus: true,
        container: tableContainerRef?.current
      },
      renderInlineEdit: ({ row: contact }, close) => (
        <TriggerableInlineEdit
          attributeName="home_anniversary"
          contact={contact}
          callback={handleReloadContact}
          close={close}
        />
      )
    },
    {
      id: 'address',
      width: '200px',
      header: () => (
        <HeaderColumn text="Address" iconPath={mdiHomeCityOutline} />
      ),
      render: ({ row: contact }) => {
        const address = contact.address?.[0].full ?? ''

        return (
          <div className={classes.cell}>
            <Tooltip title={address}>
              <span>{address}</span>
            </Tooltip>
          </div>
        )
      }
    }
  ]
}
