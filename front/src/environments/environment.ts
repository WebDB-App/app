export const environment = {
	production: false,
	rootUrl: '//' + window.location.hostname + ':22070/',
	get apiRootUrl() {
		return this.rootUrl + 'api/'
	},
};
