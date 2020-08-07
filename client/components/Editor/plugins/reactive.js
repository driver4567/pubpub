import { createReactivePlugin } from '@pubpub/prosemirror-reactive';

export default (schema, props) => {
	if (props.isReadOnly) {
		return [];
	}
	return createReactivePlugin({ schema: schema });
};
