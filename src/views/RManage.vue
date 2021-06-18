<template>
  <div class="VManage" style="height:100%">
    <el-row :gutter="20" style="margin:14px 0">
      <el-col :span="3" :offset="1" style="height:40px">
        <div style="vertical-align:middle">
          <h3 style="margin:7px;">
            路线管理
          </h3>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" v-on:click="addini" v-loading.fullscreen.lock="fullscreenLoading">新增路线</el-button>
      </el-col>
      <el-col :span="2">
        <el-select v-model="searchOption" :placeholder="searchOption">
          <el-option label="编号" value="编号"></el-option>
          <el-option label="长度" value="长度"></el-option>
          <el-option label="途经" value="途经"></el-option>
          <el-option label="备注" value="备注"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search" placeholder="输入关键字搜索" prefix-icon="el-icon-search"></el-input>
      </el-col>
    </el-row>
    <el-container :style="'height:'+bodyHeight+'px'">
      <el-main style="padding: 0">
        <div>
          <el-row :gutter="20">
            <el-table :data="arr.filter(data => !search || handleSearch(data,searchOption))"
                      stripe
                      border
                      ref="filterTable"
                      style="width: 90%; margin: auto"
            >
              <el-table-column align="center" prop="num" label="编号" min-width="12">

              </el-table-column>
              <el-table-column align="center" prop="stops.length" label="长度" min-width="12">

              </el-table-column>
              <el-table-column align="center" prop="stops[0].name" label="起点" min-width="12">

              </el-table-column>
              <el-table-column align="center" prop="lastStop.name" label="终点" min-width="12">

              </el-table-column>
              <el-table-column align="center" label="可用性" min-width="12"
                               :filters="[{text:'可用',value:true},{text:'禁用',value:false}]" :filter-method="filterAvl">
                <el-switch v-model="scope.row.avl" slot-scope="scope" active-color="#3292ff" inactive-color="#99a9bf"
                           active-text="启用" inactive-text="禁用" disabled></el-switch>
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
              <el-table-column align="center" label="编辑" min-width="8">
                <el-button slot-scope="scope" @click="editini(scope.row)" size='mini'>编辑</el-button>
              </el-table-column>
              <el-table-column align="center" label="删除" min-width="8">
                <el-popconfirm width="160"
                               title="你确定要删除路线吗？"
                               confirm-button-type="danger"
                               cancel-button-type="infomation"
                               icon="el-icon-info"
                               slot-scope="scope"
                               @confirm="deleteR(scope.row)">
                  <el-tooltip slot="reference" class="item" effect="dark" content="删除该路线" placement="top">
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
        :title="drawertitle"
        :visible.sync="drawer"
        direction="rtl"
        :size="drawerPer">
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16" :offset="3">
          <div>
            <el-form ref="newRoute" :model="newRoute" label-width="20%">
              <el-form-item label="编号">
                <el-input placeholder="请输入编号" v-model="newRoute.num" :disabled="drawertitle==='修改路线'"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="editStopsVisible=true;" style="width:60%">编辑站点</el-button>
              </el-form-item>
              <el-form-item label="可用">
                <el-switch
                　v-model="newRoute.avl" active-color="#3292ff" inactive-color="#99a9bf" active-text="启用"
                inactive-text="禁用"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input resize="none" type="textarea" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 10}"
                          v-model="newRoute.other"/>
              </el-form-item>
              <el-form-item>
                <el-button v-if="drawertitle==='新建路线'" type="primary" @click="add" style="width:30%">确认</el-button>
                <el-button v-else type="primary" @click="edit" style="width:30%">保存</el-button>
                <el-button type="info" @click="drawer=false" style="width:30%">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
    <el-dialog
        title="编辑站点"
        :visible.sync="editStopsVisible"
        width="480px"
        center>
      <el-form ref="newRoute" :model="newRoute" label-width="15%">
        <el-form-item
            v-for="(stop, index) in newRoute.stops"
            :label="'车站' + (index+1).toString()"
            :key="index"
            prop="stop">
          <el-input v-model="stop.name" style="width:70%;margin:0px,10px,0px,10px"></el-input>
          <el-button @click.prevent="newRoute.stops.splice(index, 1)" style="float:right;margin-right:5%">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="newRoute.stops.push({name:''});" style="width:82.5%">新站</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="width:20%;margin:0% 40% 0% 40%" @click="editStopsVisible=false;">确定</el-button>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'vmanage',
  data: function () {
    return {
      arr: [],
      count: 0,
      drawer: false,
      drawertitle: '',
      fullscreenLoading:false,
      editStopsVisible: false,
      bodyHeight:window.innerHeight-68,
      newRoute: {
        num: '',
        other: '',
        stops: [],
        avl: true,
      },
      editIndex: -1,
      search: '',
      searchOption: '请选择',
      drawerPer: (600.0 / window.innerWidth * 100).toString() + '%',
    }
  },
  methods: {
    checkRouteError() {
      if (this.newRoute.num === '') {
        this.$notify({
          title: '错误',
          message: '请输入编号',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if (this.newRoute.num.length > 10) {
        this.$notify({
          title: '错误',
          message: '编号最多10个字符',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if (this.newRoute.stops.length > 20) {
        this.$notify({
          title: '错误',
          message: '不能多于15个车站',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if (this.newRoute.stops.length < 2) {
        this.$notify({
          title: '错误',
          message: '请建立至少两个车站',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else {
        for (let i = 0; i < this.newRoute.stops.length; i++) {
          if (this.newRoute.stops[i].name === '') {
            this.$notify({
              title: '错误',
              message: '请为' + (i + 1) + '号车站输入名字',
              position: 'bottom-left',
              type: "error"
            });
            return false;
          }
          if (this.newRoute.stops[i].name.length > 10) {
            this.$notify({
              title: '错误',
              message: (i + 1) + '号车站名字过长',
              position: 'bottom-left',
              type: "error"
            });
            return false;
          }
        }
        return true;
      }
    },
    routeCopy(a) {
      return {
        num: a.num,
        stops: Array.from(a.stops),
        avl: a.avl,
        other: a.other,
        lastStop: a.stops[a.stops.length - 1],
      }
    },
    addini() {
      this.newRoute = {num: '', avl: true, other: '', stops: []}
      this.drawertitle = '新建路线';
      this.drawer = true;
    },
    add() {
      if (this.checkRouteError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/line_manage/add",{userType:this.$store.state.userType,newLine:this.newRoute})
            .then(res=>{
              if(res.data.success) {
                this.drawer = false;
                this.$notify({
                  title: '成功',
                  message: '路线已被创建',
                  type: 'success',
                  position: 'bottom-left'
                });
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '路线已存在',
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
      }
    },
    editini(row) {
      this.newRoute = {num: '', avl: true, other: '', stops: []}
      this.newRoute.num = row.num;
      this.newRoute.other = row.other;
      this.newRoute.avl = row.avl;
      this.newRoute.stops = []
      for(let i =0; i< row.stops.length; i++) {
        this.newRoute.stops.push({name:row.stops[i].name})
      }
      this.drawertitle = '修改路线';
      this.drawer = true;
    },
    edit() {
      if (this.checkRouteError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/line_manage/edit", {userType: this.$store.state.userType, newLine: this.newRoute})
            .then(res => {
              if (res.data.success) {
                this.drawer = false;
                this.$notify({
                  title: '成功',
                  message: '更改已保存',
                  type: 'success',
                  position: 'bottom-left'
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '更改未保存',
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
      this.$axios.post("/line_manage/delete", {userType: this.$store.state.userType, num:row.num})
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '路线已被删除',
                type: 'success',
                position: 'bottom-left'
              });
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '删除时出现错误',
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

    },
    filterAvl(value, row) {
      return row.avl === value;
    },
    handleSearch(data, op) {
      switch (op) {
        default:
          return data.num.toLowerCase().includes(this.search.toLowerCase());
        case '途经':
          for (let i = 0; i < data.stops.length; i++) {
            if (data.stops[i].name.toLowerCase().includes(this.search.toLowerCase())) return true;
          }
          return false;
        case '长度':
          return data.stops.length === parseInt(this.search);
        case '备注':
          return data.other.toLowerCase().includes(this.search.toLowerCase());
      }
    },
    getList() {
      this.fullscreenLoading=true;
      this.$axios({
        method:"post",
        url:"/line_manage/lines",
        data:{"userType":this.$store.state.userType}
      })
          .then(res => {
            this.arr = []
            for(let i = 0; i<res.data.lines.length; i++) {
              this.arr.push(this.routeCopy(res.data.lines[i]));
            }
            this.fullscreenLoading=false;
          })
          .catch(res => {
            this.fullscreenLoading=false;
            this.$router.push('/')
          })
    },
  },
  created() {
    this.$store.state.currentPage="2-2"
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