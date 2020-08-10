import { createReactivePlugin } from '@pubpub/prosemirror-reactive';

export default (schema) => {
	return createReactivePlugin({ schema: schema });
};
