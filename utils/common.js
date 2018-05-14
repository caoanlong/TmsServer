exports.dedupe = function (array) {
	return Array.from(new Set(array))
}