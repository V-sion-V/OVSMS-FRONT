<template>
  <div>
    <el-container :style="'height:'+bodyHeight+'px'">
      <el-main style="padding: 0" v-loading.fullscreen.lock="fullscreenLoading">
        <img alt="item" src="../assets/1.jpg" width="100%"/>
        <el-tabs value="first" stretch >
          <el-tab-pane label="介绍" name="first">
            <h1> 欢迎来到“Oops!”车辆服务管理系统™</h1>
            <h3> 我们提供最好的车辆服务 </h3>
            <el-link @click="$router.push('/Login')" type="primary" v-if="this.$store.state.userType==='游客'">登录</el-link>
            <span style="font-size: 13px" v-if="this.$store.state.userType==='游客'">来获取更多功能</span>
            <h3 v-else> 您已登录，OVSMS为您服务 </h3>
          </el-tab-pane>
          <el-tab-pane label="当前车次" name="second">
            <div>
              <el-row :gutter="20">
                <el-table :data="arr"
                          stripe
                          border
                          style="width: 97%; margin: auto"
                >
                  <el-table-column align="center" prop="num" label="编号" min-width="8" sortable/>
                  <el-table-column align="center" label="车辆" min-width="8">
                    <el-popover
                        placement="bottom"
                        slot-scope="scope"
                        width="200"
                        trigger="hover">
                      <h3 style="text-align:center;margin-top:10px">
                        详细信息
                      </h3>
                      <ul>
                        <li style="margin:15px">型号：{{ scope.row.vehicle.type }}</li>
                        <li style="margin:15px">载荷：{{ scope.row.vehicle.load }}</li>
                        <li style="margin:15px" v-if="scope.row.vehicle.avl">可用性：可用</li>
                        <li style="margin:15px" v-else>可用性：禁用</li>
                      </ul>
                      <el-button slot="reference" size='mini' style="width:70%">{{ scope.row.vehicle.num }}</el-button>
                    </el-popover>
                  </el-table-column>
                  <el-table-column align="center" label="路线" min-width="8">
                    <el-popover
                        placement="bottom"
                        slot-scope="scope"
                        width="200"
                        trigger="hover">
                      <h3 style="text-align:center;margin-top:10px">
                        车站信息
                      </h3>
                      <el-timeline style="float:left">
                        <el-timeline-item
                            v-for="(stop,index) in scope.row.route.stops"
                            :key="index"
                            timestamp=''>
                          {{ stop.name }}
                        </el-timeline-item>
                      </el-timeline>
                      <el-button slot="reference" size='mini' style="width:70%">{{ scope.row.route.num }}</el-button>
                    </el-popover>
                  </el-table-column>
                  <el-table-column align="center" label="司机" min-width="8">
                    <el-popover
                        placement="bottom"
                        slot-scope="scope"
                        width="200"
                        trigger="hover">
                      <h3 style="text-align:center;margin-top:10px">
                        详细信息
                      </h3>
                      <ul>
                        <li style="margin:15px">姓名：{{ scope.row.driver.name }}</li>
                        <li style="margin:15px">年龄：{{ scope.row.driver.age }}</li>
                        <li style="margin:15px" v-if="scope.row.driver.part">是否兼职：是</li>
                        <li style="margin:15px" v-else>是否兼职：否</li>
                        <li style="margin:15px" v-if="scope.row.driver.avl">状态：在职</li>
                        <li style="margin:15px" v-else>状态：停职</li>
                      </ul>
                      <el-button slot="reference" size='mini' style="width:70%">{{ scope.row.driver.num }}</el-button>
                    </el-popover>
                  </el-table-column>
                  <el-table-column align="center" prop="duration.start" label="发车时间" min-width="8" sortable/>
                  <el-table-column align="center" prop="duration.end" label="到达时间" min-width="8" sortable/>
                  <el-table-column align="center" prop="reservation" label="已预定/总载荷" min-width="8"/>
                  <el-table-column align="center" prop="other" label="备注" min-width="8"/>
                  <el-table-column align="center" v-if="this.$store.state.userType==='客户'" label="预约上车" min-width="8">
                    <el-tooltip slot-scope="scope" class="item" effect="dark" content="预定该车次" placement="top">
                      <el-button v-on:click="reserve(scope.row.num)" type="info" size="mini" >预定</el-button>
                    </el-tooltip>
                  </el-table-column>
                </el-table>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="全站通知" name="third">
            <el-collapse style="padding: 10px;margin-left: 20%;margin-right: 20%">
              <el-collapse-item title="热烈庆祝开发完成" name="1">
                <div>OVSMS开发完成啦啊啦啦啦</div>
                <div>保持了我们一贯的风格呢</div>
              </el-collapse-item>
              <el-collapse-item title="预定系统上线" name="2">
                <div>现在用户可以在首页预定自己的车次了</div>
                <div>再也不用挤公交了~</div>
              </el-collapse-item>
              <el-collapse-item title="投诉系统上线" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
<script>
  export default {
    data() {
      return {
        headerImg:[{index:1,url:"../assets/1.jpg"},
          {index:2,url:"http://prts.wiki/images/b/b3/%E7%AB%8B%E7%BB%98_%E6%B5%8A%E5%BF%83%E6%96%AF%E5%8D%A1%E8%92%82_2.png"},
          {index:3,url:"http://prts.wiki/images/6/65/%E7%AB%8B%E7%BB%98_%E5%87%AF%E5%B0%94%E5%B8%8C_2.png"}],
        lines: [],
        vehicles: [],
        drivers: [],
        arr: [],
        fullscreenLoading: false,
        bodyHeight:window.innerHeight
      }
    },
    methods: {
      getList(){
        this.fullscreenLoading=true;
        this.$axios({
          method:"post",
          url:"/line_manage/lines",
          data:{"userType":this.$store.state.userType}
        })
            .then(res => {
              this.lines = []
              for(let i = 0; i<res.data.lines.length; i++) {
                this.lines.push(this.routeCopy(res.data.lines[i]));
              }
              this.$axios({
                method:"post",
                url:"/vehicle_manage/vehicles",
                data:{"userType":this.$store.state.userType}
              })
                  .then(res => {
                    this.vehicles = res.data.vehicles;
                    this.$axios({
                      method:"post",
                      url:"/driver_manage/drivers",
                      data:{"userType":this.$store.state.userType}
                    })
                        .then(res => {
                          this.drivers = res.data.drivers;
                          this.$axios.post('/schedule/serving',{userType:this.$store.state.userType})
                              .then(res=>{
                                this.arr=[]
                                for(let i = 0; i<res.data.servings.length;i++) {
                                  let temp = res.data.servings[i]
                                  let route = this.getByNum(this.lines, temp.line);
                                  let vehicle = this.getByNum(this.vehicles, temp.vehicle);
                                  let driver = this.getByNum(this.drivers, temp.driver)
                                  this.arr.push({
                                    num: temp.num,
                                    route: route,
                                    vehicle: vehicle,
                                    driver: driver,
                                    duration: {
                                      start: temp.start,
                                      end: temp.end
                                    },
                                    reservation: temp.reservation + "/" + vehicle.load
                                    , other: temp.other
                                  })
                                }
                                this.fullscreenLoading = false;
                              })
                              .catch(res => {
                                this.fullscreenLoading = false;
                                this.$router.push('/')
                              })
                        })
                        .catch(res => {
                          this.fullscreenLoading=false;
                          this.$router.push('/')
                        })
                  })
                  .catch(res => {
                    this.fullscreenLoading=false;
                    this.$router.push('/')
                  })
            })
            .catch(res => {
              this.fullscreenLoading=false;
              this.$router.push('/')
            })
      },
      routeCopy (a){
        return {
          num: a.num,
          stops: Array.from(a.stops),
          avl: a.avl,
          other: a.other,
          lastStop: a.stops[a.stops.length - 1],
        }
      },
      getByNum(data,num) {
        for(let i = 0; i<data.length;i++){
          if(data[i].num===num) return data[i];
        }
      },
      reserve(num) {
        this.fullscreenLoading=true
        this.$axios.post('/ride_record/add',{username:this.$store.state.username,password:this.$store.state.password,id:num})
            .then(res=>{
              if(res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '预约成功',
                  position: 'bottom-left',
                  type: "success"
                })
                this.getList()
              } else {
                this.$notify({
                  title: '错误',
                  message: '预约失败',
                  position: 'bottom-left',
                  type: "error"
                })
              }
              this.fullscreenLoading=false;
            })
            .catch(res=>{
              this.$notify({
                title: '错误',
                message: '连接失败',
                position: 'bottom-left',
                type: "error"
              })
              this.fullscreenLoading=false;
            })
      }
    },
    created() {
      this.$store.state.currentPage="1"
      this.getList()
    }
  }
</script>
