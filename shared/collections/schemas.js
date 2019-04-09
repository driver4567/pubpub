import { communityUrl } from 'shared/util/canonicalUrls';

const types = {
	date: {
		name: 'date',
		deserialize: (str) => new Date(str),
	},
};

const sharedFields = {
	doi: {
		name: 'doi',
		label: 'DOI',
		derivedFrom: ({ collection }) => collection && collection.doi,
		derivedLabelInfo: '(Registered and cannot be changed)',
	},
	url: {
		name: 'url',
		label: 'URL',
		defaultDerivedFrom: ({ community }) => community && communityUrl(community),
	},
};

const schemas = [
	{
		kind: 'tag',
		label: { singular: 'tag', plural: 'tags' },
		bpDisplayIcon: 'tag',
		metadata: [],
	},
	{
		kind: 'book',
		label: { singular: 'book', plural: 'books' },
		bpDisplayIcon: 'book',
		contextHints: [
			{ value: 'foreword', label: 'Foreword', crossrefComponentType: 'section' },
			{ value: 'preface', label: 'Preface', crossrefComponentType: 'section' },
			{ value: 'supplementaryMaterial', label: 'Supplementary Material' },
			{
				value: 'chapter',
				label: 'Chapter',
				isDefault: true,
				crossrefComponentType: 'chapter',
			},
			{ value: 'appendix', label: 'Appendix', crossrefComponentType: 'reference_entry' },
			{ value: 'glossary', label: 'Glossary', crossrefComponentType: 'reference_entry' },
			{
				value: 'acknowledgements',
				label: 'Acknowledgements',
				crossrefComponentType: 'section',
			},
		],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'isbn', label: 'ISBN' },
			{ name: 'copyrightYear', label: 'Copyright year', pattern: '^[0-9]*$' },
			{ name: 'publicationDate', label: 'Publication date', type: types.date },
			{ name: 'edition', label: 'Edition no.', pattern: '^[0-9]*$' },
		],
	},
	{
		kind: 'issue',
		label: { singular: 'issue', plural: 'issues' },
		bpDisplayIcon: 'manual',
		contextHints: [{ value: 'article', label: 'Article', default: true }],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'printIssn', label: 'Print ISSN' },
			{ name: 'electronicIssn', label: 'Electronic ISSN' },
			{ name: 'volume', label: 'Volume' },
			{ name: 'issue', label: 'Issue' },
			{ name: 'printPublicationDate', label: 'Print publication date', type: types.date },
			{
				name: 'publicationDate',
				label: 'Publication date',
				type: types.date,
			},
		],
	},
	{
		kind: 'conference',
		label: { singular: 'conference', plural: 'conferences' },
		bpDisplayIcon: 'presentation',
		contextHints: [{ value: 'paper', label: 'Paper', default: true }],
		metadata: [
			sharedFields.doi,
			sharedFields.url,
			{ name: 'theme', label: 'Theme' },
			{ name: 'acronym', label: 'Acronym' },
			{ name: 'location', label: 'Location' },
			{ name: 'date', label: 'Date', type: types.date },
		],
	},
];

export default schemas;

export const getSchemaForKind = (kind) => {
	const result = schemas.find((s) => s.kind === kind);
	if (result) {
		return result;
	}
	throw new Error(`No collection schema of kind ${kind} has been defined`);
};
