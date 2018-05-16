const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 系统权限角色 */
const Sys_role = sequelize.define('sys_role', {
	// 编号
	Role_ID: {
		type: Sequelize.BIGINT(20),
		primaryKey: true,
		allowNull: false
	},
	// 归属公司
	Company_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 角色名称
	RoleName: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	// 英文名称
	RoleEnName: {
		type: Sequelize.STRING(100)
	},
	// 权限类型
	RoleType: {
		type: Sequelize.STRING(50)
	},
	// 角色代码
	RoleCode: {
		type: Sequelize.STRING(50)
	},
	// 创建者
	CreateBy: {
		type: Sequelize.BIGINT(20)
	},
	// 创建时间
	CreateTime: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 更新者
	UpdateBy: {
		type: Sequelize.BIGINT(20)
	},
	// 更新时间
	UpdateTime: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 备注信息
	Remark: {
		type: Sequelize.STRING(320)
	},
	// 删除标记
	DelFlag: {
		type: Sequelize.CHAR(1),
		defaultValue: 'N'
	}
})

module.exports = Sys_role

