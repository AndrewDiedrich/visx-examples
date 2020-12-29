import React, { useMemo, useCallback } from 'react'
import { AreaClosed, Line, Bar } from '@visx/shape'
import { Group } from '@visx/group'
import genBins, { Bin, Bins } from '@visx/mock-data/lib/generators/genBins'
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock'
import { HeatmapRect } from '@visx/heatmap'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { curveMonotoneX } from '@visx/curve'
import { GridRows, GridColumns } from '@visx/grid'
import { scaleTime, scaleLinear } from '@visx/scale'
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip'
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip'
import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { extent, bisector } from 'd3-array'
import { timeFormat } from 'd3-time-format'

export interface BookRow {
  date: string
  price: number
}

export interface IBookData {
  asks: BookRow[]
  bids: BookRow[]
}
type BookData = IBookData

const binData = [
  {
    bin: 0,
    bins: [
      { bin: 70.5, count: 300 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
    ],
  },
  {
    bin: 1,
    bins: [
      { bin: 30.5, count: 400 },
      { bin: 31.5, count: 700 },
      { bin: 30.5, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
    ],
  },
  {
    bin: 2,
    bins: [
      { bin: 95.5, count: 150 },
      { bin: 96.5, count: 800 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
    ],
  },
  {
    bin: 3,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
  {
    bin: 4,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
  {
    bin: 5,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
    ],
  },
  {
    bin: 6,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
  {
    bin: 7,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
  {
    bin: 8,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
  {
    bin: 9,
    bins: [
      { bin: 99.4, count: 400 },
      { bin: 99.5, count: 350 },
      { bin: 99.4, count: 400 },
      { bin: 30.5, count: 400 },
      { bin: 95.5, count: 150 },
      { bin: 95.5, count: 150 },
      { bin: 99.4, count: 400 },
      { bin: 99.4, count: 400 },
      { bin: 71.5, count: 750 },
      { bin: 71.5, count: 750 },
      { bin: 95.5, count: 150 },
    ],
  },
]

export const background = 'transparent'
export const background2 = 'transparent'
export const accentColor = '#a4ffa7'
export const accentColorDark = '#ffff'
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
}

const hot1 = '#77312f'
const hot2 = '#f33d15'
const cool1 = '#122549'
const cool2 = '#b4fbde'
// export const background = '#28272c'

// const binData = genBins(/* length = */ 16, /* height = */ 16)

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value))
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.min(...data.map(value))
}

// accessors
const bins = (d: Bins) => d.bins
const count = (d: Bin) => d.count

const colorMax = max(binData, (d) => max(bins(d), count))
const bucketSizeMax = max(binData, (d) => bins(d).length)

// scales
const xScale = scaleLinear<number>({
  domain: [0, binData.length],
})
const yScale = scaleLinear<number>({
  domain: [0, bucketSizeMax],
})
const circleColorScale = scaleLinear<string>({
  range: [hot1, hot2],
  domain: [0, colorMax],
})
const rectColorScale = scaleLinear<string>({
  range: [cool1, cool2],
  domain: [0, colorMax],
})
const opacityScale = scaleLinear<number>({
  range: [0.1, 1],
  domain: [0, colorMax],
})

export interface PriceChart {
  date: string
  price: number
}
type TooltipData = PriceChart

const data = [
  { date: '2020-01-01', price: 10.13 },
  { date: '2020-01-02', price: 20.14 },
  { date: '2020-01-03', price: 22.15 },
  { date: '2020-01-04', price: 24.16 },
  { date: '2020-01-05', price: 55.17 },
  { date: '2020-01-06', price: 66.18 },
  { date: '2020-01-07', price: 26.19 },
  { date: '2020-01-08', price: 26.7 },
  { date: '2020-01-09', price: 27.21 },
  { date: '2020-01-10', price: 28.22 },
  { date: '2020-01-11', price: 29.02 },
  { date: '2020-01-12', price: 30.03 },
  { date: '2020-01-13', price: 31.04 },
  { date: '2020-01-14', price: 41.05 },
  { date: '2020-01-15', price: 61.06 },
  { date: '2020-01-16', price: 92.07 },
  { date: '2020-01-17', price: 100.08 },
  { date: '2020-01-18', price: 127.09 },
  { date: '2020-01-19', price: 140.1 },
  { date: '2020-01-20', price: 141.12 },
]

const stock = data

// util
const formatDate = timeFormat("%m %d, '%y")

// accessors
const getDate = (d: PriceChart) => new Date(d.date)
const getStockValue = (d: PriceChart) => d.price
const bisectDate = bisector<PriceChart, Date>((d) => new Date(d.date)).left

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export type HeatmapProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
  separation?: number
  events?: boolean
}

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    events = false,
    separation = 10,
  }: AreaProps & HeatmapProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null

    // bounds
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // bounds
    const size =
      width > margin.left + margin.right
        ? width - margin.left - margin.right - separation
        : width
    const xMax = size / 12
    const yMax = height - margin.bottom - margin.top

    const binWidth = xMax / binData.length
    const binHeight = yMax / bucketSizeMax
    const radius = min([binWidth, binHeight], (d) => d) / 2

    xScale.range([0, xMax])
    yScale.range([yMax, 0])

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left]
    )
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top - margin.bottom, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 5],
          nice: true,
        }),
      [margin.top, innerHeight]
    )

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 }
        const x0 = dateScale.invert(x)
        const index = bisectDate(stock, x0, 1)
        const d0 = stock[index - 1]
        const d1 = stock[index]
        let d = d0
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        })
      },
      [showTooltip, stockValueScale, dateScale]
    )

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />

          <Group top={margin.top} left={margin.left}>
            <HeatmapRect
              data={binData}
              xScale={(d) => xScale(d) ?? 0}
              yScale={(d) => yScale(d) ?? 0}
              colorScale={rectColorScale}
              opacityScale={opacityScale}
              binWidth={binWidth}
              binHeight={binHeight}
              gap={1}
            >
              {(heatmap) =>
                heatmap.map((heatmapBins) => {
                  // console.log(heatmapBins)
                  return heatmapBins.map((bin) => (
                    <rect
                      key={`heatmap-rect-${bin.row}-${bin.column}`}
                      className="visx-heatmap-rect"
                      width={bin.width}
                      height={bin.height}
                      x={bin.x + margin.left}
                      y={bin.y + margin.bottom}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                      onClick={() => {
                        if (!events) return
                        const { row, column } = bin
                        alert(JSON.stringify({ row, column, bin: bin.bin }))
                      }}
                    />
                  ))
                })
              }
            </HeatmapRect>
            <LinearGradient
              id="area-background-gradient"
              from={background}
              to={background2}
            />
            <LinearGradient
              id="area-gradient"
              from={accentColor}
              to={accentColor}
              toOpacity={0.1}
            />
            <GridRows
              left={margin.left}
              scale={stockValueScale}
              width={innerWidth}
              strokeDasharray="1,3"
              stroke={accentColor}
              strokeOpacity={0}
              pointerEvents="none"
            />
            <GridColumns
              top={margin.top}
              scale={dateScale}
              height={innerHeight}
              strokeDasharray="1,3"
              stroke={accentColor}
              strokeOpacity={0.2}
              pointerEvents="none"
            />
            <AreaClosed<PriceChart>
              data={stock}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => stockValueScale(getStockValue(d)) ?? 0}
              yScale={stockValueScale}
              strokeWidth={1}
              stroke="url(#area-gradient)"
              fill="url(#area-gradient)"
              curve={curveMonotoneX}
            />

            <AxisLeft
              hideAxisLine={false}
              hideTicks={false}
              scale={stockValueScale}
              left={margin.left}
              //   tickFormat={formatDate}
              stroke={accentColorDark}
              tickStroke={accentColorDark}
              tickLabelProps={() => ({
                fill: accentColorDark,
                fontSize: 11,
                textAnchor: 'end',
                dy: '0.33em',
              })}
            />
            <AxisBottom
              top={innerHeight}
              scale={dateScale}
              stroke={accentColorDark}
              tickStroke={accentColorDark}
              tickLabelProps={() => ({
                fill: accentColorDark,
                fontSize: 11,
                textAnchor: 'middle',
              })}
            />
            <Bar
              x={margin.left}
              y={margin.top}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              rx={14}
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
            {tooltipData && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={accentColorDark}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop + 1}
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={4}
                  fill={accentColorDark}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
          </Group>
        </svg>

        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    )
  }
)
