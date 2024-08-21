export type TPost = {
	id: string;
	slug: string;
	body: string;
	collection: string;
	data: {
		heroImage?: string | undefined;
		title: string;
		pubDate: Date;
		updatedDate?: Date | undefined;
		author: string;
		tags: [string];
	};
	[key: string]: unknown;
};
