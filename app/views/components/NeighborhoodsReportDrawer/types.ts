export interface Neighborhood {
  type: 'neighborhood'
  id: string
  label: string
  clientid: string
  status: 'published'
  address: {
    city: string
    state: string
    zipcode: string
    country: string
  }
}

export interface NeighborhoodsReport {
  neighborhood: {
    type: string
    label: string
  }
  metrics: NeighborhoodReportMetric[]
}

export interface NeighborhoodReportMetricData {
  key: string
  label: string
  value: number | string
  aggregateOf?: NeighborhoodReportMetricData[]
}

export interface NeighborhoodReportMetric {
  name: string
  description: string
  type: 'percent' | 'number'
  data: NeighborhoodReportMetricData[]
}
