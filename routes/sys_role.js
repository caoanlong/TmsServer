const express = require('express')
const router = express.Router()
const snowflake = require('../utils/snowflake')

const Sys_role = require('../model/Sys_role')
const Sys_menu = require('../model/Sys_menu')
const Com_staff = require('../model/Com_staff')
const Sys_staff_role = require('../model/Sys_staff_role')
const Sys_role_menu = require('../model/Sys_role_menu')
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


/* 获取角色列表 */
router.get('/list', (req, res) => {
	let pageIndex = Number(req.query.pageIndex || 1)
	let pageSize = Number(req.query.pageSize || 10)
	let RoleName = req.query.RoleName
	pageIndex = Math.max( pageIndex, 1 )
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (RoleName) {
		where['RoleName'] = { $like: '%' + RoleName + '%' }
	}
	Sys_role.findAndCountAll({
		where: where,
		offset: offset,
		limit: pageSize,
		order: [
			['CreateTime', 'DESC']
		]
	}).then(sys_roles => {
		responseData.data = sys_roles
		responseData.data.pageIndex = pageIndex
		responseData.data.pageSize = pageSize
		res.json(responseData)
	})
})

/* 获取角色详情 */
router.get('/info', (req, res) => {
	let Role_ID = req.query.Role_ID
	Sys_role.findById(Role_ID, {
		include: [
			{
				model: Com_staff
			},
			{
				model: Sys_menu
			}
		]
	}).then(sys_role => {
		responseData.data = sys_role
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 添加角色 */
router.post('/add', (req, res) => {
	let User_ID = req.user.userID
	let Role_ID = snowflake.nextId()
	let RoleName = req.body.RoleName
	let RoleEnName = req.body.RoleEnName
	let RoleType = req.body.RoleType
	let RoleCode = req.body.RoleCode
	let CreateBy = User_ID
	let UpdateBy = User_ID
	let Remark = req.body.Remark || ''
	findCompanyIDByUser(req.user.userID).then(Company_ID => {
		Sys_role.create({
			Role_ID,
			Company_ID,
			RoleName,
			RoleEnName,
			RoleType,
			RoleCode,
			CreateBy,
			UpdateBy,
			Remark
		}).then(sys_role => {
			res.json(responseData)
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

/* 修改角色 */
router.post('/update', (req, res) => {
	let User_ID = req.user.userID
	let Role_ID = req.body.Role_ID
	let RoleName = req.body.RoleName
	let RoleEnName = req.body.RoleEnName
	let RoleType = req.body.RoleType
	let RoleCode = req.body.RoleCode
	let UpdateBy = User_ID
	let Remark = req.body.Remark || ''
	Sys_role.update({
		RoleName,
		RoleEnName,
		RoleType,
		RoleCode,
		UpdateBy,
		Remark,
		UpdateDate: new Date()
	}, {
		where: {
			Role_ID
		}
	}).then(() => {
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 修改角色权限菜单 */
router.post('/update/menu', (req, res) => {
	let Role_ID = req.body.Role_ID
	let sys_menus = req.body.sys_menus || []
	Sys_role_menu.destroy({
		where: {
			role_id: Role_ID
		}
	}).then(() => {
		let roleMenus = []
		for (let i = 0; i < sys_menus.length; i++) {
			roleMenus.push({
				Menu_ID: sys_menus[i],
				Role_ID: Role_ID
			})
		}
		Sys_role_menu.bulkCreate(roleMenus).then(() => {
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 修改角色分配用户 */
router.post('/update/user', (req, res) => {
	let Role_ID = req.body.Role_ID
	let sys_users = req.body.sys_users || ''
	Sys_staff_role.destroy({
		where: {
			role_id: Role_ID
		}
	}).then(() => {
		let staffRoles = []
		for (let i = 0; i < sys_users.length; i++) {
			staffRoles.push({
				Staff_ID: sys_users[i],
				Role_ID: Role_ID
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
})

/* 删除角色 */
router.post('/delete', (req, res) => {
	let ids = req.body.ids
	Sys_role.destroy({
		where: {
			Role_ID: {
				$in: ids
			}
		}
	}).then(() => {
		Sys_staff_role.destroy({
			where: {
				role_id: {
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