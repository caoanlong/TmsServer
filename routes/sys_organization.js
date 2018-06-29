const Router = require('koa-router')
const router = new Router({prefix: '/sys_organization'})
const SysOrganizationService = require('../service/SysOrganizationService')

/* 获取机构列表 */
router.get('/list', SysOrganizationService.getList())

/* 获取所有机构列表 */
router.get('/list/all', SysOrganizationService.getAllList())

/* 获取机构详情 */
router.get('/info', SysOrganizationService.getInfo())

/* 添加机构 */
router.post('/add', SysOrganizationService.add())

/* 修改机构 */
router.post('/update', SysOrganizationService.update())

/* 删除机构 */
router.post('/delete', SysOrganizationService.del())

module.exports = router