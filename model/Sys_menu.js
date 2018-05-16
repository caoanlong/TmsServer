const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Sys_role = require('../model/Sys_role')
const Sys_role_menu = require('../model/Sys_role_menu')

/* 系统菜单 */
const Sys_menu = sequelize.define('sys_menu', {
	// 编号
	Menu_ID: {
		type: Sequelize.BIGINT(20),
		primaryKey: true,
		allowNull: false
	},
	// 父级编号
	Menu_PID: {
		type: Sequelize.BIGINT(20),
		defaultValue: ''
	},
	// 所有父级编号
	ParentIds: {
		type: Sequelize.STRING(2000),
		defaultValue: ''
	},
	// 英文名称
	Name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	// 名称
	Target: {
		type: Sequelize.STRING(20),
		allowNull: false
	},
	// 排序
	SortNumber: {
		type: Sequelize.BIGINT(11),
		allowNull: false
	},
	// 链接路径
	Href: {
		type: Sequelize.STRING(2000)
	},
	// 图标
	Icon: {
		type: Sequelize.STRING(100)
	},
	// 是否在菜单中显示
	IsShow: {
		type: Sequelize.CHAR(1),
		allowNull: false
	},
	Permission: {
		type: Sequelize.STRING(200)
	},
	// 创建者
	CreateBy: {
		type: Sequelize.BIGINT(20),
		allowNull: false
	},
	// 创建时间
	CreateDate: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 更新者
	UpdateBy: {
		type: Sequelize.BIGINT(20),
		allowNull: false
	},
	// 更新时间
	UpdateDate: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 备注信息
	Remark: {
		type: Sequelize.STRING(255)
	}
})

Sys_menu.belongsToMany(Sys_role, {through: Sys_role_menu, foreignKey: 'Menu_ID'})
Sys_role.belongsToMany(Sys_menu, {through: Sys_role_menu, foreignKey: 'Role_ID'})
Sys_menu.hasMany(Sys_menu, {as: 'children', foreignKey: 'Menu_PID'})

// Sys_menu.sync()
// Sys_role.sync()

module.exports = Sys_menu

