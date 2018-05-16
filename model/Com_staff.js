const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Sys_role = require('../model/Sys_role')
const Sys_staff_role = require('../model/Sys_staff_role')
const Com_companyinfo = require('../model/Com_companyinfo')

/* 员工 */
const Com_staff = sequelize.define('com_staff', {
	// 编号
	Staff_ID: {
		type: Sequelize.BIGINT(20),
		primaryKey: true,
		allowNull: false
	},
	// 归属公司
	Company_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 归属会员
	Member_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 头像
	HeadPic: {
		type: Sequelize.STRING(512)
	},
	// 真实姓名
	RealName: {
		type: Sequelize.STRING(50)
	},
	// 手机
	Mobile: {
		type: Sequelize.STRING(11)
	},
	// 员工号
	StaffCode: {
		type: Sequelize.STRING(50)
	},
	// 入职时间
	EntryDate: {
		type: Sequelize.DATE
	},
	// 职位类型
	PositionType: {
		type: Sequelize.STRING(50)
	},
	// 职位名称
	Position: {
		type: Sequelize.STRING(100)
	},
	// 工作状态
	WorkStatus: {
		type: Sequelize.STRING(50),
		defaultValue: 'Free'
	},
	// 资料状态
	Status: {
		type: Sequelize.STRING(50)
	},
	// 员工审核人
	AuditName: {
		type: Sequelize.STRING(50)
	},
	// 员工创建人
	CreateName: {
		type: Sequelize.STRING(50)
	},
	// 审核日期
	AuditTime: {
		type: Sequelize.DATE
	},
	// 审核人
	AuditBy: {
		type: Sequelize.BIGINT(20)
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
	// 更新时间
	UpdateTime: {
		type: Sequelize.DATE,
		defaultValue: new Date()
	},
	// 删除时间
	DeleteTime: {
		type: Sequelize.DATE
	},
	// 删除人
	DeleteBy: {
		type: Sequelize.BIGINT(20)
	},
	// 删除标记
	DeleteFlag: {
		type: Sequelize.CHAR(1),
		defaultValue: 'N'
	},
	// 是否离职
	InLeave: {
		type: Sequelize.CHAR(1),
		defaultValue: 'N'
	},
	// 备注
	Remark: {
		type: Sequelize.STRING(320)
	}
})

Com_staff.belongsToMany(Sys_role, {through: Sys_staff_role, foreignKey: 'Staff_ID'})
Sys_role.belongsToMany(Com_staff, {through: Sys_staff_role, foreignKey: 'Role_ID'})
Com_staff.belongsTo(Com_companyinfo, {as: 'company', foreignKey: 'Company_ID'})

module.exports = Com_staff

