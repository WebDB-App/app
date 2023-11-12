export const environment = {
	production: false,
	rootUrl: '//' + window.location.hostname + ':22070/',
	stripeUserLink: 'https://billing.stripe.com/p/login/test_eVacP90bHg5cgQE9AA',
	landingApi: "https://api.webdb.app/",
	get apiRootUrl() {
		return this.rootUrl + 'api/'
	},
};
