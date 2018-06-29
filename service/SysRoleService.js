const Sys_menu = require('../model/Sys_menu')
const Sys_role = require('../model/Sys_role')
const Sys_role_menu = require('../model/Sys_role_menu')
const Sys_staff_role = require('../model/Sys_staff_role')
const Com_staff = require('../model/Com_staff')
const snowflake = require('../utils/snowflake')
const { findCompanyIDByUser } = require('../utils/common')

class SysRoleService {
    getList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, RoleName } = ctx.query
            pageIndex = Math.max( Number(pageIndex), 1 )
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = {}
            if (RoleName) where['RoleName'] = { $like: '%' + RoleName + '%' }
            try {
                const sys_roles = await Sys_role.findAndCountAll({ where, offset, limit: pageSize, order: [ ['CreateTime', 'DESC'] ] })
                ctx.body = { code: 0, msg: '成功', data: { pageIndex, pageSize, count: sys_roles.count, rows: sys_roles.rows } }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    getInfo() {
        return async ctx => {
            const { Role_ID } = ctx.query
            try {
                const sys_role = await Sys_role.findById(Role_ID, {
                    include: [ { model: Com_staff }, { model: Sys_menu } ]
                })
                ctx.body = { code: 0, msg: '成功', data: sys_role }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    add() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const Role_ID = snowflake.nextId()
            const { RoleName, RoleEnName, RoleType, RoleCode, Remark = '' } = ctx.request.body
            try {
                const Company_ID = await findCompanyIDByUser(User_ID)
                await Sys_role.create({ Role_ID, Company_ID, RoleName, RoleEnName, RoleType, RoleCode, Remark, CreateBy: User_ID, UpdateBy: User_ID })
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    update() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const { Role_ID, RoleName, RoleEnName, RoleType, RoleCode, Remark = '' } = ctx.request.body
            const data = { RoleName, RoleEnName, RoleType, RoleCode, Remark, UpdateBy: User_ID, UpdateDate: new Date() }
            try {
                await Sys_role.update(data, { where: { Role_ID }})
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    del() {
        return async ctx => {
            const { ids } = ctx.request.body
            try {
                await Sys_role.destroy({ where: { Role_ID: { $in: ids } } })
                await Sys_staff_role.destroy({ where: { role_id: { $in: ids } } })
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    updateMenu() {
        return async ctx => {
            const { Role_ID, sys_menus = [] } = ctx.request.body
	        const roleMenus = []
            try {
                for (let i = 0; i < sys_menus.length; i++) {
                    roleMenus.push({ Menu_ID: sys_menus[i], Role_ID: Role_ID })
                }
                await Sys_role_menu.destroy({ where: { role_id: Role_ID } })
                await Sys_role_menu.bulkCreate(roleMenus)
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }

    updateUser() {
        return async ctx => {
            const { Role_ID, sys_users = [] } = ctx.request.body
	        const staffRoles = []
            try {
                for (let i = 0; i < sys_users.length; i++) {
                    staffRoles.push({ Staff_ID: sys_users[i], Role_ID: Role_ID })
                }
                await Sys_staff_role.destroy({ where: { role_id: Role_ID } })
                await Sys_staff_role.bulkCreate(staffRoles)
                ctx.body = { code: 0, msg: '成功' }
            } catch (err) {
                ctx.body = { code: 100, msg: `错误：${err.toString()}` }
            }
        }
    }
}

module.exports = new SysRoleService()