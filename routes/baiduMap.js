const Router = require('koa-router')
const router = new Router({prefix: '/baiduMap'})

const axios = require('axios')
const fastXmlParser = require('fast-xml-parser')
const { getClientIp } = require('../utils/common')

router.get('/getLocation', async ctx => {
	const { queryString, region } = ctx.query
	// const ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/)[0]
	try {
		const response = await axios({
			url: `http://api.map.baidu.com/place/v2/suggestion?query=${encodeURIComponent(queryString)}&region=${encodeURIComponent('全国')}&ak=AjsVKu7N9iBX2klb9ktqGfAvA5dkfRBs`,
		})
		const result = fastXmlParser.parse(response.data)
		ctx.body = result.PlaceSuggestionResponse
	} catch (err) {
		ctx.body = { code: 100, msg: `错误：${err.toString()}` }
	}
})

module.exports = router