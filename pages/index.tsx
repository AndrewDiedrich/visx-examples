import { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import DepthChart from '../components/DepthChart'
import PieGraph from '../components/PieGraph'
import AssetLineChart from '../components/assetLineChart'
import HeatChart from '../components/heatChart'
import HeatMap from '../components/heatMap'

export const Home = (): JSX.Element => {
  const graphRef = useRef()
  const [graphWidth, setGraphWidth] = useState()
  useEffect(() => {
    const width = graphRef.current?.clientWidth
    setGraphWidth(width - 20)
  }, [graphRef.current?.clientWidth])
  return (
    <div className="container" ref={graphRef}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <img
            src="/chintai-icon-blue.svg"
            style={{ width: '2rem', margin: '0 auto' }}
          />
        </div>
        <h2>CHEX</h2>

        <h5>
          The native token of the chintai network. Get rewards by lending CHEX
          to the Pool Market
        </h5>
        <div className="grid">
          <div className="card">
            <h3>Liquidity</h3>
            <h4 className="stat-green ">+ 23.2312%</h4>
          </div>
          <div className="card">
            <h3>Borrowed</h3>
            <h4 className="stat-green ">+ 23.2312%</h4>
          </div>
          <div className="card">
            <h3>CCHEX Price</h3>
            <h4 className="stat-green ">+ 23.2312%</h4>
          </div>
        </div>
        <div className="grid">
          <button
            style={{ marginRight: '20px' }}
            className="chintai-button green"
          >
            Lend
          </button>
          <button className="chintai-button red">Unlend</button>
        </div>
        {/* <HeatMap
          width={graphWidth > 800 ? 800 : graphWidth}
          height={400}
          margin={{ top: 10, right: 30, bottom: 22, left: 30 }}
        /> */}
        <HeatChart
          width={graphWidth > 800 ? 800 : graphWidth}
          height={400}
          margin={{ top: 10, right: 30, bottom: 22, left: 30 }}
        />
        {/* <PieGraph
        width={800}
        height={400}
        margin={{ top: 10, right: 30, bottom: 22, left: 30 }}
        animate
      /> */}
        {/* <DepthChart
        width={800}
        height={400}
        margin={{ top: 10, right: 30, bottom: 22, left: 30 }}
      /> */}
      </main>
      <div className="divider"></div>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/powered-chintai-white.svg"
            alt="chintai Logo"
            className="logo"
          />
        </a>
      </footer>

      <style jsx>{`
        h2 {
          margin: 3px;
          color: white;
        }
        h5 {
          margin: 3px;
          color: white;
        }

        h3 {
          // font-weight: thin;
        }

        .chintai-button {
          padding: 5px;
          font-size: 1.2rem;
          color: #08253a;
          background: #f0f0f0;
          border: none;
          box-shadow: 0px 0px 0px rgba(16, 22, 26, 0.1),
            0px 1px 1px rgba(16, 22, 26, 0.2), 0px 2px 6px rgba(16, 22, 26, 0.2);

          min-width: 200px;
          transition: color 2.75s ease, border-color 2.75s ease;
        }

        .chintai-button:hover,
        .chintai-button:focus,
        .chintai-button:active {
          grow: 1.3;
          // color: #0070f3;
          // border: 1px solid;
          // border-color: #0070f3;
          cursor: pointer;
        }

        .red {
          background: #fee2e2;
        }

        .green {
          background: #e4fee5;
        }

        .stat-green {
          color: #64ff6a;
        }
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: radial-gradient(
              164% 164% at 50% -64%,
              #ffffff 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            #08253a;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .divider {
          width: 90vw;
          height: 2px;
          background: radial-gradient(
            circle,
            rgba(100, 100, 100, 100) 30%,
            rgba(255, 255, 255, 0) 92%
          );
        }

        footer {
          width: 100%;
          height: 100px;

          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          // flex-wrap: wrap;

          max-width: 800px;
          margin-top: 1rem;
        }

        .card {
          margin: 1rem;
          width: 185px;
          flex-basis: 45%;
          padding: 1rem;
          text-align: left;
          color: white;
          text-decoration: none;
          background: rgba(8, 37, 58, 0.4);
          box-shadow: 0px 0px 0px rgba(16, 22, 26, 0.1),
            0px 1px 1px rgba(16, 22, 26, 0.2), 0px 2px 6px rgba(16, 22, 26, 0.2);
          border-radius: 5px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          // border: 1px solid;
          // border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 3em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home
