import {
  mdiAccountArrowLeft,
  mdiCalendarOutline,
  mdiContactsOutline,
  mdiFormatListBulleted,
  mdiOfficeBuildingOutline
} from '@mdi/js'

import { useBreakpoint } from '@app/hooks/use-breakpoint'
import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { useTasksListContext } from '../context/use-tasks-list-context'
import type { ITask } from '../types'

import { AssigneeCell } from './columns/AssigneeCell'
import { ContactsCell } from './columns/ContactsCell'
import { DueDateCell } from './columns/DueDateCell'
import { PropertyDealCell } from './columns/PropertyDealCell'
import { StatusButtonCell } from './columns/StatusButtonCell'
import { TaskTypeCell } from './columns/TaskTypeCell'
import { TitleCell } from './columns/TitleCell'
import { InlineAssigneeCell } from './inline-columns/InlineAssigneeCell'
import { InlineAssociationCell } from './inline-columns/InlineAssociationCell'
import { InlineContactsCell } from './inline-columns/InlineContactsCell'
import { InlineDueDateCell } from './inline-columns/InlineDueDateCell'
import { InlineTitleCell } from './inline-columns/InlineTitleCell'
import { InlineTypeCell } from './inline-columns/InlineTypeCell'

export function useColumns(): TableColumn<ITask>[] {
  const { sortBy, setSortBy } = useTasksListContext()
  const breakpoint = useBreakpoint()

  const getSortOrder = (column: string) =>
    sortBy.includes(column)
      ? sortBy.startsWith('-')
        ? 'desc'
        : 'asc'
      : undefined

  const getNextSort = (column: string) =>
    sortBy === column && !sortBy.startsWith('-') ? `-${column}` : column

  return [
    {
      id: 'status',
      width: '70px',
      header: '',
      headerStyle: {
        borderRight: 'none'
      },
      rowStyle: {
        borderRight: 'none'
      },
      render: ({ row: task }) => <StatusButtonCell task={task} />
    },
    {
      id: 'title',
      header: () => (
        <HeaderColumn
          text="Task"
          sortOrder={getSortOrder('created_at')}
          onClick={() => setSortBy(getNextSort('created_at'))}
        />
      ),
      inlineEditStyles: {
        container: () => ({
          border: 'none'
        }),
        paper: {
          boxShadow: 'none'
        }
      },
      render: ({ row: task }) => (
        <TitleCell title={task.title} status={task.status} />
      ),
      renderInlineEdit: ({ row: task }, close) => (
        <InlineTitleCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'contacts',
      header: () => (
        <HeaderColumn text="Contacts" iconPath={mdiContactsOutline} />
      ),
      width: '18%',
      inlineEditStyles: {
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      render: ({ row: task }) => <ContactsCell task={task} />,
      renderInlineEdit: ({ row: task }, close) => (
        <InlineContactsCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'due-date',
      width: '15%',
      header: () => (
        <HeaderColumn
          text="Due Date"
          iconPath={mdiCalendarOutline}
          sortOrder={getSortOrder('due_date')}
          onClick={() => setSortBy(getNextSort('due_date'))}
        />
      ),
      render: ({ row: task }) => <DueDateCell task={task} />,
      inlineEditStyles: {
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      renderInlineEdit: ({ row: task }, close) => (
        <InlineDueDateCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'type',
      width: '12%',
      hidden: ['xs', 'sm'].includes(breakpoint),
      header: () => (
        <HeaderColumn text="Type" iconPath={mdiFormatListBulleted} />
      ),
      inlineEditStyles: {
        container: () => ({
          border: 'none'
        }),
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      render: ({ row: task }) => <TaskTypeCell task={task} />,
      renderInlineEdit: ({ row: task }, close) => (
        <InlineTypeCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'assignees',
      width: '10%',
      header: () => (
        <HeaderColumn text="Assignees" iconPath={mdiAccountArrowLeft} />
      ),
      inlineEditStyles: {
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      render: ({ row: task }) => <AssigneeCell assignees={task.assignees} />,
      renderInlineEdit: ({ row: task }, close) => (
        <InlineAssigneeCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'property-deal',
      width: '20%',
      hidden: ['xs', 'sm'].includes(breakpoint),
      header: () => (
        <HeaderColumn
          text="Property & Deal"
          iconPath={mdiOfficeBuildingOutline}
        />
      ),
      render: ({ row: task }) => <PropertyDealCell task={task} />,
      renderInlineEdit: ({ row: task }) => {
        return <InlineAssociationCell task={task} />
      }
    }
  ]
}
