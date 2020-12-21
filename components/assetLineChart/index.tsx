import React from 'react'
import { withScreenSize } from '@visx/responsive'
import Background from '../shared/background'
import BitcoinPrice from '../shared/bitcoinprice'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
    }
  }
  componentDidMount() {
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        this.setState({
          data: json,
        })
      })
  }
  render() {
    const { screenWidth, screenHeight } = this.props
    const { data } = this.state
    return (
      <div className="">
        <Background width={screenWidth} height={screenHeight} />
        <div className="center">
          <BitcoinPrice data={data} width={screenWidth} height={screenHeight} />
          <p className="disclaimer">{data.disclaimer}</p>
        </div>
        <style jsx>{`
          .app,
          .center {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            display: flex;
            font-family: arial;
            flex-direction: column;
          }
          .disclaimer {
            margin-top: 35px;
            font-size: 11px;
            color: white;
            opacity: 0.4;
          }
          .center {
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }
}

export default withScreenSize(App)
