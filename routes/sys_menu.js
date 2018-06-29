const Router = require('koa-router')
const router = new Router({prefix: '/sys_menu'})
const SysMenuService = require('../service/SysMenuService')

/* 获取菜单列表 */
router.get('/list', SysMenuService.getList())

/* 获取所有菜单列表 */
router.get('/list/all', SysMenuService.getAllList())

/* 获取菜单详情 */
router.get('/info', SysMenuService.getInfo())

/* 添加菜单 */
router.post('/add', SysMenuService.add())

/* 修改菜单 */
router.post('/update', SysMenuService.update())

/* 删除菜单 */
router.post('/delete', SysMenuService.del())

module.exports = router