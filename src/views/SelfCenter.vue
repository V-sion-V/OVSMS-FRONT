<template>
  <div class="containerTable">
    <el-container :style="'height:'+bodyHeight+'px'" v-loading.fullscreen.lock="fullscreenLoading">
      <el-header height="100px" style="background-color: #d3dce6">
        <span style="font-size: 30px; font-family: 华文新魏; font: 华文新魏;margin: 40px">欢迎[{{this.$store.state.username}}]使用本系统，乐意为您提供服务</span>
        <el-button v-on:click="doLogout" style="margin: 30px" type="danger">
          退出登录
        </el-button>
        <el-button v-on:click="doComplaints" style="margin: 30px" type="warning" v-if="this.$store.state.userType==='客户'||this.$store.state.userType==='服务员'">
          投诉
        </el-button>
      </el-header>
      <el-main style="padding: 0" v-if="this.$store.state.userType==='客户'">
        <el-row>
          <el-col>
            <h1>我的车次</h1>
          </el-col>
        </el-row>
        <el-row>
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
            <el-table-column align="center" prop="other" label="取消" min-width="8">
              <el-popconfirm width="160"
                             title="你确定要取消预定吗？"
                             confirm-button-type="danger"
                             cancel-button-type="info"
                             icon="el-icon-info"
                             slot-scope="scope"
                             @confirm="cancel(scope.row.num)">
                <el-tooltip slot="reference" class="item" effect="dark" content="取消车次" placement="top">
                  <el-button type="danger" size="mini">取消</el-button>
                </el-tooltip>
              </el-popconfirm>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-col>
            <h1>我的路线</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="collection"
                    stripe
                    border
                    ref="filterTable"
                    style="width: 97%; margin: auto"
          >
            <el-table-column align="center" prop="num" label="编号" min-width="12">

            </el-table-column>
            <el-table-column align="center" prop="stops.length" label="长度" min-width="12">

            </el-table-column>
            <el-table-column align="center" prop="stops[0].name" label="起点" min-width="12">

            </el-table-column>
            <el-table-column align="center" prop="lastStop.name" label="终点" min-width="12">

            </el-table-column>
            <el-table-column align="center" label="车站" min-width="8">
              <el-popover
                  placement="bottom"
                  slot-scope="scope"
                  width="200"
                  trigger="hover">
                <h3 style="text-align:center">
                  {{ scope.row.num }}
                </h3>
                <el-timeline style="float:left">
                  <el-timeline-item
                      v-for="(stop,index) in scope.row.stops"
                      :key="index"
                      timestamp=''>
                    {{ stop.name }}
                  </el-timeline-item>
                </el-timeline>
                <el-button slot="reference" size='mini'>查看</el-button>
              </el-popover>
            </el-table-column>
          </el-table>
        </el-row>
      </el-main>
      <el-main style="padding: 0" v-else>
        <h1 style="font-size: 80px">您的身份是[{{this.$store.state.userType}}]，工作辛苦啦</h1>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data:function() {
      return {
        bodyHeight:window.innerHeight,
        lines: [],
        vehicles: [],
        drivers: [],
        arr: [],
        collection: [],
        fullscreenLoading: false
      }
    },
    methods: {
      doLogout() {
        this.$store.state.userType='游客'
        this.$store.state.username=''
        this.$store.state.password=''
        this.$cookies.remove("user")
        this.$router.push('/')
      },
      doComplaints(){
             this.$router.push('/Chat');
      },
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
                          this.$axios.post('/ride_record/records',{username:this.$store.state.username})
                              .then(res=>{
                                console.log(res.data)
                                this.arr=[]
                                for(let i = 0; i<res.data.records.length;i++) {
                                  let temp = res.data.records[i]
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
                                  if(this.getByNum(this.collection,temp.line)===null) {
                                    this.collection.push(route);
                                  }
                                }
                                this.fullscreenLoading = false;
                              })
                              .catch(() => {
                                this.fullscreenLoading = false;
                                this.$router.push('/')
                              })
                        })
                        .catch(() => {
                          this.fullscreenLoading=false;
                          this.$router.push('/')
                        })
                  })
                  .catch(() => {
                    this.fullscreenLoading=false;
                    this.$router.push('/')
                  })
            })
            .catch(() => {
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
        return null;
      },
      cancel(num) {
        this.fullscreenLoading=true
        this.$axios({
          method:"post",
          url:"/ride_record/delete",
          data:{username:this.$store.state.username,password:this.$store.state.password,id:num}
        })
            .then(res=>{
          if(res.data.success) {
            this.$notify({
              title:"成功",
              type:"success",
              message:"取消成功",
              position:"bottom-left"
            })
            this.getList()
          } else {
            this.$notify({
              title:"失败",
              type:"error",
              message:"取消失败",
              position:"bottom-left"
            })
            this.fullscreenLoading=false
          }
        })
            .catch(()=>{
              this.$notify({
                title:"失败",
                type:"error",
                message:"连接失败",
                position:"bottom-left"
              })
              this.fullscreenLoading=false
        })
      }
    },
    created() {
      if(this.$store.state.userType==='顾客') {
        this.getList()
      }

    }
  };
</script>
