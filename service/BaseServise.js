class BaseServise {
    responseSussess(data) {
        return data ? { code: 0, msg: '成功', data } : { code: 0, msg: '成功' }
    }
    responseError(err) {
        return { code: 100, msg: `错误：${err.toString()}` }
    }
}

module.exports = BaseServise