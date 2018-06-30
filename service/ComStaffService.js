const BaseServise = require('./BaseServise')
const Sys_role = require('../model/Sys_role')
const Com_staff = require('../model/Com_staff')
const Sys_staff_role = require('../model/Sys_staff_role')
const Com_companyinfo = require('../model/Com_companyinfo')
const snowflake = require('../utils/snowflake')
const { findCompanyIDByUser } = require('../utils/common')

class ComStaffService extends BaseServise {
    getList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, RealName, Mobile } = ctx.query
            pageIndex = Math.max( Number(pageIndex), 1 )
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = { DeleteFlag: 'N' }
            if (RealName) where['RealName'] = { $like: '%' + RealName + '%' }
            if (Mobile) where['Mobile'] = { $like: '%' + Mobile + '%' }
            try {
                const staffs = await Com_staff.findAndCountAll({ where, offset, limit: pageSize, order: [ ['CreateTime', 'DESC'] ] })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: staffs.count, rows: staffs.rows })
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }

    getInfo() {
        return async ctx => {
            const { Staff_ID } = ctx.query
            try {
                const staff = await Com_staff.findById(Staff_ID, {
                    include: [ { model: Sys_role }, { model: Com_companyinfo, as: 'company' } ]
                })
                ctx.body = this.responseSussess(staff)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }

    add() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const Staff_ID = snowflake.nextId()
            const { Member_ID, HeadPic, RealName, Mobile, StaffCode, EntryDate, PositionType, Position, WorkStatus, Status, InLeave, Remark, sys_roles } = ctx.request.body
            const staffRoles = []
            try {
                for (let i = 0; i < sys_roles.length; i++) {
                    staffRoles.push({ Staff_ID, Role_ID: sys_roles[i] })
                }
                const Company_ID = await findCompanyIDByUser(User_ID)
                const data = { Staff_ID, Company_ID, Member_ID, HeadPic, RealName, Mobile, StaffCode, EntryDate, PositionType,
                    Position, WorkStatus, Status, InLeave, Remark, CreateBy: userID, UpdateBy: userID
                }
                await (() => {
                    Com_staff.create(data)
                    Sys_staff_role.bulkCreate(staffRoles)
                })()
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }

    update() {
        return async ctx => {
            const User_ID = ctx.state.user.userID
            const { Staff_ID, Member_ID, HeadPic, RealName, Mobile, StaffCode, EntryDate, PositionType, Position, WorkStatus, Status, InLeave, Remark, sys_roles } = ctx.request.body
            const data = { Member_ID, HeadPic, RealName, Mobile, StaffCode, EntryDate, PositionType,
                Position, WorkStatus, Status, InLeave, Remark, UpdateBy: User_ID, UpdateDate: new Date()
            }
            const staffRoles = []
            try {
                for (let i = 0; i < sys_roles.length; i++) {
                    staffRoles.push({ Staff_ID, Role_ID: sys_roles[i] })
                }
                await Com_staff.update(data, { where: { Staff_ID } })
                await Sys_staff_role.destroy({ where: { staff_id: Staff_ID } })
                await Sys_staff_role.bulkCreate(staffRoles)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }

    del() {
        return async ctx => {
            const { ids } = ctx.request.body
            try {
                await Com_staff.update({ DeleteFlag: 'Y' }, { where: { Staff_ID: { $in: ids } } })
                await Sys_staff_role.destroy({ where: { staff_id: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = new ComStaffService()