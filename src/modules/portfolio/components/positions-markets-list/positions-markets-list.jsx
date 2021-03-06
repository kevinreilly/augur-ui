import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MarketPortfolioCard from 'modules/market/containers/market-portfolio-card'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import Paginator from 'modules/common/components/paginator/paginator'
import Styles from 'modules/portfolio/components/positions-markets-list/positions-markets-list.styles'
import isEqual from 'lodash/isEqual'

export default class PositionsMarketsList extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    markets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    pageinationName: PropTypes.string.isRequired,
    linkType: PropTypes.string,
    positionsDefault: PropTypes.bool,
    claimTradingProceeds: PropTypes.func,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    const pageinationCount = 10

    this.state = {
      lowerBound: 1,
      boundedLength: pageinationCount,
      pageinationCount,
      filteredMarkets: [],
    }

    this.setSegment = this.setSegment.bind(this)
    this.setFilteredMarkets = this.setFilteredMarkets.bind(this)
  }

  componentWillMount() {
    const {
      lowerBound,
      boundedLength,
    } = this.state
    this.setFilteredMarkets(lowerBound, boundedLength)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(this.props.markets, nextProps.markets)
    ) {
      this.setFilteredMarkets(nextProps.markets, nextState.lowerBound, nextState.boundedLength)
    }
  }

  setFilteredMarkets(markets, lowerBound, boundedLength) {
    const itemLength = boundedLength + (lowerBound - 1)
    const filteredMarkets = markets && markets.length > 0 ? markets.slice(lowerBound - 1, itemLength) : []
    this.setState({ filteredMarkets })
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength })
  }

  render() {
    const {
      markets,
      location,
      history,
      linkType,
      positionsDefault,
      claimTradingProceeds,
      isMobile,
      currentTimestamp,
      title,
      pageinationName,
    } = this.props
    const {
      pageinationCount,
      filteredMarkets,
    } = this.state

    return (
      <div className={classNames(Styles.PositionsMarketsList, { [`${Styles.PositionMarketsListNullState}`]: markets.length === 0 })}>
        <div className={Styles.PositionsMarketsList__SortBar}>
          <div className={Styles['PositionsMarketsList__SortBar-title']}>
            {title}
          </div>
        </div>
        { markets && markets.length > 0 &&
          filteredMarkets.map(market =>
            (<MarketPortfolioCard
              key={market.id}
              market={market}
              location={location}
              history={history}
              linkType={linkType}
              positionsDefault={positionsDefault}
              claimTradingProceeds={claimTradingProceeds}
              isMobile={isMobile}
              currentTimestamp={currentTimestamp}
            />))
        }
        { markets.length > pageinationCount &&
          <Paginator
            itemsLength={markets.length}
            itemsPerPage={pageinationCount}
            location={location}
            history={history}
            setSegment={this.setSegment}
            pageParam={pageinationName}
          />
        }
        { markets.length === 0 &&
          <NullStateMessage message="No Markets Available" />
        }
      </div>
    )
  }
}
