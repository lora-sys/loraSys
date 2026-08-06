export type Categories = string;

export type Post = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: string[];
	published: boolean;
	readingTime?: number;
	year?: number;
};

/** Work experience entry — shared between resume data and page component */
export interface WorkItem {
	title?: string;
	company?: string;
	start?: string;
	end?: string;
	location?: string;
	description?: string;
	badges?: string[];
	logoUrl?: string;
	href?: string;
}
