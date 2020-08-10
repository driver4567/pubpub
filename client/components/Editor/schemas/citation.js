import { getCitationInlineLabel } from '../utils/citation';
import { counter } from './reactive/counter';

export default {
	citation: {
		atom: true,
		reactive: true,
		attrs: {
			value: { default: '' },
			unstructuredValue: { default: '' },
			id: { default: '' },
			customLabel: { default: '' },
		},
		reactiveAttrs: {
			count: counter('citation', (node) => [node.attrs.value, node.attrs.structuredValue]),
		},
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node) => {
					if (node.getAttribute('data-node-type') !== 'citation') {
						return false;
					}
					return {
						id: node.getAttribute('id'),
						value: node.getAttribute('data-value') || '',
						unstructuredValue: node.getAttribute('data-unstructured-value') || '',
						label: node.getAttribute('data-label') || '',
					};
				},
			},
		],
		toDOM: (node) => {
			const { href, id, count, customLabel, label, value, unstructuredValue } = node.attrs;
			const labelString = getCitationInlineLabel(count, customLabel);
			return [
				href ? 'a' : 'span',
				{
					...(href && { href: href }),
					...(id && { id: id }),
					'data-node-type': 'citation',
					'data-value': value,
					'data-unstructured-value': unstructuredValue,
					'data-count': count,
					'data-label': label,
					class: 'citation',
				},
				labelString,
			];
		},
		inline: true,
		group: 'inline',

		/* These are not part of the standard Prosemirror Schema spec */
		onInsert: (view, attrs) => {
			const citationNode = view.state.schema.nodes.citation.create(attrs);
			const transaction = view.state.tr.replaceSelectionWith(citationNode);
			view.dispatch(transaction);
		},
		defaultOptions: {
			citationsRef: { current: [] },
			citationInlineStyle: 'count',
		},
	},
};
