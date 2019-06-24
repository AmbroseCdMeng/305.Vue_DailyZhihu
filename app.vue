<template>
  <div class="daily">
    <div class="daily-menu">
      <div
        class="daily-menu-item"
        @click="handleToRecommend"
        :class="{on:type === 'recommend'}"
      >每日推荐</div>
      <div
        class="daily-menu-item"
        :class="{on:type==='daily'}"
        @click="showThemes = !showThemes"
      >主题报表</div>

      <ul v-show="showThemes">
        <li v-for="item in themes" :key="item.key">
          <a
            :class="{on:item.id === themeId && type === 'daily'}"
            @click="handleToTheme(item.id)"
          >{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="daily-list" ref="list" @scroll="handleScroll">
      <template v-if="type === 'recommend'">
      <div v-for="list in recommendList" :key="list.key">
        <div class="daily-date">{{formatDay(list.date)}}</div>
        <!-- Item 是组件，绑定原生事件时要带修饰符 .native，否则会认为监听来自 Item 组件的方法。 -->
        <Item v-for="item in list.stories" :key="item.key" :data="item" @click.native="handleClick(item.id)"></Item>
      </div>
    </template>
      <template v-if="type === 'daily'">
      <Item v-for="item in list" :key="item.key" :data="item" @click.native="handleClick(item.id)"></Item>
    </template>
    </div>
    <daily-article :id="articleId"></daily-article>
  </div>
</template>

<script>
import $ from "./lib/util.js";
import Item from "./components/item.vue";
import dailyArticle from "./components/daily-article.vue";

export default {
  components: { Item, dailyArticle },

  data() {
    return {
      themes: [],
      showThemes: false,
      type: "recommend",
      list: [],
      themeId: 0,
      recommendList: [],
      dailyTime: $.getTodayTime(),
      isLoading: false,
      articleId: 0
    };
  },

  methods: {
    //获取主题
    getThemes() {
      //axios 发起 get 请求
      $.ajax.get("themes").then(res => {
        /**
         * {"limit":1000,"subscribed":[],"others":[]}
         * */
        this.themes = res.others;
      });
    },

    //改变主题
    handleToTheme(id) {
      //改变菜单分类
      this.type = "daily";
      //设置当前点击子类的主题日报 id
      this.themeId = id;
      //清空中间栏位的数据
      this.list = [];
      $.ajax.get("theme/" + id).then(res => {
        debugger;

        //过滤掉类型为 1 的文章，该类型下的文章为空
        this.list = res.stories.filter(item => item.type !== 1);
      });
    },

    //
    handleToRecommend() {
      this.type = "recommend";
      this.recommendList = [];
      this.dailyTime = $.getTodayTime();
      this.getRecommendList();
    },

    //
    getRecommendList() {
      this.isLoading = true;
      const prevDay = $.prevDay(this.dailyTime + 86400000);
      $.ajax.get("news/before/" + prevDay).then(res => {
        /**
         * {"date":"20190623","stories":[{"images":["https:\/\/pic1.zhimg.com\/v2-4ac616a5c1519c5ea75ffecafd34b67c.jpg"],"type":0,"id":9712609,"ga_prefix":"062322","title":"小事 · 做了大哥的「女人」"},{"images":["https:\/\/pic2.zhimg.com\/v2-13474a679602d5ed71931412a2cd1d29.jpg"],"type":0,"id":9712710,"ga_prefix":"062320","title":"纵欲过度，大脑不够用，怎么办？"},{"images":["https:\/\/pic3.zhimg.com\/v2-941dd3de66521ba583909461891aa1c6.jpg"],"type":0,"id":9712661,"ga_prefix":"062316","title":"如何评价 Facebook 发布的数字货币 Libra?"},{"title":"自动遛狗装置迷思","ga_prefix":"062309","images":["https:\/\/pic3.zhimg.com\/v2-765b9006210d5114e3fee37540fae47e.jpg"],"multipic":true,"type":0,"id":9712696},{"images":["https:\/\/pic1.zhimg.com\/v2-4bda84ec5b89e01bf4e969760ddb1434.jpg"],"type":0,"id":9712688,"ga_prefix":"062307","title":"中国电影票房 9 年来首次负增长，是什么原因导致的？"}]}
         * */
        this.recommendList.push(res);
        this.isLoading = false;
      });
    },

    //日期格式
    formatDay(date) {
      let month = date.substr(4, 2);
      let day = date.substr(6, 2);
      if (month.substr(0, 1) === "0") month = month.substr(1, 1);
      if (day.substr(0, 1) === "0") day = day.substr(1, 1);
      return `${month} 月 ${day} 日`;
    },

    //监听中栏滚动事件，动态加载列表
    handleScroll() {
      const $list = this.$refs.list;
      if (this.type === "daily" || this.isLoading) return;
      if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    },

    //
    handleClick(id) {
      this.articleId = id;
    }
  },

  mounted() {
    //初始化时调用
    this.getThemes();
    //获取每日推荐列表
    this.getRecommendList();

    /**
     * 获取DOM节点，监听中栏滚动事件，动态加载列表
     * 也可以写为 scroll 事件的监听
     */
    //获取DOM节点
    // const $list = this.$refs.list;
    // //监听中栏滚动事件
    // $list.addEventListener("scroll", () => {
    //   //在"主题日报"或正在加载推荐列表时停止操作
    //   if (this.type === "daily" || this.isLoading) return;
    //   //已经滚动的距离加页面的高度等于整个内容区域高度时，视为接触底部
    //   if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
    //     //时间相对减少一天
    //     this.dailyTime -= 86400000;
    //     this.getRecommendList();
    //   }
    // });
  }
};

/**
 *  主题日报类列表数组示例
 *  "others":[
 *      {
 *          "name": "密码学",
 *          "id": 13,
 *          "thumbnail": "http://pic3.zhimg.com/xxx.jpg",
 *          "color": 15007,
 *          "description": "了解彼此的欲望"
 *      }
 *  ]
 *
 *  文章列表数组示例
 *  "stories":[
 *      {
 *          "type": 0,
 *          "id": 701,
 *          "title": "虚拟生活"
 *      },
 *      {
 *          "type": 0,
 *          "id": 702,
 *          "title": "心理学",
 *          "images": [
 *              "http://pic1.zhimg.com/xxx/jpg"
 *          ]
 *      }
 *  ]
 *
 *  推荐列表结构示例
 *  {
 *      "date": "20170502",
 *      "stories": [{
 *          "id": 930,
 *          "title": "齿轮一样的工作...",
 *          "images": [
 *              "https://pic4.zhimg.com/xxx.jpg"
 *          ],
 *          "ga_prefix": "052",
 *          "type": 0,
 *      }]
 *  }
 */
</script>



<style scoped>
.daily-menu ul {
  list-style: none;
}
.daily-menu ul li a {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
}

.daily-menu ul li a:hover,
.daily-menu ul li a.on {
  color: #3399ff;
}

.daily-item {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.daily-date {
  text-align: center;
  margin: 10px 0;
}
</style>
