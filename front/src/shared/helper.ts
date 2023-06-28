export function isNested (data: any) {
	const type = typeof data;
	return Array.isArray(data) || (type === 'object' && data !== null);
}
