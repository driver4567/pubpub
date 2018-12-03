import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./adminDashboard.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class AdminDashboard extends React.Component {
	componentDidMount() {
	}

	render() {
		return (
			<div id="dashboard-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					hideNav={true}
					hideFooter={true}
				>
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h1>Dashboard</h1>
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

AdminDashboard.propTypes = propTypes;
export default AdminDashboard;

hydrateWrapper(AdminDashboard);
