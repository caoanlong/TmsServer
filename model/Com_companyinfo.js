const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 公司 */
const Com_companyinfo = sequelize.define('com_companyinfo', {
	// 公司ID
	Company_ID: {
		type: Sequelize.BIGINT(20),
		primaryKey: true,
		allowNull: false
	},
	// 组织ID
	Organization_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 公司负责人ID
	Respo_ID: {
		type: Sequelize.BIGINT(20)
	},
	// 公司名称
	Name: {
		type: Sequelize.STRING(100)
	},
	// 地区ID
	AreaID: {
		type: Sequelize.BIGINT(20)
	},
	// 公司地区
	AreaName: {
		type: Sequelize.STRING(100)
	},
	// 公司地址
	Address: {
		type: Sequelize.STRING(320)
	},
	// 公司电话
	Phone: {
		type: Sequelize.STRING(20)
	},
	// 公司传真
	Fax: {
		type: Sequelize.STRING(50)
	},
	// 公司邮箱
	Email: {
		type: Sequelize.STRING(100)
	},
	// 邮政编码
	ZipCode: {
		type: Sequelize.STRING(50)
	},
	// 营业执照
	BusinessLicNo: {
		type: Sequelize.STRING(50)
	},
	// 营业执照生效
	BusinessLicStart: {
		type: Sequelize.DATE
	},
	// 营业执照截止
	BusinessLicEnd: {
		type: Sequelize.DATE
	},
	// 认证状态
	Status: {
		type: Sequelize.STRING(10)
	},
	// 营业执照图片
	BusinessLicUrl: {
		type: Sequelize.STRING(512)
	},
	// 道路运输许可证
	RoadTransportLicUrl: {
		type: Sequelize.STRING(512)
	},
	// 公司法人
	LawPerson: {
		type: Sequelize.STRING(100)
	},
	// 法人证件类型
	LawPersonCertifyType: {
		type: Sequelize.STRING(2)
	},
	// 法人证件号码
	LawPersonCertifyNo: {
		type: Sequelize.STRING(50)
	},
	// 法人证件有效期
	CertifyStart: {
		type: Sequelize.DATE
	},
	// 法人证件截止有效
	CertifyEnd: {
		type: Sequelize.DATE
	},
	// 法人证件正面
	LawIDCardFrontUrl: {
		type: Sequelize.STRING(512)
	},
	// 法人证件反面
	LawIDCardBackUrl: {
		type: Sequelize.STRING(512)
	},
	// 公司Logo
	LogoUrl: {
		type: Sequelize.STRING(512)
	},
	// 公司成立时间
	EstablishingDate: {
		type: Sequelize.DATE
	},
	// 添加时间
	CreateTime: {
		type: Sequelize.DATE
	},
	// 创建人
	CreateBy: {
		type: Sequelize.BIGINT(20)
	},
	// 更新时间
	UpdateTime: {
		type: Sequelize.DATE
	},
	// 修改人
	CreateBy: {
		type: Sequelize.BIGINT(20)
	}
})

module.exports = Com_companyinfo

