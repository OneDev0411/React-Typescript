import { SortableColumn } from 'components/Grid/Table/types'

export const SORTABLE_COLUMNS: SortableColumn[] = [
  {
    label: 'Status (A-Z)',
    value: 'status',
    ascending: true
  },
  {
    label: 'Status (Z-A)',
    value: 'status',
    ascending: false
  },
  {
    label: 'Address (A-Z)',
    value: 'address',
    ascending: true
  },
  {
    label: 'Address (Z-A)',
    value: 'address',
    ascending: false
  },
  {
    label: 'Price (Low-High)',
    value: 'price',
    ascending: true
  },
  {
    label: 'Price (High-Low)',
    value: 'price',
    ascending: false
  },
  {
    label: 'Critical Dates (A-Z)',
    value: 'critical-dates',
    ascending: true
  },
  {
    label: 'Critical Dates (Z-A)',
    value: 'critical-dates',
    ascending: false
  },
  {
    label: 'Agent (A-Z)',
    value: 'agent-name',
    ascending: true
  },
  {
    label: 'Agent (Z-A)',
    value: 'agent-name',
    ascending: false
  }
]
