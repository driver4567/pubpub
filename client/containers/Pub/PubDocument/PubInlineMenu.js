import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Icon from 'components/Icon/Icon';
import uuidv4 from 'uuid/v4';
import { setLocalHighlight } from '@pubpub/editor';

require('./pubInlineMenu.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	// onNewHighlightDiscussion: PropTypes.func,
	openLinkMenu: PropTypes.func,
};

const defaultProps = {
	openLinkMenu: () => {},
	// onNewHighlightDiscussion: () => {},
};

const PubInlineMenu = (props) => {
	const { pubData, collabData } = props;
	const selection = collabData.editorChangeObject.selection || {};
	const selectionBoundingBox = collabData.editorChangeObject.selectionBoundingBox || {};

	if (
		!collabData.editorChangeObject.selection ||
		selection.empty ||
		collabData.editorChangeObject.selectedNode
	) {
		return null;
	}

	const menuStyle = {
		position: 'absolute',
		top: selectionBoundingBox.top - 50 + window.scrollY,
		left: selectionBoundingBox.left,
	};
	const menuItems = collabData.editorChangeObject.menuItems;
	const menuItemsObject = menuItems.reduce((prev, curr) => {
		return { ...prev, [curr.title]: curr };
	}, {});
	const formattingItems = [
		{ key: 'header1', icon: <Icon icon="header-one" /> },
		{ key: 'header2', icon: <Icon icon="header-two" /> },
		{ key: 'strong', icon: <Icon icon="bold" /> },
		{ key: 'em', icon: <Icon icon="italic" /> },
		{ key: 'link', icon: <Icon icon="link" /> },
	];
	const isReadOnly = pubData.isStaticDoc || !pubData.canEditBranch;
	console.log('isReadOnly', isReadOnly);
	// TODO: Make discussions disable-able
	// if (isReadOnly && !pubData.publicDiscussions) {
	// 	return null;
	// }
	return (
		<div className="pub-inline-menu-component bp3-elevation-2" style={menuStyle}>
			{!isReadOnly &&
				formattingItems.map((item) => {
					if (!menuItemsObject[item.key]) {
						return null;
					}
					const onClickAction =
						item.key === 'link'
							? () => {
									menuItemsObject[item.key].run();
									props.openLinkMenu();
							  }
							: menuItemsObject[item.key].run;
					return (
						<Button
							key={item.key}
							className="bp3-minimal"
							icon={item.icon}
							active={menuItemsObject[item.key].isActive}
							onClick={onClickAction}
							onMouseDown={(evt) => {
								evt.preventDefault();
							}}
						/>
					);
				})}
			<Button
				className="bp3-minimal"
				icon={<Icon icon="chat" />}
				onClick={() => {
					const view = collabData.editorChangeObject.view;
					setLocalHighlight(view, selection.from, selection.to, uuidv4());
					// props.onNewHighlightDiscussion({
					// 	from: collabData.editorChangeObject.selection.from,
					// 	to: props.collabData.editorChangeObject.selection.to,
					// 	version: pubData.activeVersion.id,
					// 	// section: props.sectionId,
					// 	exact: props.collabData.editorChangeObject.selectedText.exact,
					// 	prefix: props.collabData.editorChangeObject.selectedText.prefix,
					// 	suffix: props.collabData.editorChangeObject.selectedText.suffix,
					// });
				}}
			/>
		</div>
	);
};

PubInlineMenu.propTypes = propTypes;
PubInlineMenu.defaultProps = defaultProps;
export default PubInlineMenu;
