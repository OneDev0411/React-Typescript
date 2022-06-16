import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { AssigneeCell } from './columns/AssigneeCell'
import { ContactsCell } from './columns/ContactsCell'
import { DueDateCell } from './columns/DueDateCell'
import { PropertyDealCell } from './columns/PropertyDealCell'
import { StatusButtonCell } from './columns/StatusButtonCell'
import { TaskTypeCell } from './columns/TaskTypeCell'
import { TitleCell } from './columns/TitleCell'
import { InlineDueDateCell } from './inline-columns/InlineDueDateCell'
import { InlineTitleCell } from './inline-columns/InlineTitleCell'
import { InlineTypeCell } from './inline-columns/InlineTypeCell'

export function useColumns(): TableColumn<
  ICRMTask<'assignees' | 'associations', 'contact' | 'deal' | 'listing'>
>[] {
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
      render: ({ row: task }) => (
        <StatusButtonCell defaultStatus={task.status} />
      )
    },
    {
      id: 'title',
      header: () => <HeaderColumn text="Task" />,
      inlineEditStyles: {
        container: () => ({
          border: 'none'
        }),
        paper: {
          boxShadow: 'none'
        }
      },
      render: ({ row: task }) => <TitleCell title={task.title} />,
      renderInlineEdit: ({ row: task }, close) => (
        <InlineTitleCell defaultValue={task.title} closeHandler={close} />
      )
    },
    {
      id: 'contacts',
      header: () => <HeaderColumn text="Contacts" />,
      render: ({ row: task }) => (
        <ContactsCell
          contactAssociations={task.associations?.filter(
            association => association.association_type === 'contact'
          )}
        />
      ),
      renderInlineEdit: () => {
        return <div>--</div>
      }
    },
    {
      id: 'type',
      width: '180px',
      header: () => <HeaderColumn text="Type" />,
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
        <InlineTypeCell defaultValue={task.task_type} closeHandler={close} />
      )
    },
    {
      id: 'due-date',
      width: '200px',
      header: () => <HeaderColumn text="Due Date" />,
      render: ({ row: task }) => <DueDateCell dueDate={task.due_date} />,
      inlineEditStyles: {
        popover: ({ height }) => ({
          marginTop: height
        })
      },
      renderInlineEdit: ({ row: task }, close) => (
        <InlineDueDateCell defaultValue={task.due_date} closeHandler={close} />
      )
    },
    {
      id: 'assignee',
      width: '150px',
      header: () => <HeaderColumn text="Assignee" />,
      render: ({ row: task }) => <AssigneeCell assignees={task.assignees} />,
      renderInlineEdit: () => {
        return <div>--</div>
      }
    },
    {
      id: 'property-deal',
      header: () => <HeaderColumn text="Property & Deal" />,
      render: ({ row: task }) => (
        <PropertyDealCell
          associations={task.associations?.filter(association =>
            ['listing', 'deal'].includes(association.association_type)
          )}
        />
      ),
      renderInlineEdit: () => {
        return <div>-a-</div>
      }
    }
  ]
}
