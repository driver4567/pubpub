import React, { useState } from 'react';
import { Icon, Popover, Menu, MenuItem } from '@blueprintjs/core';
import dateFormat from 'dateformat';

import { licenses, getLicenseBySlug } from 'utils/licenses';
import { usePageContext } from 'utils/hooks';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { apiFetch } from 'client/utils/apiFetch';

require('./licenseSelect.scss');

type OwnProps = {
	children: (...args: any[]) => any;
	pubData: {
		id?: string;
		licenseSlug?: string;
		collectionPubs?: any[];
	};
	onSelect?: (...args: any[]) => any;
	updateLocalData?: (...args: any[]) => any;
	persistSelections?: boolean;
};

const defaultProps = {
	onSelect: () => {},
	updateLocalData: () => {},
	persistSelections: true,
};

type Props = OwnProps & typeof defaultProps;

const LicenseSelect = (props: Props) => {
	const { children, onSelect, persistSelections, pubData, updateLocalData } = props;
	const [isPersisting, setIsPersisting] = useState(false);
	const { communityData } = usePageContext();

	const currentLicense = getLicenseBySlug(pubData.licenseSlug);
	// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
	const primaryCollectionPub = pubData.collectionPubs.find((cp) => cp.isPrimary);
	const collectionPubDate = primaryCollectionPub
		? primaryCollectionPub.collection.metadata.copyrightYear ||
		  primaryCollectionPub.collection.metadata.date ||
		  primaryCollectionPub.collection.metadata.publicationDate
		: null;
	const pubCopyrightDate =
		dateFormat(collectionPubDate, 'yyyy') || dateFormat(getPubPublishedDate(pubData), 'yyyy');
	let pubPublisher = communityData.title;
	if (communityData.id === '78810858-8c4a-4435-a669-6bb176b61d40') {
		pubPublisher = 'Massachusetts Institute of Technology';
	}
	// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
	if (currentLicense.slug === 'copyright') {
		// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
		currentLicense.full = `Copyright © ${pubCopyrightDate} ${pubPublisher}. All rights reserved.`;
	}
	const selectLicense = (license) => {
		onSelect(license);
		if (persistSelections) {
			setIsPersisting(true);
			apiFetch('/api/pubs', {
				method: 'PUT',
				body: JSON.stringify({
					licenseSlug: license.slug,
					pubId: pubData.id,
					communityId: communityData.id,
				}),
			}).then(() => {
				setIsPersisting(false);
				updateLocalData('pub', { licenseSlug: license.slug });
			});
		}
	};

	const renderIcon = (license) => (
		<img width={75} alt="" src={`/static/license/${license.slug}.svg`} />
	);

	const renderMenu = () => {
		return (
			<Menu>
				{licenses
					.filter((license) => {
						return communityData.premiumLicenseFlag || !license.requiresPremium;
					})
					.map((license) => (
						<MenuItem
							key={license.slug}
							onClick={() => selectLicense(license)}
							className="license-select-component__menu-item"
							text={
								<div>
									<div className="title">
										{license.short}{' '}
										{license.link && (
											<a
												href={license.link}
												className="link"
												onClick={(e) => e.stopPropagation()}
												target="_blank"
												rel="noopener noreferrer"
											>
												Learn more
												<Icon iconSize={12} icon="share" />
											</a>
										)}
									</div>
									{license.slug === 'copyright' && (
										<div className="full">
											Copyright © {pubCopyrightDate} {pubPublisher}. All
											rights reserved.
										</div>
									)}
									{license.slug !== 'copyright' && (
										<div className="full">{license.full}</div>
									)}
								</div>
							}
							icon={renderIcon(license)}
							labelElement={
								// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
								license.slug === currentLicense.slug && <Icon icon="tick" />
							}
						/>
					))}
			</Menu>
		);
	};

	return (
		<Popover content={renderMenu()}>
			{children({
				icon: renderIcon(currentLicense),
				// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
				title: currentLicense.full,
				isPersisting: isPersisting,
			})}
		</Popover>
	);
};
LicenseSelect.defaultProps = defaultProps;
export default LicenseSelect;
