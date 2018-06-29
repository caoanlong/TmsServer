const Router = require('koa-router')
const router = new Router({prefix: '/com_staff'})
const ComStaffService = require('../service/ComStaffService')

/* 获取员工列表 */
router.get('/list', ComStaffService.getList())

/* 获取员工详情 */
router.get('/info', ComStaffService.getInfo())

/* 添加员工 */
router.post('/add', ComStaffService.add())

/* 修改员工 */
router.post('/update', ComStaffService.update())

/* 删除员工 */
router.post('/delete', ComStaffService.del())

module.exports = router