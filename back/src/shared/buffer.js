module.exports.loadData = function (rows) {
	return rows.map(row => {
		for (const [key, col] of Object.entries(row)) {
			if (Buffer.isBuffer(col)) {
				row[key] = col.toString();
			}
		}
		return row;
	});
};
