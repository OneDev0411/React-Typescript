import React from 'react'
import { extent, max } from 'd3-array'
import { Group } from '@visx/group'
import { curveNatural } from '@visx/curve'
import { LinePath } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { DateValue } from '@visx/mock-data/lib/generators/genDateValue'
import { MarkerCircle } from '@visx/marker'

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

const years = [
  { year: 2019, monthsRange: [1, 12] },
  { year: 2020, monthsRange: [1, new Date().getMonth() + 1] }
]

const datesRange = years.map(item => {
  const months = range(item.monthsRange[0], item.monthsRange[1], 1)

  return {
    year: item.year,
    months
  }
})

const dates: Date[] = []

datesRange.forEach(dateRange => {
  dateRange.months.forEach(month => {
    const date = new Date(`${month}-${new Date().getDate()}-${dateRange.year}`)

    dates.push(date)
  })
})

const incomes = [
  0,
  20,
  240,
  700,
  850,
  1900,
  2300,
  3300,
  3500,
  4000,
  4252,
  4700,
  5000,
  5000,
  5400,
  5400,
  5450,
  6100,
  6580,
  6800,
  6960,
  7000.25
]

const data: DateValue[] = incomes.map((value, index) => ({
  date: dates[index],
  value: value * 1000
}))

// data accessors
const getX = (d: DateValue) => d.date
const getY = (d: DateValue) => d.value

// scales
const xScale = scaleTime<number>({
  domain: extent(data, getX) as [Date, Date]
})
const yScale = scaleLinear<number>({
  domain: [0, max(data, getY) as number]
})

type CurveProps = {
  width: number
  height: number
}

export default function Chart({ width, height }: CurveProps) {
  const margin = { top: 8, right: 16, bottom: 24, left: 56 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  xScale.range([0, xMax])
  yScale.range([yMax, 0])

  return (
    <svg width={width} height={height}>
      <MarkerCircle id="marker-circle" fill="#0d5f75" size={1} refX={2} />
      <Group left={margin.left} top={margin.top}>
        <rect width={width} height={height} fill="#fff" rx={14} ry={14} />
        <AxisBottom top={yMax} scale={xScale} numTicks={width > 520 ? 10 : 5} />
        <AxisLeft scale={yScale} numTicks={5} />
        <LinePath<DateValue>
          curve={curveNatural}
          data={data}
          x={d => xScale(getX(d)) ?? 0}
          y={d => yScale(getY(d)) ?? 0}
          stroke="#0d9dbd"
          strokeWidth={2}
          strokeOpacity={0.6}
          shapeRendering="geometricPrecision"
          markerMid="url(#marker-circle)"
        />
      </Group>
    </svg>
  )
}
