const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 权限角色与员工关联 */
const Sys_staff_role = sequelize.define('sys_rolestaff', {
	// 用户编号
	staff_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 角色编号
	role_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	}
})

module.exports = Sys_staff_role

