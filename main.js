/**
 * 入口文件
 */

//引入 vue 组件
import Vue from 'vue';
//引入 app 入口组件
import App from './app.vue';
// 导入 vue-router 路由组件
// import VueRouter from "vue-router";
//引入 sytle.css
import './style.css';



new Vue({
    el: '#app',
    //使用路由
    // router: router,
    render: h => {
        return h(App)
    }
})