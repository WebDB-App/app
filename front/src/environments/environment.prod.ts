export const environment = {
	production: true,
	rootUrl: '/',
	stripeUserLink: 'https://billing.stripe.com/p/login/aEU3fif4636o7WUcMM',
	landingApi: "https://api.webdb.app/",
	get apiRootUrl() {
		return this.rootUrl + 'api/'
	},
};
