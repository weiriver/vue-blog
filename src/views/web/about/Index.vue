<template>
  <div class="about">
    <h2>
      <!--<img src="../../../assets/images/logo.jpg" alt="">-->
      技术无间, 快乐为道
    </h2>
    <el-divider content-position="left" class="divider-title"><i class="el-icon-paperclip mr10"></i>博客简述
    </el-divider>
    <div class="about-content">
      本博客使用的技术为 koa2 + mysql + elementUI <br>
      欢迎star, 源码地址为 <a href="https://github.com/weiriver/vue-blog" target="_blank">github</a> , 仅供参考，不做商业用途！
    </div>
    <el-divider content-position="left" class="divider-title"><i class="el-icon-paperclip mr10"></i> 关 于 我
    </el-divider>
    <ul class="about-content">
      <li>姓名：张伟江</li>
      <li>学历：本科</li>
      <li>联系方式：
        <i aria-label="icon: qq" class="anticon anticon-qq">
          <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="qq" width="1em" height="1em"
               fill="currentColor" aria-hidden="true">
            <path
              d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"></path>
          </svg>
        </i>
        <span class="hi-txt"> 2869659022</span>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-message"></i>
        <a class="hi-txt" href='mailto:2869659022@qq.com'> 2869659022@qq.com</a>
      </li>
      <li>坐标：<i class="el-icon-location-information"></i> 深圳</li>
      <li>
        技能：
        <ul>
          <li class="skill" v-for="item in skills" :key="item.id">
            <span class="skill-title">{{item.title}}</span>
            <el-rate :colors="['#fadb14','#fadb14','#fadb14','#fadb14']" class="skill-rate" v-model="item.rate"
                     disabled></el-rate>
          </li>
        </ul>
      </li>
      <li>其他：
        <ul>
          <li class="skill" v-for="item in others" :key="item.id">
            <span class="skill-title">{{item.title}}</span>
          </li>
        </ul>
      </li>
      <li>个人：
        <ul>
          <li class="skill" v-for="item in myself" :key="item.id">
            <span class="skill-title">{{item.title}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'about',
  components: {},
  computed: {},
  data() {
    return {
      skills: [
        {
          title: 'HTML、CSS、Javascript：能熟练开发符合 W3C 标准的页面！',
          rate: 3
        },
        {
          title: 'Vue、Nuxt、mpvue 框架：熟练掌握使用！',
          rate: 4
        },
        {
          title: 'es6、es7：日常开发必备，以及掌握基本面向对象编程实现！',
          rate: 3
        },
        {
          title: 'webpack: 可以对脚手架进行针对性的打包配置！',
          rate: 3
        },
        {
          title: 'node：熟悉nodejs,掌握基本api接口,独立编写小工具,能独立使用koa2开发应用',
          rate: 3
        },
        {
          title: '数据库：掌握mysql、mongoDB基本操作',
          rate: 2
        },
        {
          title: '微信产品：小程序、公众号开发',
          rate: 3
        }
      ],
      others: [
        {
          title: '常用开发工具： webstorm、git、svn'
        },
        {
          title: '熟悉的 UI 工具：element-ui、iview、vux'
        },
        {
          title: '良好的代码习惯： 略微代码洁癖、注释规范 jsdoc'
        },
        {
          title: 'nginx: 了解nginx的基本操作！'
        }
      ],
      myself: [
        {
          title: '思进取, 追高效, 爱玩游戏(王者永远上不去), 伪耳机发烧友'
        },
        {
          title: '欢迎交流！'
        }
      ]
    }
  },
  methods: {},
  async mounted() {
  }
}
</script>

<style lang="scss">
  .about {
    .divider-title {
      .el-divider {
        margin-top: 20px;
      }
      .el-divider__text {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .about-content {
      line-height: 40px;
      font-size: 14px;
      font-family: "Microsoft YaHei UI", 宋体;
      /*color: #555;*/
      color: #2b2b2b;
      .hi-txt {
        color: #1890ff;
      }
      i {
      }
      & > li {
        list-style: circle inside;
        vertical-align: center;
        /*list-style-type: circle;*/
        /*list-style-position: inside;*/
      }
      li {
        list-style: circle inside;
        line-height: 26px;
        p {
          margin: 0;
          display: inline-block;
          vertical-align: top;
        }
        & > ul {
          box-sizing: border-box;
          padding-left: 40px;
          /*margin-left: 20px;*/
        }
      }
      .skill {
        .skill-title {
          /*margin-left: 40px;*/
          margin-right: 10px;
        }
        .skill-rate {
          display: inline-block;
          vertical-align: baseline;
          font-size: 28px;
          .el-rate__icon {
            font-size: 28px;
          }
        }
      }
    }
  }

</style>
