import React from 'react'

import { List } from '@material-ui/core'

import ReportMetricsListItem from './ReportMetricsListItem'
import { NeighborhoodReportMetric } from './types'

interface Props {
  metrics: NeighborhoodReportMetric[]
  selectedMetrics: string[]
  onMetricClick: (name: string) => void
}

export default function ReportMetricsList({
  metrics,
  selectedMetrics,
  onMetricClick
}: Props) {
  return (
    <List>
      {metrics.map(metric => (
        <ReportMetricsListItem
          key={metric.name}
          metric={metric}
          selected={selectedMetrics.includes(metric.name)}
          onClick={onMetricClick}
        />
      ))}
    </List>
  )
}
