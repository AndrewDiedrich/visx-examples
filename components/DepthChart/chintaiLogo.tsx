export default function Banner({ width, height }) {
  return (
    <div className="topcorner">
      <svg height={height} width={width}>
        <path fill="#394b59" d={`M0,0L${width},0L0,${height}L0,0`} />
        <path
          fill="#394b59"
          d={`M0,0L${width},0L0,${height}L0,0`}
          transform="scale(.95)"
        />
        {/* <path
          fill="transparent"
          stroke="#ffffff"
          strokeWidth={1}
          d={`M5,5L${width - 20},5L5,${height - 20}L5,5`}
        /> */}
        {/* <image
          x="40"
          y="15"
          width="45"
          height="45"
          href="/chintai-icon-blue.svg"
        /> */}
        <text
          fontFamily="Sans serif"
          fill="#ffffff"
          fontSize={14}
          transform="translate(45,78)rotate(-40)"
        >
          CHINTAI
        </text>
      </svg>
      <style jsx>{`
        .topcorner {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.2;
        }
      `}</style>
    </div>
  )
}
