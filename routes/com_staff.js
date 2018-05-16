const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')

const snowflake = require('../utils/snowflake')
const genPassword = require('../utils/cryptoPassword')

const Com_staff = require('../model/Com_staff')
const Sys_role = require('../model/Sys_role')
const Sys_staff_role = require('../model/Sys_staff_role')
const Com_companyinfo = require('../model/Com_companyinfo')
const { findCompanyIDByUser } = require('../utils/common')

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
	pageIndex = Math.max( pageIndex, 1 )
	let offset = (pageIndex - 1) * pageSize
	let where = {
		DeleteFlag: 'N'
	}
	if (RealName) {
		where['RealName'] = { $like: '%' + RealName + '%' }
	}
	if (Mobile) {
		where['Mobile'] = { $like: '%' + Mobile + '%' }
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
				model: Com_companyinfo,
				as: 'company'
			}
		]
	}).then(staffs => {
		let staffList = staffs.rows.map(item => {
			return {
				Staff_ID: item.Staff_ID,
				Member_ID: item.Member_ID,
				HeadPic: item.HeadPic,
				RealName: item.RealName,
				Mobile: item.Mobile,
				StaffCode: item.StaffCode,
				EntryDate: item.EntryDate,
				PositionType: item.PositionType,
				Position: item.Position,
				WorkStatus: item.WorkStatus,
				Status: item.Status,
				InLeave: item.InLeave,
				Remark: item.Remark,
				CreateBy: item.CreateBy,
				UpdateBy: item.UpdateBy,
				CreateTime: item.CreateTime,
				UpdateTime: item.UpdateTime
			}
		})
		staffs.rows = staffList
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
				model: Com_companyinfo,
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
	let Member_ID = req.body.Member_ID
	let HeadPic = req.body.HeadPic
	let RealName = req.body.RealName
	let Mobile = req.body.Mobile
	let StaffCode = req.body.StaffCode
	let EntryDate = req.body.EntryDate
	let PositionType = req.body.PositionType
	let Position = req.body.Position
	let WorkStatus = req.body.WorkStatus
	let Status = req.body.Status
	let InLeave = req.body.InLeave
	let Remark = req.body.Remark
	let CreateBy = req.user.userID
	let UpdateBy = req.user.userID
	let sys_roles = req.body.sys_roles
	findCompanyIDByUser(req.user.userID).then(Company_ID => {
		Com_staff.create({
			Staff_ID,
			Company_ID,
			Member_ID,
			HeadPic,
			RealName,
			Mobile,
			StaffCode,
			EntryDate,
			PositionType,
			Position,
			WorkStatus,
			Status,
			InLeave,
			Remark,
			CreateBy,
			UpdateBy
		}).then(staff => {
			let staffRoles = []
			for (let i = 0; i < sys_roles.length; i++) {
				staffRoles.push({
					Staff_ID: staff.Staff_ID,
					Role_ID: sys_roles[i]
				})
			}
			Sys_staff_role.bulkCreate(staffRoles).then(() => {
				res.json(responseData)
			})
		}).catch(err => {
			responseData.code = 100
			responseData.msg = '错误：' + err
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = err
		res.json(responseData)
	})
})

/* 修改员工 */
router.post('/update', (req, res) => {
	let Staff_ID = req.body.Staff_ID
	let Member_ID = req.body.Member_ID
	let HeadPic = req.body.HeadPic
	let RealName = req.body.RealName
	let Mobile = req.body.Mobile
	let StaffCode = req.body.StaffCode
	let EntryDate = req.body.EntryDate
	let PositionType = req.body.PositionType
	let Position = req.body.Position
	let WorkStatus = req.body.WorkStatus
	let Status = req.body.Status
	let InLeave = req.body.InLeave
	let Remark = req.body.Remark
	let UpdateBy = req.user.userID
	let sys_roles = req.body.sys_roles
	Com_staff.update({
		Member_ID,
		HeadPic,
		RealName,
		Mobile,
		StaffCode,
		EntryDate,
		PositionType,
		Position,
		WorkStatus,
		Status,
		InLeave,
		Remark,
		UpdateBy,
		UpdateDate: new Date()
	},{
		where: {
			Staff_ID
		}
	}).then(() => {
		Sys_staff_role.destroy({
			where: {
				staff_id: Staff_ID
			}
		}).then(() => {
			let staffRoles = []
			for (let i = 0; i < sys_roles.length; i++) {
				staffRoles.push({
					Staff_ID: Staff_ID,
					Role_ID: sys_roles[i]
				})
			}
			Sys_staff_role.bulkCreate(staffRoles).then(() => {
				res.json(responseData)
			})
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
	Com_staff.update({
		DeleteFlag: 'Y'
	}, {
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
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

module.exports = router