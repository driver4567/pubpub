import React from 'react';
import { Button } from '@blueprintjs/core';

import { Icon } from 'components';

import PubToc from './PubToc';

require('./pubHeaderSticky.scss');

type Props = {
	pubData: {
		title?: string;
	};
	pubHeadings: any[];
};

const PubHeaderSticky = (props: Props) => {
	const { pubData, pubHeadings } = props;
	return (
		<div className="pub-header-sticky-component">
			<div className="sticky-title">{pubData.title}</div>
			<div className="sticky-buttons">
				{pubHeadings.length > 0 && (
					<React.Fragment>
						{/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
						<PubToc headings={pubHeadings}>
							{({ ref, ...disclosureProps }) => (
								<Button minimal={true} {...disclosureProps} elementRef={ref}>
									Contents
								</Button>
							)}
						</PubToc>
						<span className="dot">·</span>
					</React.Fragment>
				)}
				<Button
					minimal={true}
					onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'auto' })}
					icon={<Icon icon="double-chevron-up" />}
				/>
			</div>
		</div>
	);
};
export default PubHeaderSticky;
