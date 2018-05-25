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
router.get('/list', (req, res) => {
	let User_ID = req.user.userID
	Com_staff.findOne({
		where: {
			Member_ID: User_ID
		},
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
		if (!staff) {
			Sys_menu.findAll().then(sys_menus => {
				menusTree(sys_menus).then(menus => {
					responseData.data = menus
					responseData.permissions = menus.map(item => item.Target)
					res.json(responseData)
				})
			}).catch(err => {
				responseData.code = 100
				responseData.msg = '错误：' + err
				res.json(responseData)
			})
			return
		}
		let arr = []
		for (let i = 0; i < staff.sys_roles.length; i++) {
			for (let j = 0; j < staff.sys_roles[i].sys_menus.length; j++) {
				arr.push(staff.sys_roles[i].sys_menus[j])
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
	let Menu_PID = req.body.Menu_PID || null
	let Name = req.body.Name
	let Target = req.body.Target
	let SortNumber = req.body.SortNumber
	let Href = req.body.Href
	let Icon = req.body.Icon
	let IsShow = req.body.IsShow
	let sys_roles = req.body.sys_roles || []
	let Remark = req.body.Remark || ''
	let CreateBy = User_ID
	let UpdateBy = User_ID
	Sys_menu.create({
		Menu_ID,
		Menu_PID,
		Name,
		Target,
		SortNumber,
		Href,
		Icon,
		IsShow,
		CreateBy,
		UpdateBy,
		Remark
	}).then(sys_menu => {
		let roleMenus = []
		for (let i = 0; i < sys_roles.length; i++) {
			roleMenus.push({
				Menu_ID: sys_menu.Menu_ID,
				Role_ID: sys_roles[i]
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
	let UpdateBy = User_ID
	Sys_menu.update({
		Menu_PID, 
		Name, 
		Target, 
		SortNumber, 
		Href, 
		Icon,
		IsShow,
		UpdateBy,
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
			let roleMenus = []
			for (let i = 0; i < sys_roles.length; i++) {
				roleMenus.push({
					Menu_ID: Menu_ID,
					Role_ID: sys_roles[i]
				})
			}
			Sys_role_menu.bulkCreate(roleMenus).then(() => {
				res.json(responseData)
			})
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