const express = require('express')
const router = express.Router()

const menusTree = require('../utils/sortTree').menusTree
const snowflake = require('../utils/snowflake')

const Sys_menu = require('../model/Sys_menu')
const Sys_role = require('../model/Sys_role')
const Sys_role_menu = require('../model/Sys_role_menu')
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


/* 获取菜单列表 */
router.get('/list', (req, res, dd) => {
	let User_ID = req.user.userID
	// let User_ID = 1
	Com_staff.findById(User_ID, {
		include: [
			{
				model: Sys_role,
				include: [
					{
						model: Sys_menu
					}
				]
			}
		]
	}).then(staff => {
		// 表改为sys_menu_2
		let arr = []
		for (let i = 0; i < staff.sys_roles.length; i++) {
			for (let j = 0; j < staff.sys_roles[i].sys_menu_2s.length; j++) {
				arr.push(staff.sys_roles[i].sys_menu_2s[j])
			}
		}
		let array = []
		let json = {}
		for(let i = 0; i < arr.length; i++){
			if(!json[arr[i].Target]){
				array.push(arr[i])
				json[arr[i].Target] = 1
			}
		}
		responseData.permissions = array.map(item => item.Target)
		menusTree(array).then(menus => {
			responseData.data = menus
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 获取所有菜单列表 */
router.get('/list/all', (req, res) => {
	Sys_menu.findAll().then(sys_menus => {
		menusTree(sys_menus).then(menus => {
			responseData.data = menus
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 获取菜单详情 */
router.get('/info', (req, res) => {
	let Menu_ID = req.query.Menu_ID
	Sys_menu.findById(Menu_ID, {
		include: [{
			model: Sys_role
		}]
	}).then(sys_menu => {
		responseData.data = sys_menu
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 添加菜单 */
router.post('/add', (req, res) => {
	let User_ID = req.user.userID
	let Menu_ID = snowflake.nextId()
	let Menu_PID = req.body.Menu_PID
	let Name = req.body.Name
	let Target = req.body.Target
	let SortNumber = req.body.SortNumber
	let Href = req.body.Href
	let Icon = req.body.Icon
	let IsShow = req.body.IsShow
	let sys_roles = req.body.sys_roles || []
	let Remark = req.body.Remark || '1'
	Sys_menu.create({
		Menu_ID,
		Menu_PID,
		Name,
		Target,
		SortNumber,
		Href,
		Icon,
		IsShow,
		CreateBy: User_ID,
		UpdateBy: User_ID,
		Remark
	}).then(sys_menu => {
		for (let i = 0; i < sys_roles.length; i++) {
			Sys_role_menu.create({
				menu_id: sys_menu.Menu_ID,
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

/* 修改菜单 */
router.post('/update', (req, res) => {
	let User_ID = req.user.userID
	let Menu_ID = req.body.Menu_ID
	let Menu_PID = req.body.Menu_PID
	let Name = req.body.Name
	let Target = req.body.Target
	let SortNumber = req.body.SortNumber
	let Href = req.body.Href
	let Icon = req.body.Icon
	let IsShow = req.body.IsShow
	let sys_roles = req.body.sys_roles || []
	let Remark = req.body.Remark || ''
	Sys_menu.update({
		Menu_PID, 
		Name, 
		Target, 
		SortNumber, 
		Href, 
		Icon,
		IsShow,
		UpdateBy: User_ID,
		Remark,
		UpdateDate: new Date()
	},{
		where: {
			Menu_ID
		}
	}).then(() => {
		Sys_role_menu.destroy({
			where: {
				menu_id: Menu_ID
			}
		}).then(() => {
			for (let i = 0; i < sys_roles.length; i++) {
				Sys_role_menu.create({
					menu_id: Menu_ID,
					role_id: sys_roles[i]
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

/* 删除菜单 */
router.post('/delete', (req, res) => {
	let Menu_ID = req.body.Menu_ID
	Sys_menu.destroy({
		where: {
			Menu_ID
		}
	}).then(() => {
		Sys_role_menu.destroy({
			where: {
				menu_id: Menu_ID
			}
		}).then(() => {
			res.json(responseData)
		})
	})
})

module.exports = router