import { SortableColumn } from 'components/Grid/Table/types'

export const SortableColumns: SortableColumn[] = [
  {
    label: 'Name (A-Z)',
    value: 'name',
    ascending: true
  },
  {
    label: 'Name (Z-A)',
    value: 'name',
    ascending: false
  },
  {
    label: '# of Listings (Low-High)',
    value: 'listings',
    ascending: true
  },
  {
    label: '# of Listings (High-Low)',
    value: 'listings',
    ascending: false
  },
  {
    label: '# of Buyers (Low-High)',
    value: 'buyers',
    ascending: true
  },
  {
    label: '# of Buyers (High-Low)',
    value: 'buyers',
    ascending: false
  },
  {
    label: 'Volume in $ (Low-High)',
    value: 'value_in',
    ascending: true
  },
  {
    label: 'Volume in $ (High-Low)',
    value: 'value_in',
    ascending: false
  },
  {
    label: 'Avg Price (Low-High)',
    value: 'avg_price',
    ascending: true
  },
  {
    label: 'Avg Price (High-Low)',
    value: 'avg_price',
    ascending: false
  }
]
