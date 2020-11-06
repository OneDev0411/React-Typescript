import React from 'react'
import { extent, max } from 'd3-array'
import { Group } from '@visx/group'
import { curveNatural } from '@visx/curve'
import { LinePath } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { DateValue } from '@visx/mock-data/lib/generators/genDateValue'
import { MarkerCircle } from '@visx/marker'
import { timeFormat } from 'd3-time-format'

const closedDeals = [1, 2, 0, 1, 1, 2, 1, 2, 1, 1]

const data: DateValue[] = closedDeals.map((value, index) => ({
  date: new Date(`${index + 1}-01-2020`),
  value
}))

const format = timeFormat('%b')
const formatDate = (date: Date) => format(date)

// data accessors
const getX = (d: DateValue) => d.date
const getY = (d: DateValue) => d.value

// scales
const xScale = scaleTime<number>({
  domain: extent(data, getX) as [Date, Date]
})
const yScale = scaleLinear<number>({
  domain: [0, (max(data, getY) + 1) as number]
})

type CurveProps = {
  width: number
  height: number
}

export default function Chart({ width, height }: CurveProps) {
  const margin = { top: 8, right: 12, bottom: 24, left: 24 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  xScale.range([0, xMax])
  yScale.range([yMax, 0])

  return (
    <svg width={width} height={height}>
      <MarkerCircle id="marker-circle" fill="#0d5f75" size={2} refX={2} />
      <Group left={margin.left} top={margin.top}>
        <rect width={width} height={height} fill="#fff" rx={14} ry={14} />
        <AxisLeft
          scale={yScale}
          numTicks={4}
          tickFormat={(d: number) => d.toString()}
        />
        <AxisBottom top={yMax} scale={xScale} tickFormat={formatDate} />
        <text x="-60" y="15" transform="rotate(-90)" fontSize={10}>
          Closed Deals
        </text>
        <text x={xMax - 28} y={yMax - 8} fontSize={12}>
          2020
        </text>
        <LinePath<DateValue>
          curve={curveNatural}
          data={data}
          x={d => xScale(getX(d)) ?? 0}
          y={d => yScale(getY(d)) ?? 0}
          stroke="#0d9dbd"
          strokeWidth={2}
          strokeOpacity={1}
          shapeRendering="geometricPrecision"
          markerEnd="url(#marker-circle)"
          markerMid="url(#marker-circle)"
          markerStart="url(#marker-circle)"
        />
      </Group>
    </svg>
  )
}
