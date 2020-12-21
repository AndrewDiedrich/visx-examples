import React, { useState } from 'react'
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie'
import { scaleOrdinal } from '@visx/scale'
import { Group } from '@visx/group'
import { GradientTealBlue } from '@visx/gradient'
import { animated, useTransition, interpolate } from 'react-spring'

interface InnerBalances {
  base: string
  balance: number
}

const innerBalances = [
  { base: 'EOS', balance: 25 },
  { base: 'USD', balance: 25 },
  { base: 'BTC', balance: 25 },
]

interface Balance {
  symbol: string
  balance: number
}

const balances = [
  {
    symbol: 'EOS',
    balance: 123.1234,
  },
  {
    symbol: 'BTC',
    balance: 132.123321,
  },
  {
    symbol: 'USD',
    balance: 1233.1234,
  },
]

const letters: InnerBalances[] = innerBalances.slice(0, 4)
// const browserNames = Object.keys(balances[0]).filter(
//   (k) => k !== 'balance'
// ) as Balance[]
const browsers: Balance[] = balances.map((name) => ({
  symbol: name.symbol,
  balance: Number(name.balance),
}))

// accessor functions
const usage = (d: Balance) => d.balance
const frequency = (d: InnerBalances) => d.balance

// color scales
const getBrowserColor = scaleOrdinal({
  // domain: browserNames,
  range: [
    'rgba(255,255,255,0.7)',
    'rgba(255,255,255,0.6)',
    'rgba(255,255,255,0.5)',
    'rgba(255,255,255,0.4)',
    'rgba(255,255,255,0.3)',
    'rgba(255,255,255,0.2)',
    'rgba(255,255,255,0.1)',
  ],
})
const getLetterFrequencyColor = scaleOrdinal({
  domain: letters.map((l) => l.base),
  range: [
    '#007bff',
    '#1988ff',
    '#3295ff',
    '#4ca2ff',
    '#66afff',
    '#7fbdff',
    '#99caff',
    '#b2d7ff',
    '#cce4ff',
    '#e5f1ff',
    '#ffffff',
  ],
})

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 }

export type PieProps = {
  width: number
  height: number
  margin?: typeof defaultMargin
  animate?: boolean
}

export default function Example({
  width,
  height,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null)
  const [selectedAlphabetLetter, setSelectedAlphabetLetter] = useState<
    string | null
  >(null)

  if (width < 10) return null

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const donutThickness = 50

  return (
    <svg width={width} height={height}>
      <GradientTealBlue id="visx-pie-gradient" />
      <rect
        rx={14}
        width={width}
        height={height}
        fill="url('#visx-pie-gradient')"
      />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={
            selectedBrowser
              ? browsers.filter(({ symbol }) => symbol === selectedBrowser)
              : browsers
          }
          pieValue={usage}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<Balance>
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.symbol}
              onClickDatum={({ data: { symbol } }) =>
                animate &&
                setSelectedBrowser(
                  selectedBrowser && selectedBrowser === symbol ? null : symbol
                )
              }
              getColor={(arc) => getBrowserColor(arc.data.symbol)}
            />
          )}
        </Pie>
        <Pie
          data={
            selectedAlphabetLetter
              ? letters.filter(({ base }) => base === selectedAlphabetLetter)
              : letters
          }
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<InnerBalances>
              {...pie}
              animate={animate}
              getKey={({ data: { base, balance } }) => `${base}-${balance}`}
              onClickDatum={({ data: { base } }) =>
                animate &&
                setSelectedAlphabetLetter(
                  selectedAlphabetLetter && selectedAlphabetLetter === base
                    ? null
                    : base
                )
              }
              getColor={({ data: { base } }) => getLetterFrequencyColor(base)}
            />
          )}
        </Pie>
      </Group>
      {animate && (
        <text
          textAnchor="end"
          x={width - 16}
          y={height - 16}
          fill="white"
          fontSize={11}
          fontWeight={300}
          pointerEvents="none"
        >
          Click segments to update
        </text>
      )}
    </svg>
  )
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number }

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
})
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean
  getKey: (d: PieArcDatum<Datum>) => string
  getColor: (d: PieArcDatum<Datum>) => string
  onClickDatum: (d: PieArcDatum<Datum>) => void
  delay?: number
}

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(
    arcs,
    getKey,
    // @ts-ignore react-spring doesn't like this overload
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    }
  )
  return (
    <>
      {transitions.map(
        ({
          item: arc,
          props,
          key,
        }: {
          item: PieArcDatum<Datum>
          props: AnimatedStyles
          key: string
        }) => {
          const [centroidX, centroidY] = path.centroid(arc)
          const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

          return (
            <g key={key}>
              <animated.path
                // compute interpolated path d attribute from intermediate angle values
                d={interpolate(
                  [props.startAngle, props.endAngle],
                  (startAngle, endAngle) =>
                    path({
                      ...arc,
                      startAngle,
                      endAngle,
                    })
                )}
                fill={getColor(arc)}
                onClick={() => onClickDatum(arc)}
                onTouchStart={() => onClickDatum(arc)}
              />
              {hasSpaceForLabel && (
                <animated.g style={{ opacity: props.opacity }}>
                  <text
                    fill="white"
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={9}
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {getKey(arc)}
                  </text>
                </animated.g>
              )}
            </g>
          )
        }
      )}
    </>
  )
}
