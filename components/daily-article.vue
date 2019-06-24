<template>
  <div class="daily-article">
    <div class="daily-article-title">{{data.title}}</div>
    <div class="daily-article-content" v-html="data.body"></div>

    <div class="daily-comments" v-show="comments.length">
      <span>评论{{comments.length}}</span>
      <div class="daily-comment" v-for="comment in comments" :key="comment.key">
        <div class="daily-comment-avatar">
          <img :src="comment.avatar" alt>
        </div>
        <div class="daily-comment-content">
          <div class="daily-comment-name">{{comment.author}}</div>
          <div class="daily-comment-time" v-time="comment.time"></div>
          <div class="daily-comment-text">{{comment.content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Time from "../directives/time";
import $ from "../lib/util";

export default {
  directives: { Time },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      /**
       * 文章数据结构示例：
       * {
       *    "title": "梅雨期的雨水，腊月天的雪水",
       *    "body": "文章内容格式 html",
       *    "id": 9354,
       *    "type": 0,
       *    "image": "https://pic3.zhimg.com/xxx.jpg",
       *    "image_source": "T.Tseng / CC BY",
       *    "images": [
       *        "https://pic4.zhimg.com/xxx.jpg",
       *    ],
       *    "share_url": "http://daily.zhihu.com/story/939",
       *    "ga_prefix": "05311",
       *    "js": [],
       *    "css": [
       *        "http://new-at.zhihu.com/css/news_qa.auto.css?v=20190613"
       *    ]
       * }
       */

      /**
       * 评论数据结构示例：
       * "comments": [
       *    {
       *        "author": "腾讯",
       *        "content": "善泳者溺于水！",
       *        "avatar": "http://pic1.zhimg.com/xxx.jpg",
       *        "time": 1493788521,
       *        "id": 288512,
       *        "likes": 0,
       *    }
       * ]
       */
      data: {},
      comments: []
    };
  },

  methods: {
    /**
     * 获取文章信息
     */
    getArticle() {
      $.ajax.get("news/" + this.id).then(res => {
        //将文章中的图片地址替换为代理的地
        res.body = res.body.replace(
          /src="http/g,
          'src="' + $.imgPath + "http"
        );
        res.body = res.body.replace(
          /src="https/g,
          'src="' + $.imgPath + "https"
        );
        this.data = res;
        //返回文章顶端。
        //注意：.daily-article 并没有使用 overflow:auto 滚动，而是自然高度，所以这里让页面返回顶端并不能使用 .daily-article 的 ScollTop = 0
        window.scrollTo(0, 0);

        //获取评论信息
        this.getComments();
      });
    },
    /**
     * 获取评论信息
     */
    getComments() {
      this.comments = [];
      $.ajax.get("story/" + this.id + "/short-comments").then(res => {
        this.comments = res.comments.map(comment => {
          //将头像的图片地址转为代理地址
          comment.avatar = $.imgPath + comment.avatar;
          return comment;
        });
      });
    }
  },

  watch: {
    id(val) {
      if (val) this.getArticle();
    }
  }
};
</script>

<style scoped>
.daily-article {
  margin-left: 450px;
  padding: 20px;
}

.daily-article-title {
  font-size: 28px;
  font-weight: bold;
  color: #222;
  padding: 10px 0;
}

.view-more a {
  display: block;
  cursor: pointer;
  background: #f5f7f9;
  text-align: center;
  color: inherit;
  text-decoration: none;
  padding: 4px 0;
  border-radius: 3px;
}

.daily-comment {
  margin: 10px 0;
}

.daily-comment span {
  display: block;
  margin: 10px 0;
  font-size: 20px;
}

.daily-comment {
  overflow: hidden;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e3e8ee;
}

.daily-comment-avatar {
  width: 50px;
  height: 50px;
  float: left;
}

.daily-comment-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
}

.daily-comment-content {
  margin-left: 65px;
}

.daily-comment-name {
}

.daily-comment-time {
  color: #9ea7b4;
  font-size: 14px;
  margin-top: 5px;
}

.daily-comment-text {
  margin-top: 10px;
}
</style>

