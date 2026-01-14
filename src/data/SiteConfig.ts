export type SiteConfig = {
	siteTitle: string;
	siteTitleShort: string;
	siteTitleAlt: string;
	siteLogo: string;
	siteUrl: string;
	pathPrefix: string;
	siteDescription: string;
	siteRss: string;
	siteRssTitle: string;
	siteFBAppID: string;
	googleAnalyticsID: string;
	disqusShortname: string;
	dateFromFormat: string;
	dateFormat: string;
	postsPerPage: number;
	userName: string;
	userEmail: string;
	userTwitter: string;
	userLocation: string;
	userAvatar: string;
	userDescription: string;
	userLinks: Array<{
		label: string;
		url: string;
		iconClassName: string;
	}>;
	copyright: string;
	themeColor: string;
	backgroundColor: string;
};

const config: SiteConfig = {
	siteTitle: "Sebastian Grant",
	siteTitleShort: "Seb Grant",
	siteTitleAlt: "Sebastian Grant - Fine Art",
	siteLogo: "/logos/logo-1024.png",
	siteUrl: "https://sebastiangrant.com",
	pathPrefix: "/",
	siteDescription: "Fine Art - Software Design - Music - Works.",
	siteRss: "/rss.xml",
	siteRssTitle: "Sebastian Grant RSS",
	siteFBAppID: "1825356251115265",
	googleAnalyticsID: "UA-45425714-1",
	disqusShortname: "sebastiangrant-com",
	dateFromFormat: "YYYY-MM-DD",
	dateFormat: "DD/MM/YYYY",
	postsPerPage: 36,
	userName: "Sebastian Grant",
	userEmail: "sebastianlgrant@gmail.com",
	userTwitter: "",
	userLocation: "North Coast NSW, Australia",
	userAvatar: "https://api.adorable.io/avatars/150/test.png",
	userDescription: "Artist and Designer.",
	userLinks: [
		{
			label: "Facebook",
			url: "https://www.facebook.com/sebastiangrantart",
			iconClassName: "fa fa-facebook",
		},
		{
			label: "Email",
			url: "mailto:sebastianlgrant@gmail.com",
			iconClassName: "fa fa-envelope",
		},
	],
	copyright: "Copyright © 2021 Sebastian Grant",
	themeColor: "#c62828",
	backgroundColor: "#e0e0e0",
};

if (config.siteUrl.endsWith("/")) {
	config.siteUrl = config.siteUrl.slice(0, -1);
}

if (config.siteRss && config.siteRss[0] !== "/") {
	config.siteRss = `/${config.siteRss}`;
}

export default config;
