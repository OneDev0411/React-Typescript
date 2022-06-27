import {
  mdiAccountArrowLeft,
  mdiCalendarOutline,
  mdiContactsOutline,
  mdiFormatListBulleted,
  mdiOfficeBuildingOutline,
  mdiSortAscending,
  mdiSortDescending
} from '@mdi/js'

import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

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

interface Options {
  activeSort: string
  onChangeSort: (value: string) => void
}

export function useColumns({
  activeSort,
  onChangeSort
}: Options): TableColumn<ITask>[] {
  return [
    {
      id: 'status',
      width: '50px',
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
          sortIconPath={
            activeSort.includes('created_at')
              ? activeSort.startsWith('-')
                ? mdiSortDescending
                : mdiSortAscending
              : undefined
          }
          onClick={() =>
            onChangeSort(
              activeSort === 'created_at' && !activeSort.startsWith('-')
                ? '-created_at'
                : 'created_at'
            )
          }
        />
      ),
      width: '300px',
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
      width: '200px',
      inlineEditStyles: {
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      render: ({ row: task }) => (
        <ContactsCell
          contactAssociations={task.associations?.filter(
            association => association.association_type === 'contact'
          )}
        />
      ),
      renderInlineEdit: ({ row: task }, close) => (
        <InlineContactsCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'due-date',
      width: '200px',
      header: () => (
        <HeaderColumn
          text="Due Date"
          iconPath={mdiCalendarOutline}
          sortIconPath={
            activeSort.includes('due_date')
              ? activeSort.startsWith('-')
                ? mdiSortDescending
                : mdiSortAscending
              : undefined
          }
          onClick={() =>
            onChangeSort(
              activeSort === 'due_date' && !activeSort.startsWith('-')
                ? '-due_date'
                : 'due_date'
            )
          }
        />
      ),
      render: ({ row: task }) => <DueDateCell dueDate={task.due_date} />,
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
      width: '180px',
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
      render: ({ row: task }) => <TaskTypeCell type={task.task_type} />,
      renderInlineEdit: ({ row: task }, close) => (
        <InlineTypeCell task={task} closeHandler={close} />
      )
    },
    {
      id: 'assignees',
      width: '150px',
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
      header: () => (
        <HeaderColumn
          text="Property & Deal"
          iconPath={mdiOfficeBuildingOutline}
        />
      ),
      render: ({ row: task }) => (
        <PropertyDealCell
          associations={task.associations?.filter(association =>
            ['listing', 'deal'].includes(association.association_type)
          )}
        />
      ),
      renderInlineEdit: ({ row: task }) => {
        return <InlineAssociationCell task={task} />
      }
    }
  ]
}
