
let uuidNum = () => {
	let result = ''
	for (let i = 0; i < 6; i++) {
		let ran = Math.floor(Math.random()*10)
		result += ran
	}
	result += new Date().getTime()
	return parseInt(result.substr(1))
}


module.exports = uuidNum