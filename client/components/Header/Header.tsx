import React, { useState } from 'react';
import classNames from 'classnames';
import { Button, AnchorButton, Intent } from '@blueprintjs/core';

import { GridWrapper, Avatar, ScopeDropdown, MenuButton, MenuItem } from 'components';
import { usePageContext } from 'utils/hooks';
import { getResizedUrl } from 'utils/images';
import { apiFetch } from 'client/utils/apiFetch';

require('./header.scss');

type OwnProps = {
	previewContext?: any;
};

const defaultProps = {
	previewContext: undefined,
};

type Props = OwnProps & typeof defaultProps;

const Header = (props: Props) => {
	const { locationData, communityData, loginData, scopeData } = usePageContext(
		props.previewContext,
	);
	const [isLoading, setIsLoading] = useState(false);
	const handleLogout = () => {
		// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
		apiFetch('/api/logout').then(() => {
			window.location.href = '/';
		});
	};
	const handleCreatePub = () => {
		setIsLoading(true);
		return (
			apiFetch
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'post' does not exist on type '(path: any... Remove this comment to see the full error message
				.post('/api/pubs', { communityId: communityData.id })
				.then((newPub) => {
					window.location.href = `/pub/${newPub.slug}`;
				})
				.catch((err) => {
					console.error(err);
					setIsLoading(false);
				})
		);
	};

	const calculateComponentClasses = (hideHero) => {
		let dynamicComponentClasses = '';

		const isLanding = locationData.path === '/';
		const isBasePubPub = locationData.isBasePubPub;
		const backgroundColorChange =
			communityData.heroBackgroundColor &&
			communityData.accentColorDark !== communityData.heroBackgroundColor;
		const textColorChange =
			communityData.heroTextColor &&
			communityData.accentTextColor !== communityData.heroTextColor;

		if ((!isBasePubPub && !backgroundColorChange) || !isLanding) {
			dynamicComponentClasses += ' accent-background';
		}
		if ((!isBasePubPub && !textColorChange) || (!isBasePubPub && !isLanding)) {
			dynamicComponentClasses += ' accent-color';
		}
		if (isBasePubPub && locationData.path === '/') {
			dynamicComponentClasses += ' bp3-dark';
		}
		if (hideHero) {
			return dynamicComponentClasses;
		}
		const heroTextColor = communityData.heroTextColor || communityData.accentTextColor;
		if (heroTextColor === '#FFFFFF') {
			dynamicComponentClasses += ' bp3-dark';
		}
		return dynamicComponentClasses;
	};

	const calculateMainClasses = (hideHero) => {
		let dynamicMainClasses = 'main';
		if (hideHero) {
			return dynamicMainClasses;
		}
		if (
			!communityData.hideHero &&
			communityData.useHeaderGradient &&
			communityData.heroBackgroundImage
		) {
			dynamicMainClasses += ' gradient bp3-dark';
		}
		return dynamicMainClasses;
	};

	const calculateHeroClasses = (hideHero) => {
		let dynamicHeroClasses = 'hero';
		if (hideHero) {
			return dynamicHeroClasses;
		}
		if (communityData.heroAlign === 'center') {
			dynamicHeroClasses += ' centered';
		}
		return dynamicHeroClasses;
	};

	const calculateBackgroundStyle = (hideHero) => {
		const backgroundStyle = {};
		if (locationData.isBasePubPub) {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'boxShadow' does not exist on type '{}'.
			backgroundStyle.boxShadow =
				locationData.path === '/'
					? ''
					: '0 0 0 1px rgba(16, 22, 26, 0.1), 0 0 0 rgba(16, 22, 26, 0), 0 1px 1px rgba(16, 22, 26, 0.2)';
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
			backgroundStyle.backgroundColor = locationData.path === '/' ? '' : '#f7f7f9';
		}

		if (hideHero) {
			return backgroundStyle;
		}

		if (communityData.heroBackgroundImage) {
			const resizedBackgroundImage = getResizedUrl(
				communityData.heroBackgroundImage,
				'fit-in',
				'1500x600',
			);
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundImage' does not exist on type ... Remove this comment to see the full error message
			backgroundStyle.backgroundImage = `url("${resizedBackgroundImage}")`;
		}
		const heroBackgroundColor =
			communityData.heroBackgroundColor || communityData.accentColorDark;
		if (heroBackgroundColor) {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
			backgroundStyle.backgroundColor = communityData.heroBackgroundColor;
		}

		return backgroundStyle;
	};

	const hideHero = locationData.path !== '/' || communityData.hideHero;
	const hideHeaderLogo = !hideHero && communityData.hideHeaderLogo;
	const componentClasses = calculateComponentClasses(hideHero);
	const mainClasses = calculateMainClasses(hideHero);
	const heroClasses = calculateHeroClasses(hideHero);
	const backgroundStyle = calculateBackgroundStyle(hideHero);

	const loggedIn = !!loginData.slug;
	const canManage = scopeData.activePermissions.canManageCommunity;
	const isBasePubPub = locationData.isBasePubPub;

	const resizedHeaderLogo = getResizedUrl(communityData.headerLogo, 'fit-in', '0x50');
	const resizedHeroLogo = getResizedUrl(communityData.heroLogo, 'fit-in', '0x200');
	const resizedHeroImage = getResizedUrl(communityData.heroImage, 'fit-in', '600x0');
	const redirectString = `?redirect=${locationData.path}${
		locationData.queryString.length > 1 ? locationData.queryString : ''
	}`;
	const heroPrimaryButton = communityData.heroPrimaryButton || {};
	const heroSecondaryButton = communityData.heroSecondaryButton || {};
	const isPreview = !!props.previewContext;

	return (
		<header
			className={classNames([
				'header-component',
				componentClasses,
				isPreview ? 'preview' : '',
			])}
			style={backgroundStyle}
		>
			<div className={mainClasses}>
				<GridWrapper columnClassName="main-content">
					<div className="logo-wrapper">
						{!hideHeaderLogo && (
							<a href="/" aria-label={communityData.title}>
								{communityData.headerLogo && (
									<React.Fragment>
										<img
											alt=""
											style={isBasePubPub ? { padding: '1px 0px' } : {}}
											src={resizedHeaderLogo}
										/>
									</React.Fragment>
								)}
								{!communityData.headerLogo && <span>{communityData.title}</span>}
							</a>
						)}
					</div>
					<div className="buttons-wrapper">
						{isBasePubPub && (
							<React.Fragment>
								<AnchorButton
									href="/pricing"
									minimal={true}
									large={true}
									text="Pricing"
								/>
								<AnchorButton
									href="/search"
									minimal={true}
									large={true}
									text="Search"
									className="hide-on-mobile"
								/>
								<AnchorButton
									href="/about"
									minimal={true}
									large={true}
									text="About"
								/>
							</React.Fragment>
						)}
						{!isBasePubPub &&
							loggedIn &&
							(!communityData.hideCreatePubButton || canManage) && (
								<Button
									large={true}
									minimal={true}
									text="Create Pub"
									onClick={handleCreatePub}
									loading={isLoading}
								/>
							)}
						{!isBasePubPub && (
							<AnchorButton
								href="/search"
								minimal={true}
								large={true}
								text="Search"
								className="hide-on-mobile"
							/>
						)}
						{!isBasePubPub && (
							<MenuButton
								aria-label="Dashboard Menu"
								placement="bottom-end"
								menuStyle={{ zIndex: 20 }}
								buttonProps={{
									// @ts-expect-error ts-migrate(2322) FIXME: Object literal may only specify known properties, ... Remove this comment to see the full error message
									className: 'header-dashboard-button hide-on-mobile',
									minimal: true,
									large: true,
									rightIcon: 'caret-down',
								}}
								buttonContent="Dashboard"
							>
								<ScopeDropdown />
							</MenuButton>
						)}
						{loggedIn && (
							<MenuButton
								aria-label="User menu"
								placement="bottom-end"
								// The z-index of the PubHeaderFormatting is 19
								menuStyle={{ zIndex: 20 }}
								buttonProps={{
									minimal: true,
									// @ts-expect-error
									large: true,
								}}
								buttonContent={
									<Avatar
										initials={loginData.initials}
										avatar={loginData.avatar}
										width={30}
									/>
								}
							>
								<MenuItem
									// @ts-expect-error ts-migrate(2322) FIXME: Property 'href' does not exist on type 'IntrinsicA... Remove this comment to see the full error message
									href={`/user/${loginData.slug}`}
									text={
										<React.Fragment>
											{loginData.fullName}
											<span className="subtext" style={{ marginLeft: 4 }}>
												View Profile
											</span>
										</React.Fragment>
									}
								/>
								{/* @ts-expect-error ts-migrate(2322) FIXME: Property 'href' does not exist on type 'IntrinsicA... Remove this comment to see the full error message */}
								<MenuItem href="/legal/settings" text="Privacy settings" />
								{/* @ts-expect-error ts-migrate(2322) FIXME: Property 'onClick' does not exist on type 'Intrins... Remove this comment to see the full error message */}
								<MenuItem onClick={handleLogout} text="Logout" />
							</MenuButton>
						)}
						{!loggedIn && (
							<AnchorButton
								large={true}
								minimal={true}
								text="Login or Signup"
								href={`/login${redirectString}`}
							/>
						)}
					</div>
				</GridWrapper>
			</div>
			{!hideHero && (
				<div className={heroClasses}>
					<GridWrapper columnClassName="hero-content">
						<div className="hero-copy">
							{communityData.heroLogo && (
								<div className="hero-logo">
									<img alt={communityData.title} src={resizedHeroLogo} />
								</div>
							)}
							{communityData.heroTitle && (
								<div className="hero-title">{communityData.heroTitle}</div>
							)}
							{communityData.heroText && (
								<div className="hero-text">{communityData.heroText}</div>
							)}
							<div className="hero-button">
								{heroPrimaryButton.title && (
									<AnchorButton
										intent={Intent.PRIMARY}
										large={true}
										text={heroPrimaryButton.title}
										href={heroPrimaryButton.url}
									/>
								)}
								{heroSecondaryButton.title && (
									<AnchorButton
										large={true}
										minimal={true}
										text={heroSecondaryButton.title}
										href={heroSecondaryButton.url}
									/>
								)}
							</div>
						</div>
						{communityData.heroImage && (
							<div className="hero-image">
								<img alt="Community banner" src={resizedHeroImage} />
							</div>
						)}
					</GridWrapper>
				</div>
			)}
		</header>
	);
};
Header.defaultProps = defaultProps;
export default Header;
