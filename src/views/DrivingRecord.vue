<template>
  <div class="DrivingRecord" style="height:100%">
    <el-row :gutter="20" style="margin:14px 0">
      <el-col :span="3" :offset="1" style="height:40px">
        <div style="vertical-align:middle">
          <h3 style="margin:7px">
            历史车次
          </h3>
        </div>
      </el-col>
      <el-col :span="2">
        <el-select v-model="searchOption" :placeholder="searchOption">
          <el-option label="编号" value="编号"></el-option>
          <el-option label="车辆" value="车辆"></el-option>
          <el-option label="路线" value="路线"></el-option>
          <el-option label="司机" value="司机"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search" placeholder="输入关键字搜索" prefix-icon="el-icon-search" v-loading.fullscreen.lock="fullscreenLoading"></el-input>
      </el-col>
    </el-row>
    <el-container :style="'height:'+bodyHeight+'px'">
      <el-main style="padding: 0">
        <div>
          <el-row :gutter="20">
            <el-table :data="arr.filter(data => !search || handleSearch(data,searchOption))"
                      stripe
                      border
                      style="width: 90%; margin: auto"
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
              <el-table-column align="center" prop="other" label="备注" min-width="8" />
            </el-table>
          </el-row>
        </div>
      </el-main >
    </el-container>
  </div>
</template>


<script>
export default {
  name: 'vmanage',
  data: function () {
    return {
      arr: [],
      vehicles: [],
      lines: [],
      drivers: [],
      search: '',
      bodyHeight:window.innerHeight-68,
      searchOption: '请选择',
      fullscreenLoading:false,
      drawerPer: (600.0 / window.innerWidth * 100).toString() + '%',
    }
  },
  methods: {
    getList() {
      this.fullscreenLoading = true;
      this.$axios({
        method: "post",
        url: "/line_manage/lines",
        data: {"userType": this.$store.state.userType}
      })
          .then(res => {
            this.lines = []
            for (let i = 0; i < res.data.lines.length; i++) {
              this.lines.push(this.routeCopy(res.data.lines[i]));
            }
            this.$axios({
              method: "post",
              url: "/vehicle_manage/vehicles",
              data: {"userType": this.$store.state.userType}
            })
                .then(res => {
                  this.vehicles = res.data.vehicles;
                  this.$axios({
                    method: "post",
                    url: "/driver_manage/drivers",
                    data: {"userType": this.$store.state.userType}
                  })
                      .then(res => {
                        this.drivers = res.data.drivers;
                        this.$axios({method:'post',
                          url:'/schedule/history',
                          data: {"userType": this.$store.state.userType}
                        })
                            .then(res => {
                              this.arr = []
                              for (let i = 0; i < res.data.servings.length; i++) {
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
                        this.fullscreenLoading = false;
                        this.$router.push('/')
                      })
                })
                .catch(res => {
                  this.fullscreenLoading = false;
                  this.$router.push('/')
                })
          })
          .catch(res => {
            this.fullscreenLoading = false;
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
    handleSearch(data, op) {
      switch (op) {
        default:
          return data.num.toLowerCase().includes(this.search.toLowerCase());
        case '车辆':
          return data.vehicle.num.toLowerCase().includes(this.search.toLowerCase()) || data.vehicle.type.toLowerCase().includes(this.search.toLowerCase());
        case '路线':
          return data.route.num.toLowerCase().includes(this.search.toLowerCase());
        case '司机':
          return data.driver.num.toLowerCase().includes(this.search.toLowerCase()) || data.driver.name.toLowerCase().includes(this.search.toLowerCase());
      }
    },
  },
  created() {
    this.$store.state.currentPage="5"
    this.getList()
  }
}
</script>

<style>
.el-row {
  margin-bottom: 0px;
}

.el-col {
  border-radius: 0px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 0px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #ffffff;
}

.VManage {
  margin: 0px
}
</style>