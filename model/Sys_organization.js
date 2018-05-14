const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 组织机构 */
const Sys_organization = sequelize.define('sys_organization', {
	// 组织ID
	Organization_ID: {
		type: Sequelize.BIGINT(20),
		primaryKey: true,
		allowNull: false
	},
	// 组织父ID
	Organization_PID: {
		type: Sequelize.BIGINT(20)
	},
	// 公司ID
	Company_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 名称
	Name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	// 所有父级编号
	Path: {
		type: Sequelize.STRING(2000),
		allowNull: false
	},
	// 排序
	Sort: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	// 机构等级
	Grade: {
		type: Sequelize.CHAR(1),
		allowNull: false
	},
	// 地区ID
	Area_ID: {
		type: Sequelize.STRING(32)
	},
	// 联系地址
	Address: {
		type: Sequelize.STRING(255)
	},
	// 邮政编码
	ZipCode: {
		type: Sequelize.STRING(100)
	},
	// 负责人ID
	Respo_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 负责人
	Respo: {
		type: Sequelize.STRING(100)
	},
	// 电话
	Phone: {
		type: Sequelize.STRING(200)
	},
	// 传真
	Fax: {
		type: Sequelize.STRING(200)
	},
	// 邮箱
	Email: {
		type: Sequelize.STRING(200)
	},
	// 是否启用
	EnableFlag: {
		type: Sequelize.CHAR(1),
		defaultValue: 'N'
	},
	// 备注
	Remark: {
		type: Sequelize.TEXT
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
	// 删除标记
	DeleteFlag: {
		type: Sequelize.CHAR(1),
		defaultValue: 'N'
	},
	// 删除人
	DeleteBy: {
		type: Sequelize.BIGINT(20)
	},
	// 删除时间
	DeleteTime: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	}
})

module.exports = Sys_organization

