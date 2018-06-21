const express = require('express')
const router = express.Router()
const axios = require('axios')
const fastXmlParser = require('fast-xml-parser')
const { getClientIp } = require('../utils/common')

router.get('/getLocation', (req, res) => {
	let { queryString, region } = req.query
	let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/)[0]
	// axios({
	// 	url: `http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`
	// }).then(resp => {
	// 	axios({
	// 		url: `http://api.map.baidu.com/place/v2/suggestion?query=${encodeURIComponent(queryString)}&region=${encodeURIComponent(region ? region : resp.data.city)}&ak=AjsVKu7N9iBX2klb9ktqGfAvA5dkfRBs`,
	// 	}).then(response => {
	// 		let result = fastXmlParser.parse(response.data)
	// 		res.send(result.PlaceSuggestionResponse)
	// 	}).catch(err => {
	// 		res.send(err.toString())
	// 	})
	// })
	axios({
		url: `http://api.map.baidu.com/place/v2/suggestion?query=${encodeURIComponent(queryString)}&region=${encodeURIComponent(region)}&ak=AjsVKu7N9iBX2klb9ktqGfAvA5dkfRBs`,
	}).then(response => {
		let result = fastXmlParser.parse(response.data)
		res.send(result.PlaceSuggestionResponse)
	}).catch(err => {
		res.send(err.toString())
	})
})



module.exports = router