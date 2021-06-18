<template>
  <div class="DrivingRecord" style="height:100%;">
    <el-row :gutter="20" style="margin: 14px 0">
      <el-col :span="3" :offset="1" style="height:40px">
        <div style="vertical-align:middle">
          <h3 style="margin:7px">
            车次调度
          </h3>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" v-on:click="addini" v-loading.fullscreen.lock="fullscreenLoading">新增车次</el-button>
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
        <el-input v-model="search" placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
      </el-col>
    </el-row>
    <el-container :style="'height:'+bodyHeight+'px'" >
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
              <el-table-column align="center" prop="other" label="备注" min-width="8"/>
              <el-table-column align="center" label="删除" min-width="8">
                <el-popconfirm width="160"
                               title="你确定要删除车次吗？"
                               confirm-button-type="danger"
                               cancel-button-type="info"
                               icon="el-icon-info"
                               slot-scope="scope"
                               @confirm="deleteR(scope.row)">
                  <el-tooltip slot="reference" class="item" effect="dark" content="删除该车次" placement="top">
                    <el-button type="danger" size="mini">删除</el-button>
                  </el-tooltip>
                </el-popconfirm>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </el-main>
    </el-container>
    <el-drawer
        title="新增车次"
        :visible.sync="drawer"
        direction="rtl"
        :size="drawerPer">
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16" :offset="3">
          <div>
            <el-form ref="newRecord" :model="newSchedule" label-width="20%">
              <el-form-item label="编号">
                <el-input placeholder="请输入编号" v-model="newSchedule.num"/>
              </el-form-item>
              <el-form-item label="路线">
                <el-select v-model="newSchedule.route" placeholder="请选择路线">
                  <el-option
                      v-for="item in lines"
                      :key="item.num"
                      :label="item.num"
                      :value="item.num"
                      :disabled="!item.avl">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车辆">
                <el-select v-model="newSchedule.vehicle" placeholder="请选择车辆">
                  <el-option
                      v-for="item in vehicles"
                      :key="item.num"
                      :label="item.num + ' - ' + item.type + '（' + item.load+'）'"
                      :value="item.num"
                      :disabled="!item.avl">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="司机">
                <el-select v-model="newSchedule.driver" placeholder="请选择司机">
                  <el-option
                      v-for="item in drivers"
                      :key="item.num"
                      :label="item.num+' - '+item.name"
                      :value="item.num"
                      :disabled="!item.avl">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发车时间">
                <el-date-picker
                    v-model="newSchedule.duration.start"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="到达时间">
                <el-date-picker
                    v-model="newSchedule.duration.end"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" resize="none" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 10}"
                          v-model="newSchedule.other"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="add" style="width:30%">确认</el-button>
                <el-button type="info" @click="drawer=false" style="width:30%">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>


<script>
export default {
  name: 'vmanage',
  data: function () {
    return {
      lines: [],
      vehicles: [],
      drivers: [],
      arr: [],
      fullscreenLoading:false,
      search: '',
      searchOption: '请选择',
      drawerPer: (600.0 / window.innerWidth * 100).toString() + '%',
      drawer: false,
      bodyHeight: window.innerHeight-68,
      newSchedule: {
        num: '',
        route: '',
        vehicle: '',
        driver: '',
        duration: {
          start: '',
          end: ''
        },
        other: ''
      }
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
    addini() {
      this.newSchedule = {num:'',route: '',vehicle: '',driver: '',duration: {start: '',end: ''},other:'' }
      this.drawer = true;
    },
    checkSchedule() {
      if(this.newSchedule.num==='') {
        this.$notify({
          title: '错误',
          message: '请输入车次编号',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if(this.newSchedule.route==='') {
        this.$notify({
          title: '错误',
          message: '请选择路线',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if(this.newSchedule.vehicle==='') {
        this.$notify({
          title: '错误',
          message: '请选择车辆',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if(this.newSchedule.driver==='') {
        this.$notify({
          title: '错误',
          message: '请选择司机',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if(this.newSchedule.duration.start==='') {
        this.$notify({
          title: '错误',
          message: '请选择发车时间',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if(this.newSchedule.duration.end==='') {
        this.$notify({
          title: '错误',
          message: '请选择结束时间',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      }
      return true;
    },
    add() {
      if(this.checkSchedule()) {
        this.fullscreenLoading = true;
        this.$axios.post('schedule/add', {userType: this.$store.state.userType,
          newSchedule: {
            num: this.newSchedule.num,
            route: this.newSchedule.route,
            vehicle: this.newSchedule.vehicle,
            driver: this.newSchedule.driver,
            duration:{
              start:{
                year:this.newSchedule.duration.start.getFullYear(),
                month:this.newSchedule.duration.start.getMonth()+1,
                day:this.newSchedule.duration.start.getDate(),
                hour:this.newSchedule.duration.start.getHours(),
                minute:this.newSchedule.duration.start.getMinutes(),
              },
              end:{
                year:this.newSchedule.duration.end.getFullYear(),
                month:this.newSchedule.duration.end.getMonth()+1,
                day:this.newSchedule.duration.end.getDate(),
                hour:this.newSchedule.duration.end.getHours(),
                minute:this.newSchedule.duration.end.getMinutes(),
              }
            },
            other: this.newSchedule.other
          }})
            .then(res => {
              if (res.data.success) {
                this.drawer = false;
                this.$notify({
                  title: '成功',
                  message: '车次已被创建',
                  type: 'success',
                  position: 'bottom-left'
                });
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '车次创建失败',
                  type: 'error',
                  position: 'bottom-left'
                });
              }
              this.fullscreenLoading = false;
            })
            .catch(res => {
              this.$notify({
                title: '失败',
                message: '连接失败',
                type: 'error',
                position: 'bottom-left'
              });
              this.fullscreenLoading = false;
            })
      }
    },
    deleteR(row) {
      this.fullscreenLoading=true;
      this.$axios.post('schedule/delete',{userType:this.$store.state.userType,num:row.num})
          .then(res=>{
            if(res.data.success) {
              this.drawer = false;
              this.$notify({
                title: '成功',
                message: '车次已被删除',
                type: 'success',
                position: 'bottom-left'
              });
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '车次删除失败',
                type: 'error',
                position: 'bottom-left'
              });
            }
            this.fullscreenLoading=false;
          })
          .catch(res=>{
            this.$notify({
              title: '失败',
              message: '连接失败',
              type: 'error',
              position: 'bottom-left'
            });
            this.fullscreenLoading=false;
          })
    },
    handleSearch(data, op) {
      switch (op) {
        default:
          return data.num.toLowerCase().includes(this.search.toLowerCase());
        case '车辆':
          return data.vehicle.num.toLowerCase().includes(this.search.toLowerCase())||data.vehicle.type.toLowerCase().includes(this.search.toLowerCase());
        case '路线':
          return data.route.num.toLowerCase().includes(this.search.toLowerCase());
        case '司机':
          return data.driver.num.toLowerCase().includes(this.search.toLowerCase())||data.driver.name.toLowerCase().includes(this.search.toLowerCase());
      }
    }
  },
  created() {
    this.getList();
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