const express = require('express')
const router = express.Router()
const snowflake = require('../utils/snowflake')

const Sys_organization = require('../model/Sys_organization')
const Com_companyinfo = require('../model/Com_companyinfo')
const Com_staff = require('../model/Com_staff')

// 统一返回格式
let responseData
router.use((req, res, next) => {
	responseData = {
		code: 0,
		msg: '成功'
	}
	next()
})

/* 获取机构列表 */
router.get('/list', (req, res) => {
	let Organization_PID = req.query.Organization_PID || null
	Sys_organization.findAll({
		where: {
			Organization_PID: Organization_PID
		}
	}).then(sys_organizations => {
		responseData.data = sys_organizations
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 获取所有机构列表 */
router.get('/list/all', (req, res) => {
	Sys_organization.findAll().then(sys_organizations => {
		responseData.data = sys_organizations
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 获取机构详情 */
router.get('/info', (req, res) => {
	let Organization_ID = req.query.Organization_ID
	Sys_organization.findById(Organization_ID).then(sys_organization => {
		responseData.data = sys_organization
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 添加机构 */
router.post('/add', (req, res) => {
	let User_ID = req.user.userID
	let Organization_ID = snowflake.nextId()
	let Organization_PID = req.body.Organization_PID || null
	let Area_ID = req.body.Area_ID
	let Name = req.body.Name
	let Grade = req.body.Grade
	let Sort = req.body.Sort
	let Address = req.body.Address
	let ZipCode = req.body.ZipCode
	let Respo_ID = req.body.Respo_ID
	let Respo = req.body.Respo
	let Phone = req.body.Phone
	let Fax = req.body.Fax
	let Email = req.body.Email
	let EnableFlag = req.body.EnableFlag
	let Remark = req.body.Remark
	let CreateBy = User_ID
	let UpdateBy = User_ID
	let Path = ''
	new Promise((resolve, reject) => {
		Com_companyinfo.find({Respo_ID: req.user.userID}).then(com_companyinfo => {
			if (com_companyinfo.Company_ID) {
				resolve(com_companyinfo.Company_ID)
			} else {
				Com_staff.findById(Respo_ID).then(com_staff => {
					if (com_staff.Company_ID) {
						resolve(com_staff.Company_ID)
					} else {
						reject()
					}
				})
			}
		})
	}).then(Company_ID => {
		Sys_organization.findById(Organization_PID).then(sys_organization => {
			if (sys_organization) {
				Path = sys_organization.Path + Organization_PID + ','
			} else {
				Path = '0'
			}
			Sys_organization.create({
				Organization_ID,
				Organization_PID,
				Company_ID,
				Area_ID,
				Name,
				Grade,
				Sort,
				Address,
				ZipCode,
				Respo_ID,
				Respo,
				Phone,
				Fax,
				Email,
				EnableFlag,
				Remark,
				CreateBy,
				UpdateBy,
				Path
			}).then(sys_organization => {
				res.json(responseData)
			}).catch(err => {
				responseData.code = 100
				responseData.msg = '错误：' + err
				res.json(responseData)
			})
		})
	}).catch(() => {
		responseData.code = 100
		responseData.msg = '查不到companyID！'
		res.json(responseData)
	})
})

/* 修改机构 */
router.post('/update', (req, res) => {
	console.log(req.body)
	let User_ID = req.user.userID
	let Organization_ID = req.body.Organization_ID
	let Area_ID = req.body.Area_ID
	let Name = req.body.Name
	let Grade = req.body.Grade
	let Sort = req.body.Sort
	let Address = req.body.Address
	let ZipCode = req.body.ZipCode
	let Respo_ID = req.body.Respo_ID
	let Respo = req.body.Respo
	let Phone = req.body.Phone
	let Fax = req.body.Fax
	let Email = req.body.Email
	let EnableFlag = req.body.EnableFlag
	let Remark = req.body.Remark
	let UpdateBy = User_ID
	let Path = ''
	Sys_organization.update({
		Area_ID,
		Name,
		Grade,
		Sort,
		Address,
		ZipCode,
		Respo_ID,
		Respo,
		Phone,
		Fax,
		Email,
		EnableFlag,
		Remark,
		UpdateBy,
		UpdateTime: new Date()
	}, {
		where: {
			Organization_ID
		}
	}).then(() => {
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 删除机构 */
router.post('/delete', (req, res) => {
	let Organization_ID = req.body.Organization_ID
	Sys_organization.destroy({
		where: {
			Organization_ID
		}
	}).then(() => {
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

module.exports = router