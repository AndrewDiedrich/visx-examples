import React, { useMemo, useCallback } from 'react'
import { AreaClosed, Line, Bar } from '@visx/shape'
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock'
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
import { max, extent, bisector } from 'd3-array'
import { timeFormat } from 'd3-time-format'

type TooltipData = AppleStock

const stock = appleStock.slice(200)
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

export interface DepthChart {
  total: number
  price: number
}
// type TooltipData = DepthChart

// const newData = {
//   ask: 0.072,
//   bid: 0.07,
//   asks: [
//     { date: '2020-01-01', price: 0.13 },
//     { date: '2020-01-02', price: 0.14 },
//     { date: '2020-01-03', price: 0.15 },
//     { date: '2020-01-04', price: 0.16 },
//     { date: '2020-01-05', price: 0.17 },
//     { date: '2020-01-06', price: 0.18 },
//     { date: '2020-01-07', price: 0.19 },
//     { date: '2020-01-08', price: 0.2 },
//     { date: '2020-01-09', price: 0.21 },
//     { date: '2020-01-10', price: 0.22 },
//     { date: '2020-01-11', price: 0.02 },
//     { date: '2020-01-12', price: 0.03 },
//     { date: '2020-01-13', price: 0.04 },
//     { date: '2020-01-14', price: 0.05 },
//     { date: '2020-01-15', price: 0.06 },
//     { date: '2020-01-16', price: 0.07 },
//     { date: '2020-01-17', price: 0.08 },
//     { date: '2020-01-18', price: 0.09 },
//     { date: '2020-01-19', price: 0.1 },
//     { date: '2020-01-20', price: 0.12 },
//   ],
// }

// const bookData = {
//   ask: 0.072,
//   bid: 0.07,
//   asks: [
//     { date: '2020-01-01', price: 0.23 },
//     { date: '2020-01-02', price: 0.24 },
//     { date: '2020-01-03', price: 0.25 },
//     { date: '2020-01-04', price: 0.26 },
//     { date: '2020-01-05', price: 0.27 },
//     { date: '2020-01-06', price: 0.28 },
//     { date: '2020-01-07', price: 0.29 },
//     { date: '2020-01-08', price: 0.22 },
//     { date: '2020-01-09', price: 0.21 },
//     { date: '2020-01-10', price: 0.22 },
//     { date: '2020-01-11', price: 0.22 },
//     { date: '2020-01-12', price: 0.23 },
//     { date: '2020-01-13', price: 0.24 },
//     { date: '2020-01-14', price: 0.25 },
//     { date: '2020-01-15', price: 0.26 },
//     { date: '2020-01-16', price: 0.27 },
//     { date: '2020-01-17', price: 0.28 },
//     { date: '2020-01-18', price: 0.29 },
//     { date: '2020-01-19', price: 0.22 },
//     { date: '2020-01-20', price: 0.22 },
//   ],
//   bids: [
//     { date: '2020-01-01', price: 0.03 },
//     { date: '2020-01-02', price: 0.04 },
//     { date: '2020-01-03', price: 0.05 },
//     { date: '2020-01-04', price: 0.06 },
//     { date: '2020-01-05', price: 0.07 },
//     { date: '2020-01-06', price: 0.08 },
//     { date: '2020-01-07', price: 0.09 },
//     { date: '2020-01-08', price: 0.01 },
//     { date: '2020-01-09', price: 0.01 },
//     { date: '2020-01-10', price: 0.02 },
//     { date: '2020-01-11', price: 0.02 },
//     { date: '2020-01-12', price: 0.03 },
//     { date: '2020-01-13', price: 0.04 },
//     { date: '2020-01-14', price: 0.05 },
//     { date: '2020-01-15', price: 0.06 },
//     { date: '2020-01-16', price: 0.07 },
//     { date: '2020-01-17', price: 0.08 },
//     { date: '2020-01-18', price: 0.09 },
//     { date: '2020-01-19', price: 0.03 },
//     { date: '2020-01-20', price: 0.02 },
//   ],
// }

// util
const formatDate = timeFormat("%b %d, '%y")

// accessors
const getDate = (d: AppleStock) => new Date(d.date)
const getStockValue = (d: AppleStock) => d.close
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
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
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null

    // bounds
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

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
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
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
          <AreaClosed<AppleStock>
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
