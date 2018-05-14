const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

const Base_area = require('./Base_area')

/* 组织机构 */
const Sys_organization = sequelize.define('sys_organization', {
	// 组织机构ID
	Organization_ID: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	// 区域ID
	Area_ID: {
		type: Sequelize.BIGINT(32)
	},
	// 父级编号s
	ParentIds: {
		type: Sequelize.STRING(2000)
	},
	// 父级编号
	Organization_PID: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 机构编码
	Code: {
		type: Sequelize.STRING(64)
	},
	// 机构类型
	Type: {
		type: Sequelize.STRING(50),
		allowNull: false
	},
	// 名称
	Name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	// 机构等级
	Grade: {
		type: Sequelize.CHAR(1),
		allowNull: false
	},
	// 排序
	SortNumber: {
		type: Sequelize.BIGINT(11),
		allowNull: false
	},
	// 联系地址
	Address: {
		type: Sequelize.STRING(255)
	},
	// 邮政编码
	ZipCode: {
		type: Sequelize.STRING(100)
	},
	// 负责人
	Master: {
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
	// 是否可用
	Useable: {
		type: Sequelize.CHAR(1)
	},
	// 主负责人
	PrimaryPerson: {
		type: Sequelize.STRING(64)
	},
	// 副负责人
	DeputyPerson: {
		type: Sequelize.STRING(64)
	},
	// 创建者
	CreateBy: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 创建时间
	CreateDate: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 更新者
	UpdateBy: {
		type: Sequelize.BIGINT(32),
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
	},
	// 删除标记
	DelFlag: {
		type: Sequelize.CHAR(1),
		allowNull: false
	}
})

Sys_organization.belongsTo(Base_area, {foreignKey: 'Area_ID'})

module.exports = Sys_organization

