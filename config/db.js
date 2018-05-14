const config = new Map()

// mysql
config.set('mysql', {
	host: '192.168.0.28',
	port: 33060,
	user: 'hdd',
	password: 'R84:5V736aKPJ9a3z>8VxJ8G',
	database: 'tms_v1_0'
})

// test-mysql 测试
config.set('test-mysql', {
	host: '192.168.1.48',
	port: 3306,
	user: 'root',
	password: 'We@123456',
	database: 'tms_v1_0_test'
})

module.exports = config