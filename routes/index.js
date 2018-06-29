const Router = require('koa-router')
const router = new Router({prefix: '/api'})
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwtConfig')
const redisClient = require('../config/redisConfig')

router.use(async (ctx, next) => {
	// 过滤登录路由
	if (ctx.url.includes('login')) {
		await next()
		return
	}
	const token = ctx.headers['authorization']
	if (token) {
		try {
			const decoded = await jwt.decode(token, jwtConfig)
			if (decoded) {
				const isExists = await redisClient.exists('User:' + decoded.header.kid)
				if (isExists) {
					ctx.state.user = { userID: decoded.header.kid}
					await next()
				} else {
					ctx.body = { code: 1004, msg: '非法的Token!' }
				}
			} else {
				ctx.body = { code: 1003, msg: '非法的Token!' }
			}
		} catch (err) {
			ctx.body = { code: 1002, msg: err.toString() }
		}
	} else {
		ctx.body = { code: 1001, msg: 'token不存在' }
	}
})

router.use(require('./baiduMap').routes())
router.use(require('./com_staff').routes())
router.use(require('./sys_menu').routes())
router.use(require('./sys_role').routes())
router.use(require('./sys_organization').routes())

module.exports = router
