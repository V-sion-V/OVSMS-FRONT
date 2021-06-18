<template>
  <div id="app" :style="heightAndWidth" >
    <el-col :span="2" style="height:100%">
      <el-menu :default-active="$store.state.currentPage" id="menu"
               style="height:100%;width:100%" direction = "horizontal"
               background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
               :router="true">
        <el-menu-item index="1" route="/">首页</el-menu-item>
        <el-submenu v-if="this.$store.state.userType==='管理员'" index="2">
          <template slot="title">管理</template>
          <el-menu-item index="2-1" style="min-width:100%" route="/VManage">车辆管理</el-menu-item>
          <el-menu-item index="2-2" style="min-width:100%" route="/RManage">路线管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" v-if="this.$store.state.userType==='人事'" route="/DriverManage">人事</el-menu-item>
        <el-menu-item index="4" v-if="this.$store.state.userType==='调度员'" route="/Scheduling">调度</el-menu-item>
        <el-menu-item index="5" v-if="this.$store.state.userType==='调度员'||this.$store.state.userType==='管理员'" style="min-width:100%" route="/DrivingRecord">行驶记录</el-menu-item>
        <el-menu-item index="0" v-if="this.$store.state.userType!=='游客'" route="/SelfCenter">个人中心</el-menu-item>
        <el-menu-item index="99" v-if="this.$store.state.userType==='游客'" route="/Login">登录</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="22">
      <router-view></router-view>
    </el-col>
  </div>
</template>

<script>
export default {
  data: function() {
    return{
      heightAndWidth: 'margin:0; height:'+
        (window.innerHeight).toString()+
        'px; width:'+
        (window.innerWidth).toString()+
        'px;',
    }
  },
  created() {
    if(this.$cookies.isKey("user")) {
      const user = this.$cookies.get("user");
      this.$axios({
        method: "post",
        url: "Login",
        data: user
      })
          .then(res => {
            if (res.data.success) {
              this.$store.state.username = user.username;
              this.$store.state.password = user.password;
              this.$store.state.userType = res.data.userType;
            } else {
              this.$store.state.userType = '游客'
            }
          })
          .catch(res => {
            this.$notify({
              title: '错误',
              message: '连接失败',
              position: 'bottom-left',
              type: "error"
            })
          })
    }
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0px;
  text-align: center;
}
</style>
