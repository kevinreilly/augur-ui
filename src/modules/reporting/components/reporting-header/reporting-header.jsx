import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getDaysRemaining, convertUnixToFormattedDate, getHoursRemaining } from 'utils/format-date'
import { formatAttoRep, formatAttoEth } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'
import { MODAL_PARTICIPATE } from 'modules/modal/constants/modal-types'
import ForkingContent from 'modules/forking/components/forking-content/forking-content'
import { showMore } from 'modules/common/components/icons'
import classNames from 'classnames'

export default class ReportingHeader extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    loadReportingWindowBounds: PropTypes.func.isRequired,
    reportingWindowStats: PropTypes.object.isRequired,
    repBalance: PropTypes.string.isRequired,
    updateModal: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    isForking: PropTypes.bool,
    forkingMarket: PropTypes.string,
    forkEndTime: PropTypes.string,
    forkReputationGoal: PropTypes.string,
    isForkingMarketFinalized: PropTypes.bool,
    isLogged: PropTypes.bool,
    universe: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      readMore: false,
    }

    this.showReadMore = this.showReadMore.bind(this)
    this.hideReadMore = this.hideReadMore.bind(this)
  }

  componentWillMount() {
    const { loadReportingWindowBounds } = this.props
    loadReportingWindowBounds()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideReadMore)
  }

  componentDidUpdate(prevProps) {
    const {
      loadReportingWindowBounds,
      universe,
    } = this.props
    if (universe !== prevProps.universe) {
      loadReportingWindowBounds()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideReadMore)
  }

  showReadMore() {
    this.setState({ readMore: !this.state.readMore })
  }

  hideReadMore(e) {
    if (this.readMore && !this.readMore.contains(event.target)) {
      this.setState({ readMore: false })
    }
  }

  render() {
    const {
      currentTime,
      forkEndTime,
      forkingMarket,
      heading,
      isForking,
      repBalance,
      reportingWindowStats,
      updateModal,
      doesUserHaveRep,
      forkReputationGoal,
      finalizeMarket,
      isForkingMarketFinalized,
      isLogged,
    } = this.props
    const totalHours = getHoursRemaining(reportingWindowStats.endTime, reportingWindowStats.startTime)
    const hoursLeft = getHoursRemaining(reportingWindowStats.endTime, currentTime)
    const daysLeft = getDaysRemaining(reportingWindowStats.endTime, currentTime)
    const formattedDate = convertUnixToFormattedDate(reportingWindowStats.endTime)
    const disableParticipate = (repBalance === '0')
    const disputeRep = formatAttoRep(reportingWindowStats.stake, { decimals: 4, denomination: ' REP' }).formattedValue || 0
    const disputingRep = formatAttoRep(reportingWindowStats.participantContributionsCrowdsourcer, { decimals: 4, denomination: ' REP' }).formattedValue || 0
    const partRep = formatAttoRep(reportingWindowStats.participationTokens, { decimals: 4, denomination: ' REP' }).formattedValue || 0
    const reportingRep = formatAttoRep(reportingWindowStats.participantContributionsInitialReport, { decimals: 4, denomination: ' REP' }).formattedValue || 0

    const feeWindowEthFees = formatAttoEth(reportingWindowStats.feeWindowEthFees, { decimals: 4, denomination: ' ETH' }).formattedValue || 0
    const feeWindowRepStaked = formatAttoRep(reportingWindowStats.feeWindowRepStaked, { decimals: 4, denomination: ' REP' }).formattedValue || 0

    const currentPeriodStyle = {
      width: `${((totalHours - hoursLeft) / totalHours) * 100}%`,
    }

    let timeLeft = `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`
    if (daysLeft === 0) timeLeft = `${hoursLeft} ${hoursLeft === 1 ? 'hour' : 'hours'} left`

    return (
      <article className={Styles.ReportingHeader}>
        <div className={Styles.ReportingHeader__header}>
          <div>
            <h1 className={Styles.ReportingHeader__heading}>Reporting<span>: {heading}</span></h1>
            { heading === 'Dispute' && isForking &&
              <ForkingContent
                forkingMarket={forkingMarket}
                forkEndTime={forkEndTime}
                currentTime={currentTime}
                expanded={false}
                doesUserHaveRep={doesUserHaveRep}
                forkReputationGoal={forkReputationGoal}
                finalizeMarket={finalizeMarket}
                isForkingMarketFinalized={isForkingMarketFinalized}
              />
            }
            { heading === 'Dispute' && !isForking &&
              <div className={Styles['ReportingHeader__dispute-wrapper']}>
                <div className={Styles['ReportingHeader__dispute-header']}>
                  <div className={Styles.ReportingHeader__row}>
                    <div>
                      <div className={Styles.ReportingHeader__statsContainer}>
                        { isLogged &&
                          <div className={Styles.ReportingHeader__border}>
                            <div className={Styles['ReportingHeader__value-label']}>
                              My Rep Staked
                            </div>
                            <div
                              className={Styles['ReportingHeader__value-number']}
                              onClick={this.showReadMore}
                              role="button"
                              tabIndex={0}
                              ref={(readMore) => { this.readMore = readMore }}
                            >
                              { disputeRep } <span className={Styles['ReportingHeader__value-unit']}>REP</span>
                              { showMore }
                            </div>
                          </div>
                        }
                        { this.state.readMore && isLogged &&
                          <div className={Styles.ReportingHeader__readMore}>
                            <div className={Styles.ReportingHeader__column} style={{ marginRight: '30px' }}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Reporting
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { reportingRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span>
                              </div>
                            </div>
                            <div className={Styles.ReportingHeader__column} style={{ marginRight: '30px' }}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Disputing
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { disputingRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span>
                              </div>
                            </div>
                            <div className={Styles.ReportingHeader__column}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Participation Tokens
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { partRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span>
                              </div>
                            </div>
                          </div>
                        }
                        <div className={Styles.ReportingHeader__column}>
                          <div className={Styles.ReportingHeader__rowFees}>
                            <div className={Styles.ReportingHeader__column} style={{ marginRight: '20px', flexGrow: 'unset' }}>
                              <div className={Styles['ReportingHeader__value-label']}>
                                Total Fees Available
                              </div>
                              <div className={Styles['ReportingHeader__value-number']}>
                                { feeWindowEthFees } <span className={Styles['ReportingHeader__value-unit']}>ETH</span>
                              </div>
                            </div>
                            <div className={Styles.ReportingHeader__column}>
                              <div className={Styles['ReportingHeader__value-label']}>
                                Total Rep Staked
                              </div>
                              <div className={Styles['ReportingHeader__value-number']}>
                                <span>{ feeWindowRepStaked }</span> <span className={Styles['ReportingHeader__value-unit']}>REP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={Styles.ReportingHeader__column} style={{ alignItems: 'flex-end' }}>
                      <div className={Styles.ReportingHeader__participation}>
                        <div className={Styles.ReportingHeader__participationHeader}>
                          {'don\'t see any reports that need to be disputed?'}
                        </div>
                        <div className={Styles.ReportingHeader__participationText}>
                          {'You can still earn a share of this dispute window\'s reporting fees by purchasing Participation Tokens.'}
                          {!isLogged &&
                            <b> Please login to purchase Participation tokens. </b>
                          }
                          {!disableParticipate && isLogged &&
                            <b> Please add REP to your account to purchase Participation Tokens. </b>
                          }
                        </div>
                        {isLogged &&
                          <button
                            className={disableParticipate ? Styles['ReportingHeader__participationTokens--disabled'] : Styles.ReportingHeader__participationTokens}
                            disabled={disableParticipate}
                            onClick={() => updateModal({
                              type: MODAL_PARTICIPATE,
                              canClose: true,
                            })}
                          >
                            <span className={Styles['ReportingHeader__participationTokens--text']}>
                              buy participation tokens
                            </span>
                          </button>
                        }
                      </div>
                    </div>

                  </div>

                  <div className={classNames(Styles.ReportingHeader__endTimeRow, Styles.ReportingHeader__row)}>
                    <span data-testid="endTime" className={Styles.ReportingHeader__endTime}>
                      <span className={Styles.ReportingHeader__endTimeValue} style={{ fontSize: '12px' }}> { formattedDate.clockTimeLocal }</span>
                    </span>
                  </div>
                  <div className={classNames(Styles.ReportingHeader__row, Styles.ReportingHeader__endTimeRow)}>
                    <span data-testid="endTime" className={Styles.ReportingHeader__endTime}>
                      Dispute Window ends <span className={Styles.ReportingHeader__endTimeValue}> { formattedDate.formattedSimpleData } </span>
                    </span>
                  </div>
                </div>
                <div className={Styles['ReportingHeader__dispute-graph']}>
                  <div className={Styles.ReportingHeader__graph}>
                    <div className={Styles['ReportingHeader__graph-current']}>
                      <div style={currentPeriodStyle} />
                    </div>
                  </div>
                </div>
                <div className={Styles.ReportingHeader__daysLeft}>
                  <span data-testid="daysLeft">{ timeLeft }</span>
                </div>
              </div>
            }
          </div>
        </div>
      </article>
    )
  }
}
