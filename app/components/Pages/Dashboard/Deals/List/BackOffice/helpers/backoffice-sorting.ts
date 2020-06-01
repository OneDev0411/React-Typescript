import { SortableColumn } from 'components/Grid/Table/types'

export const SORT_FIELD_SETTING_KEY = 'grid_deals_sort_field_bo'

export const SORTABLE_COLUMNS: SortableColumn[] = [
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
    label: 'Status (Active, Pending, Archived)',
    value: 'status',
    ascending: true
  },
  {
    label: 'Status (Archived, Pending, Active)',
    value: 'status',
    ascending: false
  },
  {
    label: 'Contract Price (Low-High)',
    value: 'contract-price',
    ascending: true
  },
  {
    label: 'Contract Price (High-Low)',
    value: 'contract-price',
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
  },
  {
    label: 'Office Name (A-Z)',
    value: 'office',
    ascending: true
  },
  {
    label: 'Office Name (Z-A)',
    value: 'office',
    ascending: false
  },
  {
    label: 'Submit Time (A-Z)',
    value: 'submitted-at',
    ascending: true
  },
  {
    label: 'Submit Time (Z-A)',
    value: 'submitted-at',
    ascending: false
  }
]
