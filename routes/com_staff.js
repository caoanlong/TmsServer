const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')

const snowflake = require('../utils/snowflake')
const genPassword = require('../utils/cryptoPassword')

const Com_staff = require('../model/Com_staff')
const Sys_role = require('../model/Sys_role')
const Sys_staff_role = require('../model/Sys_staff_role')
const Sys_organization = require('../model/Sys_organization')

// 统一返回格式
let responseData
router.use((req, res, next) => {
	responseData = {
		code: 0,
		msg: '成功'
	}
	next()
})


/* 获取员工列表 */
router.get('/list', (req, res) => {
	let pageIndex = Number(req.query.pageIndex || 1)
	let pageSize = Number(req.query.pageSize || 10)
	let RealName = req.query.RealName
	let Mobile = req.query.Mobile
	let Company_ID = req.query.Company_ID
	pageIndex = Math.max( pageIndex, 1 )
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (RealName) {
		where['RealName'] = { $like: '%' + RealName + '%' }
	}
	if (Mobile) {
		where['Mobile'] = { $like: '%' + Mobile + '%' }
	}
	if (Company_ID) {
		where['Company_ID'] = Company_ID
	}
	Com_staff.findAndCountAll({
		where: where,
		offset: offset,
		limit: pageSize,
		order: [
			['CreateTime', 'DESC']
		],
		include: [
			{
				model: Sys_organization,
				as: 'company'
			}
		]
	}).then(staffs => {
		responseData.data = staffs
		responseData.data.pageIndex = pageIndex
		responseData.data.pageSize = pageSize
		res.json(responseData)
	})
})

/* 获取员工详情 */
router.get('/info', (req, res) => {
	let Staff_ID = req.query.Staff_ID
	Com_staff.findById(Staff_ID, {
		include: [
			{
				model: Sys_role
			},
			{
				model: Sys_organization,
				as: 'company'
			}
		]
	}).then(staff => {
		responseData.data = staff
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 添加员工 */
router.post('/add', (req, res) => {
	let Staff_ID = snowflake.nextId()
	let Company_ID = req.body.Company_ID
	let Member_ID = req.body.Member_ID
	let HeadPic = req.body.HeadPic
	let RealName = req.body.RealName
	let Mobile = req.body.Mobile
	let StaffCode = req.body.StaffCode
	let EntryDate = req.body.EntryDate
	let PositionType = req.body.PositionType
	let Position = req.body.Position
	let Photo = req.body.Photo
	let PCID = req.body.PCID
	let LoginFlag = req.body.LoginFlag
	let CreateBy = req.user.userID
	let UpdateBy = req.user.userID
	let Remark = req.body.Remark
	let sys_roles = req.body.sys_roles
	Password = genPassword(Password)
	Com_staff.create({
		Staff_ID,
		Company_ID,
		LoginName,
		Password,
		PayPassword,
		JobNo,
		Name,
		Sex,
		Email,
		Phone,
		Mobile,
		Type,
		Photo,
		PCID,
		LoginFlag,
		CreateBy,
		UpdateBy,
		Remark
	}).then(staff => {
		for (let i = 0; i < sys_roles.length; i++) {
			Sys_staff_role.create({
				user_id: staff.Staff_ID,
				role_id: sys_roles[i]
			})
		}
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 批量添加员工 */
router.post('/addmutip', (req, res) => {
	let staffs = req.body.staffs
	for (let i = 0; i < staffs.length; i++) {
		staffs[i].User_ID = snowflake.nextId()
		staffs[i].CreateBy = req.user.userID
		staffs[i].UpdateBy = req.user.userID
		staffs[i].Remark = ''
		Password = genPassword(staffs[i].Password)
	}
	Com_staff.bulkCreate(staffs).then(staff => {
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 修改员工 */
router.post('/update', (req, res) => {
	let Staff_ID = req.body.Staff_ID
	let Company_ID = req.body.Company_ID || ''
	let LoginName = req.body.LoginName
	let Password = req.body.Password
	let PayPassword = req.body.PayPassword || ''
	let JobNo = req.body.JobNo
	let Name = req.body.Name
	let Sex = req.body.Sex
	let Email = req.body.Email
	let Phone = req.body.Phone
	let Mobile = req.body.Mobile
	let Type = req.body.Type
	let Photo = req.body.Photo || ''
	let PCID = req.body.PCID || ''
	let LoginFlag = req.body.LoginFlag
	let UpdateBy = req.user.userID
	let Remark = req.body.Remark || ''
	let sys_roles = req.body.sys_roles || []
	let property = {
		Company_ID,
		LoginName,
		PayPassword,
		JobNo,
		Name,
		Sex,
		Email,
		Phone,
		Mobile,
		Type,
		Photo,
		PCID,
		LoginFlag,
		UpdateBy,
		Remark,
		UpdateDate: new Date()
	}
	if (Password) {
		property['Password'] = genPassword(Password)
	}
	Com_staff.update(property,{
		where: {
			Staff_ID
		}
	}).then(() => {
		Sys_staff_role.destroy({
			where: {
				staff_id: Staff_ID
			}
		}).then(() => {
			for (let i = 0; i < staffs.length; i++) {
				Sys_staff_role.create({
					staff_id: Staff_ID,
					role_id: staffs[i]
				})
			}
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 删除员工 */
router.post('/delete', (req, res) => {
	let ids = req.body.ids
	Com_staff.destroy({
		where: {
			Staff_ID: {
				$in: ids
			}
		}
	}).then(() => {
		Sys_staff_role.destroy({
			where: {
				staff_id: {
					$in: ids
				}
			}
		}).then(() => {
			res.json(responseData)
		})
	})
})

module.exports = router