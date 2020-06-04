import { ChartConfiguration } from 'chart.js'

export default function getStaticImageChartUrl(
  chartConfiguration: ChartConfiguration,
  width: number = 800,
  height: number = 500
): string {
  return `https://quickchart.io/chart?c=${encodeURIComponent(
    JSON.stringify(chartConfiguration)
  )}&w=${width}&h=${height}`
}
