import {
  NeighborhoodsReport,
  NeighborhoodReportMetricData,
  NeighborhoodReportMetric
} from './types'

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0)
}

function avg(arr: number[]) {
  return sum(arr) / arr.length
}

function getAggregatedDataOfPastMonths(
  metric: NeighborhoodReportMetric,
  months: number,
  label: string,
  includeMonthRangeInLabel: boolean = true
) {
  const pastMonthsDataList = metric.data.slice(metric.data.length - months)

  let value: number | string = 0

  if (metric.type === 'percent') {
    value = `${avg(
      pastMonthsDataList.map(data => {
        const stringValue = data.value.toString()
        const percentPart = stringValue.slice(0, stringValue.length - 1)

        return Number(percentPart)
      })
    )}%`
  } else if (metric.type === 'number' && metric.name.includes('Average')) {
    value = avg(pastMonthsDataList.map(data => Number(data.value)))
  } else if (metric.type === 'number') {
    value = sum(pastMonthsDataList.map(data => Number(data.value)))
  }

  const labelSuffix = includeMonthRangeInLabel
    ? ` (${pastMonthsDataList[0].label} - ${
        pastMonthsDataList[pastMonthsDataList.length - 1].label
      })`
    : ''

  const pastMonthsMetricData: NeighborhoodReportMetricData = {
    key: pastMonthsDataList.map(data => data.key).join(','),
    label: `${label}${labelSuffix}`,
    value,
    aggregateOf: pastMonthsDataList
  }

  return pastMonthsMetricData
}

export function getFormattedReportWithNeededPeriods(
  report: NeighborhoodsReport,
  onlyAggregatedPeriods: boolean = false
): NeighborhoodsReport {
  if (!report.metrics.length) {
    return report
  }

  if (!report.metrics[0].data.length) {
    return report
  }

  const formattedMetrics: NeighborhoodReportMetric[] = report.metrics.map(
    metric => {
      return {
        ...metric,
        data: metric.data.map(metricData => {
          let value = metricData.value

          if (value === null || value === undefined) {
            value = metric.type === 'percent' ? '0%' : 0
          }

          return {
            key: metricData.key,
            label: `${metricData.label} ${metricData.key.slice(2, 4)}`,
            value
          }
        })
      }
    }
  )

  const metricsWithNewPeriods: NeighborhoodReportMetric[] = formattedMetrics.map(
    metric => {
      const pastYearMetricData = getAggregatedDataOfPastMonths(
        metric,
        12,
        'Past 12 months'
      )

      const pastSixMonthsData = getAggregatedDataOfPastMonths(
        metric,
        6,
        'Past 6 months'
      )

      const pastThreeMonthsMetricData = getAggregatedDataOfPastMonths(
        metric,
        3,
        'Past 3 months'
      )

      const additionalMetricData: NeighborhoodReportMetricData[] = [
        pastYearMetricData,
        pastSixMonthsData,
        pastThreeMonthsMetricData
      ]

      const data = onlyAggregatedPeriods
        ? [...additionalMetricData]
        : [...additionalMetricData, ...metric.data]

      return {
        ...metric,
        data
      }
    }
  )

  return {
    ...report,
    metrics: metricsWithNewPeriods
  }
}

export function getReportWithSpceficMetricsAndPeriod(
  report: NeighborhoodsReport,
  metricNames: string[],
  periodKey: string
): Nullable<NeighborhoodsReport> {
  if (!metricNames.length || !periodKey) {
    return null
  }

  const filteredMetrics: NeighborhoodReportMetric[] = report.metrics
    .filter(metric => metricNames.includes(metric.name))
    .map(metric => {
      return {
        ...metric,
        data: metric.data.filter(data => data.key === periodKey)
      }
    })

  return {
    ...report,
    metrics: filteredMetrics
  }
}
