const BaseServise = require('./BaseServise')
const Sys_menu = require('../model/Sys_menu')
const Sys_role = require('../model/Sys_role')
const Sys_role_menu = require('../model/Sys_role_menu')
const Com_staff = require('../model/Com_staff')
const { menusTree } = require('../utils/sortTree')
const snowflake = require('../utils/snowflake')

class SysMenuService extends BaseServise {
    /**
     * 获取菜单列表
     */
    getList() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            try {
                const staff = await Com_staff.findOne({
                    where: { Member_ID: User_ID },
                    include: [ { model: Sys_role, include: [ { model: Sys_menu } ] } ]
                })
                if (!staff) {
                    const sys_menus = await Sys_menu.findAll()
                    const menus = await menusTree(sys_menus)
                    ctx.body = this.responseSussess({ menus, permissions: menus.map(item => item.Target)})
                } else {
                    const arr = [], array = [], json = {}
                    for (let i = 0; i < staff.sys_roles.length; i++) {
                        for (let j = 0; j < staff.sys_roles[i].sys_menus.length; j++) {
                            arr.push(staff.sys_roles[i].sys_menus[j])
                        }
                    }
                    for(let i = 0; i < arr.length; i++){
                        if(!json[arr[i].Target]) {
                            array.push(arr[i])
                            json[arr[i].Target] = 1
                        }
                    }
                    const menus = await menusTree(array)
                    ctx.body = this.responseSussess({ menus, permissions: array.map(item => item.Target)})
                }
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 获取所有菜单列表
     */
    getAllList() {
        return async ctx => {
            try {
                const sys_menus = await Sys_menu.findAll()
                const menus = await menusTree(sys_menus)
                ctx.body = this.responseSussess(menus)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 获取菜单详情
     */
    getInfo() {
        return async ctx => {
            const { Menu_ID } = ctx.query
            try {
                const sys_menu = await Sys_menu.findById(Menu_ID, { include: [{ model: Sys_role }] })
                ctx.body = this.responseSussess(sys_menu)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 添加菜单
     */
    add() {
        return async ctx => {
            const Menu_ID = snowflake.nextId()
            const User_ID = ctx.state.user.userID
            const { Menu_PID = null, Name, Target, SortNumber, Href, Icon, IsShow, sys_roles = [], Remark = '' } = ctx.request.body
            const data = { Menu_ID, Menu_PID, Name, Target, SortNumber, Href, Icon, IsShow, sys_roles, Remark, CreateBy: User_ID, UpdateBy: User_ID}
            try {
                const roleMenus = []
                for (let i = 0; i < sys_roles.length; i++) {
                	roleMenus.push({ Menu_ID, Role_ID: sys_roles[i] })
                }
                await Sys_menu.create(data)
                await Sys_role_menu.bulkCreate(roleMenus)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 修改菜单
     */
    update() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const { Menu_ID, Menu_PID, Name, Target, SortNumber, Href, Icon, IsShow, sys_roles = [], Remark = '' } = ctx.request.body
            const data = { Menu_PID, Name, Target, SortNumber, Href, Icon, IsShow, sys_roles, Remark, UpdateBy: User_ID, UpdateDate: new Date()}
            try {
                const roleMenus = []
                for (let i = 0; i < sys_roles.length; i++) {
                	roleMenus.push({ Menu_ID, Role_ID: sys_roles[i] })
                }
                await Sys_menu.update(data, { where: { Menu_ID } })
                await Sys_role_menu.destroy({ where: { menu_id: Menu_ID } })
                await Sys_role_menu.bulkCreate(roleMenus)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 删除菜单
     */
    del() {
        return async ctx => {
            const { Menu_ID } = ctx.request.body
            try {
                await Sys_role_menu.destroy({ where: { menu_id: Menu_ID } })
                await Sys_menu.destroy({ where: { Menu_PID: Menu_ID } })
                await Sys_menu.destroy({ where: { Menu_ID } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = new SysMenuService()