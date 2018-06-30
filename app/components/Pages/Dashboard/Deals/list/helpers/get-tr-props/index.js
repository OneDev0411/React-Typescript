import { browserHistory } from 'react-router'

export default function(rowIndex, { original: row }) {
  return {
    onClick: () => browserHistory.push(`/dashboard/deals/${row.id}`),
    style: {
      cursor: 'pointer'
    }
  }
}
