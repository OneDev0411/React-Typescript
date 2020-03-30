import React from 'react'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@material-ui/core'

import { NeighborhoodReportMetric } from './types'

interface Props {
  metric: NeighborhoodReportMetric
  selected: boolean
  onClick: (name: string) => void
}

export default function ReportMetricsListItem({
  metric,
  selected,
  onClick
}: Props) {
  const handleClick = () => {
    onClick(metric.name)
  }

  return (
    <ListItem button onClick={handleClick}>
      <ListItemIcon>
        <Checkbox color="primary" checked={selected} onChange={handleClick} />
      </ListItemIcon>
      <ListItemText primary={metric.name} secondary={metric.description} />
    </ListItem>
  )
}
