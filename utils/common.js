const Com_companyinfo = require('../model/Com_companyinfo')
const Com_staff = require('../model/Com_staff')

// 去重
exports.dedupe = function (array) {
	return Array.from(new Set(array))
}


// 根据登录会员查找公司ID
exports.findCompanyIDByUser = function (userID) {
	return new Promise((resolve, reject) => {
		Com_companyinfo.find({Respo_ID: userID}).then(com_companyinfo => {
			if (com_companyinfo.Company_ID) {
				resolve(com_companyinfo.Company_ID)
			} else {
				Com_staff.find({ Member_ID: userID }, { where: { InLeave: 'N' }}).then(com_staff => {
					if (com_staff.Company_ID) {
						resolve(com_staff.Company_ID)
					} else {
						reject('查不到companyID！')
					}
				})
			}
		})
	})
}

// 获取客户端ip
exports.getClientIp = function (req) {
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
}