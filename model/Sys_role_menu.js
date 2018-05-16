const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 权限角色与菜单关联 */
const Sys_role_menu = sequelize.define('sys_rolemenu', {
	// // 角色编号
	Role_ID: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 菜单编号
	Menu_ID: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	}
})

module.exports = Sys_role_menu

