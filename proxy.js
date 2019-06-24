/**
 *  访问接口API存在跨域限制，使用代理解决
 *      文章接口地址：http://news-at.zhihu.com/api/4
 *      图片前缀地址：https://pic1.zhihu.com
 * 
 *  添加如下两个代理并监听对应的端口后：
 *      访问 http://127.0.0.1:8010 其真实地址为 http://news-at.zhihu.com/api/4
 *      访问 http://127.0.0.1:8011 其真实地址为 https://pic4.zhihu.com/
 * 
 *  在终端使用 node 启动代理服务
 *      node proxy.js
 */

const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8010;
const imgPort = 8011;

/**
 * 创建 api 代理服务
 */
const apiServer = http.createServer((req, res) => {
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    const options = {
        url: url
    };

    function callback(err, response, body) {
        if (!err && response.statusCode === 200) {
            //设置编码类型，防止中文乱码
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            //设置跨域允许范围
            res.setHeader('Access-Control-Allow-Origin', '*');
            //返回代理后的内容
            res.end(body);
        }
    }

    request.get(options, callback);
});

/**
 * 监听 8010 端口
 */
apiServer.listen(port, hostname, () => {
    console.log(`接口代理运行在 http://${hostname}:${port}/`);
});

/**
 * 创建图片代理服务
 */
const imgServer = http.createServer((req, res) => {
    const url = req.url.split('/img/')[1];
    const options = {
        url: url,
        encoding: null
    };

    function callback(err, response, body) {
        if (!err && response.statusCode === 200) {
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }

    request.get(options, callback)
});

/**
 * 监听 8011 端口
 */
imgServer.listen(imgPort, hostname, () => {
    console.log(`图片代理运行在 http://${hostname}:${imgPort}/`);
});

// http://news-at.zhihu.com/api/4/news/3892357
// http://127.0.0.1:8010/news/3892357
// https://pic4.zhimg.com/v2-b44636ccd2affac97ccc0759a0f46f7f.jpg
// http://127.0.0.1:8011/img/https://pic4.zhimg.com/v2-b44636ccd2affac97ccc0759a0f46f7f.jpg