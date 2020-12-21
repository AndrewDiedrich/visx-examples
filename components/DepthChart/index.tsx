import React, { useMemo, useCallback } from 'react'
import { AreaClosed, Line, Bar } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from '@visx/group'
import { curveStep } from '@visx/curve'
import { GridRows, GridColumns } from '@visx/grid'
import ChintaiLogo from './chintaiLogo'
import { scaleLinear } from '@visx/scale'
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip'
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip'
import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { max, bisector, extent } from 'd3-array'
// import { timeFormat } from 'd3-time-format'

export interface DepthChart {
  total: number
  price: number
}
type TooltipData = DepthChart

const data = {
  ask: 0.072,
  bid: 0.07,
  asks: [
    { total: 50.2, price: 0.13 },
    { total: 100, price: 0.14 },
    { total: 200, price: 0.15 },
    { total: 300, price: 0.16 },
    { total: 400, price: 0.17 },
    { total: 500, price: 0.18 },
    { total: 600, price: 0.19 },
    { total: 620, price: 0.2 },
    { total: 630, price: 0.21 },
    { total: 650, price: 0.22 },
  ],
  bids: [
    { total: 620, price: 0.02 },
    { total: 602, price: 0.03 },
    { total: 550, price: 0.04 },
    { total: 500, price: 0.05 },
    { total: 400, price: 0.06 },
    { total: 300, price: 0.07 },
    { total: 200, price: 0.08 },
    { total: 150, price: 0.09 },
    { total: 100, price: 0.1 },
    { total: 80, price: 0.12 },
  ],
}

// setInterval(
//   () => {
//     let newBids = []
//     let newAsks = []
//     data.asks.map((row: any) => {
//       newAsks.push({ total: row.total + 3, price: row.price })
//     })
//     data.bids.map((row: any) => {
//       newBids.push({ total: row.total + 3, price: row.price })
//     })
//     data.bids = newBids
//     data.asks = newAsks
//   },

//   1000
// )

const depthData = data.bids.concat(data.asks)

export const backgroundColor = '#202b33'
export const askColor = '#204051'
export const bidColr = '#fff'
export const textColor = '#fff'

const tooltipStyles = {
  ...defaultStyles,
  background: backgroundColor,
  border: '1px solid white',
  color: 'white',
}

// util
// const formatDate = timeFormat("%b %d, '%y")

// accessors
const getPrice = (d: DepthChart) => d.price
const getTotal = (d: DepthChart) => d.total
const bisectPrice = bisector<DepthChart, number>((d: DepthChart) => d.price)
  .left

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export type StyleProps = {
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
    const priceScale = useMemo(
      () =>
        scaleLinear({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(depthData, getPrice) as [number, number],
          nice: false,
          round: false,
        }),
      [innerWidth, margin.left, data]
    )
    const totalScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight, margin.bottom],
          domain: [0, (max(depthData, getTotal) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, data]
    )

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 }
        const x0 = priceScale.invert(x)
        const index = bisectPrice(depthData, x0, 1)
        const d0 = depthData[index - 1]
        const d1 = depthData[index]
        let d = d0

        if (d1 && getPrice(d1)) {
          d =
            x0.valueOf() - getPrice(d0).valueOf() >
            getPrice(d1).valueOf() - x0.valueOf()
              ? d1
              : d0
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: totalScale(getTotal(d)),
        })
      },
      [showTooltip, totalScale, priceScale]
    )

    return (
      <>
        {/* <ChintaiLogo width={160} height={140} /> */}
        <div>
          <svg width={width} height={height}>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="url(#area-background-gradient)"
              rx={0}
            />
            <Group top={margin.top} left={0}>
              <LinearGradient
                id="area-background-gradient"
                from={backgroundColor}
                to={backgroundColor}
              />
              <LinearGradient
                id="ask-area-gradient"
                from={'#db3737'}
                to={'#db3737'}
                toOpacity={0.4}
              />
              <LinearGradient
                id="bid-area-gradient"
                from={'#4aa529'}
                to={'#4aa529'}
                toOpacity={0.4}
              />
              <GridRows
                left={margin.left}
                scale={totalScale}
                width={innerWidth}
                strokeDasharray="1,3"
                stroke={textColor}
                strokeOpacity={0}
                pointerEvents="none"
              />
              {/* <GridColumns
              top={margin.top}
              scale={priceScale}
              height={innerHeight}
              strokeDasharray="1,3"
              stroke={textColor}
              strokeOpacity={0.2}
              pointerEvents="none"
            /> */}
              <AreaClosed<DepthChart>
                data={data.bids}
                x={(d) => priceScale(getPrice(d)) ?? 0}
                y={(d) => totalScale(getTotal(d)) ?? 0}
                yScale={totalScale}
                strokeWidth={2}
                stroke="url(#bid-area-gradient)"
                fill="url(#bid-area-gradient)"
                curve={curveStep}
              />
              <AreaClosed<DepthChart>
                data={data.asks}
                x={(d) => priceScale(getPrice(d)) ?? 0}
                y={(d) => totalScale(getTotal(d)) ?? 0}
                yScale={totalScale}
                strokeWidth={2}
                stroke="url(#ask-area-gradient)"
                fill="url(#ask-area-gradient)"
                curve={curveStep}
              />
              <AxisLeft
                hideAxisLine={false}
                hideTicks={false}
                scale={totalScale}
                left={margin.left}
                //   tickFormat={formatDate}
                stroke={textColor}
                tickStroke={textColor}
                tickLabelProps={() => ({
                  fill: textColor,
                  fontSize: 11,
                  textAnchor: 'end',
                  dy: '0.33em',
                })}
              />
              <AxisBottom
                top={innerHeight}
                scale={priceScale}
                stroke={textColor}
                tickStroke={textColor}
                tickLabelProps={() => ({
                  fill: textColor,
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
              <Line
                from={{ x: innerWidth / 2 + margin.left + 20, y: margin.top }}
                to={{ x: innerWidth / 2 + margin.left + 20, y: innerHeight }}
                stroke={textColor}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="1,3"
                opacity={0.4}
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
                  {/* <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={textColor}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="2,5"
                /> */}
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
                    fill={textColor}
                    stroke="#72ff3e"
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                </g>
              )}
              {tooltipData && (
                <g>
                  {/* <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={textColor}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="2,5"
                /> */}
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
                    fill={textColor}
                    stroke="#72ff3e"
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
                {`$${getTotal(tooltipData)}`}
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
                {getPrice(tooltipData)}
              </Tooltip>
            </div>
          )}
        </div>
      </>
    )
  }
)
