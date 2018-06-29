const snowflake = require('../utils/snowflake')
const Sys_organization = require('../model/Sys_organization')
const { findCompanyIDByUser } = require('../utils/common')

class SysOrganizationService {
    getList() {
        return async ctx => {
            const { Organization_PID } = ctx.query
            try {
                const sys_organizations = await Sys_organization.findAll({ where: { Organization_PID: Organization_PID ? Organization_PID : null } })
                ctx.body = { code: 0, msg: '成功', data: sys_organizations }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    getAllList() {
        return async ctx => {
            try {
                const sys_organizations = await Sys_organization.findAll()
                ctx.body = { code: 0, msg: '成功', data: sys_organizations }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    getInfo() {
        return async ctx => {
            const { Organization_ID } = ctx.query
            try {
                const sys_organization = await Sys_organization.findById(Organization_ID)
                ctx.body = { code: 0, msg: '成功', data: sys_organization }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    add() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const Organization_ID = snowflake.nextId()
            const { Organization_PID, Area_ID, Name, Grade, Sort, Address, ZipCode, Respo_ID, Respo, Phone, Fax, Email, EnableFlag, Remark } = ctx.request.body
            let Path = ''
            try {
                const Company_ID = await findCompanyIDByUser(User_ID)
                const sys_organization = await Sys_organization.findById(Organization_PID)
                sys_organization ? (sys_organization.Path + Organization_PID + ',') : Path = '0'
                await Sys_organization.create({ Organization_ID, Organization_PID: Organization_PID ? Organization_PID : null, 
                    Company_ID, Area_ID, Name, Grade, Sort, Address, ZipCode, Respo_ID, Respo, Phone, Fax, Email, 
                    EnableFlag, Remark, CreateBy: User_ID, UpdateBy: User_ID, Path
                })
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    update() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const { Organization_ID, Area_ID, Name, Grade, Sort, Address, ZipCode, Respo_ID, Respo, Phone, Fax, Email, EnableFlag, Remark } = ctx.request.body
            try {
                await Sys_organization.update({ Area_ID, Name, Grade, Sort, Address, ZipCode, Respo_ID, Respo, Phone, Fax, 
                    Email, EnableFlag, Remark, UpdateBy: User_ID, UpdateTime: new Date()
                }, { where: { Organization_ID } })
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    del() {
        return async ctx => {
            const { Organization_ID } = ctx.request.body
            try {
                await Sys_organization.destroy({ where: { Organization_ID } })
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }
}

module.exports = new SysOrganizationService()