export type TPost = {
	id: string;
	slug: string;
	data: {
		heroImage?: string | undefined;
		title: string;
		pubDate: Date;
		updatedDate?: Date | undefined;
	};
	[key: string]: unknown;
};
