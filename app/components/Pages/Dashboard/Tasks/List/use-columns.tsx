import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { TableColumn } from '@app/views/components/Grid/Table/types'

export function useColumns(): TableColumn<any>[] {
  return [
    {
      id: 'task',
      header: () => <HeaderColumn text="Tasks" />,
      render: () => <div>+</div>
    },
    {
      id: 'contact',
      header: () => <HeaderColumn text="Contacts" />,
      render: () => <div>++</div>
    },
    {
      id: 'type',
      header: () => <HeaderColumn text="Type" />,
      render: () => <div>+++</div>
    },
    {
      id: 'due-date',
      header: () => <HeaderColumn text="Due Date" />,
      render: () => <div>+++</div>
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
