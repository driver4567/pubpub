import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { BrowserRouter } from 'react-g-analytics';
import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

/* Require default styles as done in App/App.js */
require('containers/App/blueprint.scss');
require('containers/App/app.scss');

const RouterDecorator = (storyFn) => {
	return (
		<BrowserRouter id="*">
			{ storyFn() }
		</BrowserRouter>
	);
};

/* Require stories */
const req = require.context('./', true, /Stories\.js$/);
function loadStories() {
	addDecorator(RouterDecorator);
	req.keys().forEach(req);
}

configure(loadStories, module);
