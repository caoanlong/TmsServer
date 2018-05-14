const express = require('express')
const router = express.Router()
const snowflake = require('../utils/snowflake')

const Sys_role = require('../model/Sys_role')
const Sys_menu = require('../model/Sys_menu')
const Com_staff = require('../model/Com_staff')
const Sys_staff_role = require('../model/Sys_staff_role')
const Sys_role_menu = require('../model/Sys_role_menu')

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
	let Name = req.query.Name
	pageIndex = Math.max( pageIndex, 1 )
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (Name) {
		where['Name'] = { $like: '%' + Name + '%' }
	}
	Sys_role.findAndCountAll({
		where: where,
		offset: offset,
		limit: pageSize,
		order: [
			['CreateDate', 'DESC']
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
			},
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
	let Organization_ID = req.body.Organization_ID || ''
	let Name = req.body.Name
	let EnName = req.body.EnName
	let RoleType = req.body.RoleType
	let DataScope = req.body.DataScope
	let Issys = req.body.Issys
	let Useable = req.body.Useable
	let CreateBy = User_ID
	let UpdateBy = User_ID
	let Remark = req.body.Remark || ''
	let DelFlag = req.body.DelFlag || ''
	let sys_users = req.body.sys_users || []
	Sys_role.create({
		Role_ID,
		Organization_ID,
		Name,
		EnName,
		RoleType,
		DataScope,
		Issys,
		Useable,
		CreateBy,
		UpdateBy,
		Remark,
		DelFlag
	}).then(sys_role => {
		for (let i = 0; i < sys_users.length; i++) {
			Sys_staff_role.create({
				user_id: sys_users[i],
				role_id: sys_role.Role_ID
			})
		}
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 修改角色 */
router.post('/update', (req, res) => {
	let User_ID = req.user.userID
	let Role_ID = req.body.Role_ID
	let Organization_ID = req.body.Organization_ID || ''
	let Name = req.body.Name
	let EnName = req.body.EnName
	let RoleType = req.body.RoleType
	let DataScope = req.body.DataScope
	let Issys = req.body.Issys
	let Useable = req.body.Useable
	let UpdateBy = User_ID
	let Remark = req.body.Remark || ''
	let DelFlag = req.body.DelFlag || ''
	Sys_role.update({
		Organization_ID,
		Name,
		EnName,
		RoleType,
		DataScope,
		Issys,
		Useable,
		UpdateBy,
		Remark,
		DelFlag,
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
	let sys_menus = req.body.sys_menus || ''
	Sys_role_menu.destroy({
		where: {
			role_id: Role_ID
		}
	}).then(() => {
		for (let i = 0; i < sys_menus.length; i++) {
			Sys_role_menu.create({
				menu_id: sys_menus[i],
				role_id: Role_ID
			})
		}
		res.json(responseData)
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
	console.log(Role_ID, sys_users)
	Sys_staff_role.destroy({
		where: {
			role_id: Role_ID
		}
	}).then(() => {
		for (let i = 0; i < sys_users.length; i++) {
			Sys_staff_role.create({
				user_id: sys_users[i],
				role_id: Role_ID
			})
		}
		res.json(responseData)
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