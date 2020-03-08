import React, { useState, useEffect } from 'react'
import { Divider } from '@material-ui/core'

import { NeighborhoodsReport } from './types'
import ReportPeriodSelector from './ReportPeriodSelector'
import ReportMetricsList from './ReportMetricsList'
import { getReportWithSpceficMetricsAndPeriod } from './helpers'

interface Props {
  neighborhoodReport: NeighborhoodsReport
  onChange: (report: Nullable<NeighborhoodsReport>) => void
}

export default function ReportSelector({
  neighborhoodReport,
  onChange
}: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    neighborhoodReport.metrics[0].data[0].key
  )
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  useEffect(() => {
    const report = getReportWithSpceficMetricsAndPeriod(
      neighborhoodReport,
      selectedMetrics,
      selectedPeriod
    )

    onChange(report)
  }, [neighborhoodReport, onChange, selectedMetrics, selectedPeriod])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  const handleMetricClick = (metricName: string) => {
    if (selectedMetrics.includes(metricName)) {
      setSelectedMetrics(selectedMetrics.filter(name => name !== metricName))

      return
    }

    setSelectedMetrics([...selectedMetrics, metricName])
  }

  const periods = neighborhoodReport.metrics[0].data.map(data => data)

  return (
    <>
      <ReportPeriodSelector
        periods={periods}
        selectedPeriod={selectedPeriod}
        onChange={handlePeriodChange}
      />

      <Divider />

      <ReportMetricsList
        metrics={neighborhoodReport.metrics}
        selectedMetrics={selectedMetrics}
        onMetricClick={handleMetricClick}
      />
    </>
  )
}
