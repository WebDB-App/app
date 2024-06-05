export const environment = {
	production: true,
	rootUrl: '/',
	get apiRootUrl() {
		return this.rootUrl + 'api/'
	},
};
