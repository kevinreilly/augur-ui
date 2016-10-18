import React from 'react';
import classnames from 'classnames';

import { ACCOUNT, MARKETS, TRANSACTIONS, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../site/constants/views';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import Link from '../../link/components/link';
import AugurLogo from '../../common/components/augur-logo';
import ValueDenomination from '../../common/components/value-denomination';

const SiteHeader = p => (
	<header className="site-header"	>
		<nav className="site-nav">
			<div className="nav-group left-navs">
				{ p.isSideBarAllowed &&
					<button
						className="unstyled"
						onClick={p.toggleSideBar}
					>
						{p.isSideBarCollapsed ? <i></i> : <i></i>}
					</button>
				}
				<Link
					className={classnames('site-nav-link', { active: ((p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader == null) })}
					{...p.marketsLink}
				>
					Markets
				</Link>
				{!!p.loginAccount && !!p.loginAccount.id && !!p.marketsInfo.numFavorites &&
					<Link
						className={classnames('site-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === FAVORITES })}
						{...p.favoritesLink}
					>
						{!!p.marketsInfo.numFavorites && p.marketsInfo.numFavorites} Favorites
					</Link>
				}
				{!!p.loginAccount && !!p.loginAccount.id && !!p.marketsInfo.numPendingReports &&
					<Link
						className={classnames('site-nav-link', { active: (p.activeView === MARKETS || (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10)))) && p.marketsInfo.selectedMarketsHeader === PENDING_REPORTS })}
						{...p.pendingReportsLink}
					>
						{!!p.marketsInfo.numPendingReports && p.marketsInfo.numPendingReports} Pending Reports
					</Link>
				}
			</div>
			<div className="nav-group branding">
				<Link
					className="augur-brand"
					{...p.marketsLink}
				>
					<AugurLogo />
				</Link>
			</div>
			<div className="nav-group right-navs">
				{!!p.loginAccount && !!p.loginAccount.id && !!p.portfolioTotals &&
					<Link
						className={classnames('site-nav-link', MY_POSITIONS, { active: [MY_POSITIONS, MY_MARKETS, MY_REPORTS].indexOf(p.activeView) > -1 })}
						{...p.myPositionsLink}
					>
						Portfolio
					</Link>
				}
				{!!p.loginAccount && !!p.loginAccount.id &&
					<Link
						className={classnames('site-nav-link', TRANSACTIONS, { active: p.activeView === TRANSACTIONS }, { working: p.isTransactionsWorking })}
						title={p.loginAccount.realEther && `real ether: ${p.loginAccount.realEther.full}`}
						{...p.transactionsLink}
					>
						{p.transactionsTotals.title}
					</Link>
				}
				{!!p.loginAccount && !!p.loginAccount.id &&
					<Link
						className={classnames('site-nav-link', ACCOUNT, { active: p.activeView === ACCOUNT })}
						title={p.loginAccount.realEther && `${p.loginAccount.realEther.full} real ETH`}
						{...p.accountLink}
					>
						Account
					</Link>
				}
				{(!p.loginAccount || !p.loginAccount.id) &&
					<Link className={classnames('site-nav-link', AUTH_TYPES[p.activeView], { active: !!AUTH_TYPES[p.activeView] })} {...p.authLink}>
						Sign Up / Login
					</Link>
				}
			</div>
		</nav>
	</header>
);

export default SiteHeader;

// TODO -- Prop Validations
// SiteHeader.propTypes = {
// 	activeView: PropTypes.string,
// 	loginAccount: PropTypes.object,
// 	transactionsTotals: PropTypes.object,
// 	isTransactionsWorking: PropTypes.bool,
// 	marketsLink: PropTypes.object,
// 	myPositionsLink: PropTypes.object,
// 	transactionsLink: PropTypes.object,
// 	authLink: PropTypes.object,
// 	portfolioTotals: PropTypes.object
// };
