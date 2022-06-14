import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { AssigneeCell } from './columns/AssigneeCell'
import { ContactsCell } from './columns/ContactsCell'
import { DueDateCell } from './columns/DueDateCell'
import { PropertyDealCell } from './columns/PropertyDealCell'
import { TaskTypeCell } from './columns/TaskTypeCell'

export function useColumns(): TableColumn<
  ICRMTask<'assignees' | 'associations', 'contact' | 'deal' | 'listing'>
>[] {
  return [
    {
      id: 'task',
      header: () => <HeaderColumn text="Tasks" />,
      render: ({ row: task }) => <div>{task.title}</div>
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
      )
    },
    {
      id: 'type',
      width: '180px',
      header: () => <HeaderColumn text="Type" />,
      render: ({ row: task }) => <TaskTypeCell type={task.task_type} />
    },
    {
      id: 'due-date',
      width: '200px',
      header: () => <HeaderColumn text="Due Date" />,
      render: ({ row: task }) => <DueDateCell dueDate={task.due_date} />
    },
    {
      id: 'assignee',
      width: '150px',
      header: () => <HeaderColumn text="Assignee" />,
      render: ({ row: task }) => <AssigneeCell assignees={task.assignees} />
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
      )
    }
  ]
}
