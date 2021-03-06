import { renderHtmlChildren } from '../utils/renderHtml';

export default {
	audio: {
		atom: true,
		attrs: {
			url: { default: null },
			size: { default: 50 }, // number as percentage
			align: { default: 'center' },
			caption: { default: '' },
		},
		parseDOM: [
			{
				tag: 'figure',
				getAttrs: (node) => {
					if (node.getAttribute('data-node-type') !== 'audio') {
						return false;
					}
					return {
						url: node.firstChild.getAttribute('src') || null,
						size: Number(node.getAttribute('data-size')) || 50,
						align: node.getAttribute('data-align') || 'center',
						caption: node.firstChild.getAttribute('alt') || '',
					};
				},
			},
		],
		// @ts-expect-error ts-migrate(2525) FIXME: Initializer provides no value for this binding ele... Remove this comment to see the full error message
		toDOM: (node, { isReact } = {}) => {
			return [
				'figure',
				{
					'data-node-type': 'audio',
					'data-size': node.attrs.size,
					'data-align': node.attrs.align,
				},
				[
					'audio',
					{
						controls: true,
						preload: 'metadata',
						src: node.attrs.url,
						alt: node.attrs.caption,
					},
				],
				['figcaption', {}, renderHtmlChildren(isReact, node.attrs.caption, 'div')],
			];
		},
		inline: false,
		group: 'block',

		/* These are not part of the standard Prosemirror Schema spec */
		onInsert: (view, attrs) => {
			const audioNode = view.state.schema.nodes.audio.create(attrs);
			const transaction = view.state.tr.replaceSelectionWith(audioNode);
			view.dispatch(transaction);
		},
		defaultOptions: {},
	},
};
