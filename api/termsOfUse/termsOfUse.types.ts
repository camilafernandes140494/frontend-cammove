export type ContentTermsOfUse = {
	title: string;
	intro: string[];
	sections: {
		title: string;
		content: string[];
	}[];
};
export type TermsOfUseData = {
	id?: string;
	content: ContentTermsOfUse;
	createdAt: string;
	isActive: boolean;
	version: string;
};
