import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

export function useColumns(): TableColumn<
  ICRMTask<'assignees' | 'associations', 'contact'>
>[] {
  return [
    {
      id: 'task',
      header: () => <HeaderColumn text="Tasks" />,
      render: ({ row: task }) => <div>{task.title}</div>
    },
    {
      id: 'contact',
      header: () => <HeaderColumn text="Contacts" />,
      render: () => <div>++</div>
    },
    {
      id: 'type',
      header: () => <HeaderColumn text="Type" />,
      render: ({ row: task }) => <div>{task.task_type}</div>
    },
    {
      id: 'due-date',
      header: () => <HeaderColumn text="Due Date" />,
      render: ({ row: task }) => <div>{task.due_date}</div>
    },
    {
      id: 'assignee',
      header: () => <HeaderColumn text="Assignee" />,
      render: () => <div>+++</div>
    },
    {
      id: 'property-deal',
      header: () => <HeaderColumn text="Property & Deal" />,
      render: () => <div>+++</div>
    }
  ]
}
