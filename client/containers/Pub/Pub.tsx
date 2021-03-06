import React from 'react';

import { usePageContext } from 'utils/hooks';

import PubSyncManager from './PubSyncManager';
import PubHeader from './PubHeader';
import PubDocument from './PubDocument';
import { PubSuspendWhileTypingProvider, PubSuspendWhileTyping } from './PubSuspendWhileTyping';

require('./pub.scss');

type Props = {
	pubData: any;
};

const Pub = (props: Props) => {
	const { loginData, locationData, communityData } = usePageContext();
	return (
		<PubSuspendWhileTypingProvider>
			<div id="pub-container">
				<PubSyncManager
					pubData={props.pubData}
					locationData={locationData}
					communityData={communityData}
					loginData={loginData}
				>
					{({ pubData, collabData, firebaseBranchRef, updateLocalData, historyData }) => {
						const modeProps = {
							pubData: pubData,
							collabData: collabData,
							historyData: historyData,
							firebaseBranchRef: firebaseBranchRef,
							updateLocalData: updateLocalData,
						};
						return (
							<React.Fragment>
								<PubSuspendWhileTyping delay={1000}>
									{() => <PubHeader {...modeProps} />}
								</PubSuspendWhileTyping>
								<PubDocument {...modeProps} />
							</React.Fragment>
						);
					}}
				</PubSyncManager>
			</div>
		</PubSuspendWhileTypingProvider>
	);
};
export default Pub;
