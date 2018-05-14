const crypto = require('crypto')

let genPassword = function (plainPswd) {
	let saltBytes = crypto.randomBytes(8)
	let pswdBytes = Buffer.from(plainPswd)
	let sha1 = crypto.createHash('sha1')
	sha1.update(saltBytes)
	sha1.update(pswdBytes)
	let rslt = Buffer.from(sha1.digest())
	for (let i=1; i< 1024; i++) {
		sha1 = crypto.createHash('sha1')
		sha1.update(rslt)
		rslt = Buffer.from(sha1.digest())
	}
	return saltBytes.toString('hex') + rslt.toString('hex')
}

module.exports = genPassword