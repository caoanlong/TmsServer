const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwtConfig')
const redisClient = require('../config/redisConfig')

// 统一返回格式
let responseData
router.use((req, res, next) => {
	responseData = {
		code: 0,
		msg: '成功'
	}
	next()
})

//设置跨域
router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,Authorization')
	res.header('Access-Control-Expose-Headers', 'Content-Type,Accept,X-Access-Token')
	next()
})

router.use((req, res, next) => {
	// 过滤登录路由
	if (req.url.includes('login')) {
		next()
		return
	}
	// 过滤预检请求
	if (req.method == 'OPTIONS') {
		next()
		return
	}
	let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['authorization']
	if (token) {
		try {
			let decoded = jwt.decode(token, jwtConfig)
			if (decoded) {
				let isExists = redisClient.exists('User:' + decoded.header.kid)
				if (isExists) {
					req.user = { userID: decoded.header.kid}
					next()
				} else {
					responseData.code = 1004
					responseData.msg = '非法的Token!'
					res.json(responseData)
					return
				}
			}else {
				responseData.code = 1003
				responseData.msg = '非法的Token!'
				res.json(responseData)
				return
			}
		} catch (err) {
			if (err) {
				responseData.code = 1002
				responseData.msg = '非法的Token!'
				res.json(responseData)
				return
			}
		}
	}else {
		console.log('nima')
		responseData.code = 1001
		responseData.msg = '未登录!'
		res.json(responseData)
		return
	}
})

router.use('/com_staff', require('./com_staff'))
router.use('/sys_menu', require('./sys_menu'))
router.use('/sys_role', require('./sys_role'))
router.use('/sys_organization', require('./sys_organization'))

module.exports = router
