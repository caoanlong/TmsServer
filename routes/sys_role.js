const Router = require('koa-router')
const router = new Router({prefix: '/sys_role'})
const SysRoleService = require('../service/SysRoleService')

/* 获取角色列表 */
router.get('/list', SysRoleService.getList())

/* 获取角色详情 */
router.get('/info', SysRoleService.getInfo())

/* 添加角色 */
router.post('/add', SysRoleService.add())

/* 修改角色 */
router.post('/update', SysRoleService.update())

/* 修改角色权限菜单 */
router.post('/update/menu', SysRoleService.updateMenu())

/* 修改角色分配用户 */
router.post('/update/user', SysRoleService.updateUser())

/* 删除角色 */
router.post('/delete', SysRoleService.del())

module.exports = router