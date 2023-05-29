export const environment = {
	production: true,
	rootUrl: '/',
	stripeUserLink: 'https://billing.stripe.com/p/login/aEU3fif4636o7WUcMM',
	get apiRootUrl() {
		return this.rootUrl + 'api/'
	},
};
