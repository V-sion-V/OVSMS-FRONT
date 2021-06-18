<template>
  <div class="VManage" style="height:100%">
    <el-row :gutter="20" style="margin: 14px 0">
      <el-col :span="3" :offset="1" style="height:40px">
        <div style="vertical-align:middle">
          <h3 style="margin:7px">
            车辆管理
          </h3>
        </div>
      </el-col>
      <el-col :span="2" >
        <el-button type="primary" v-on:click="addini" v-loading.fullscreen.lock="fullscreenLoading">新增车辆</el-button>
      </el-col>
      <el-col :span="2">
        <el-select v-model="searchOption" :placeholder="searchOption">
          <el-option label="车牌" value="车牌"></el-option>
          <el-option label="型号" value="型号"></el-option>
          <el-option label="荷载" value="载荷"></el-option>
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
              <el-table-column align="center" prop="num" label="车牌" min-width="18">

              </el-table-column>
              <el-table-column align="center" prop="type" label="型号" min-width="18">

              </el-table-column>
              <el-table-column align="center" prop="load" label="荷载" min-width="18" sortable>

              </el-table-column>
              <el-table-column align="center" label="可用性" min-width="22"
                               :filters="[{text:'可用',value:true},{text:'禁用',value:false}]" :filter-method="filterAvl">
                <el-switch v-model="scope.row.avl" slot-scope="scope" active-color="#3292ff" inactive-color="#99a9bf" disabled
                           active-text="启用" inactive-text="禁用"></el-switch>
              </el-table-column>
              <el-table-column align="center" label="查看" min-width="12">
                <el-button slot-scope="scope" @click="editini(scope.row)" size='mini'>查看</el-button>
              </el-table-column>
              <el-table-column align="center" label="删除" min-width="12">
                <el-popconfirm width="160"
                               title="你确定要删除车辆吗？"
                               confirm-button-type="danger"
                               cancel-button-type="info"
                               icon="el-icon-info"
                               slot-scope="scope"
                               @confirm="deleteV(scope.row)">
                  <el-tooltip slot="reference" class="item" effect="dark" content="删除该车辆" placement="top">
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
        title="新增车辆"
        :visible.sync="drawer"
        direction="rtl"
        :size="drawerPer">
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16" :offset="3">
          <div>
            <el-form ref="newVehicle" :model="newVehicle" label-width="20%">
              <el-form-item label="车牌">
                <el-input placeholder="请输入车牌号" v-model="newVehicle.num"/>
              </el-form-item>
              <el-form-item label="型号">
                <el-input placeholder="请输入车辆型号" v-model="newVehicle.type"/>
              </el-form-item>
              <el-form-item label="载荷">
                <el-slider v-model="newVehicle.load" :min="1" :max="100" show-input/>
              </el-form-item>
              <el-form-item label="可用">
                <el-switch
                　v-model="newVehicle.avl" active-color="#3292ff" inactive-color="#99a9bf" active-text="启用"
                inactive-text="禁用"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" resize="none" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 10}"
                          v-model="newVehicle.other"/>
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
    <el-drawer
        title="查看信息"
        :visible.sync="drawer2"
        direction="rtl"
        :size="drawerPer">
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16" :offset="3">
          <div>
            <el-form ref="newVehicle" :model="newVehicle" label-width="20%">
              <el-form-item label="车牌">
                <el-input placeholder="请输入车牌号" v-model="newVehicle.num" disabled/>
              </el-form-item>
              <el-form-item label="型号">
                <el-input placeholder="请输入车辆型号" v-model="newVehicle.type" :disabled="!editAvl"/>
              </el-form-item>
              <el-form-item label="载荷">
                <el-slider v-model="newVehicle.load" :min="1" :max="100" show-input :disabled="!editAvl"/>
              </el-form-item>
              <el-form-item label="可用">
                <el-switch
                　v-model="newVehicle.avl" active-color="#3292ff" inactive-color="#99a9bf" active-text="启用"
                inactive-text="禁用" :disabled="!editAvl"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入备注"
                          v-model="newVehicle.other" :disabled="!editAvl"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="edit" style="width:30%">确认</el-button>
                <el-button v-if="!editAvl" type="danger" @click="editAvl = true" style="width:30%">编辑</el-button>
                <el-button v-else type="info" @click="drawer2=false" style="width:30%">取消</el-button>
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
      arr: [],
      drawer: false,
      drawer2: false,
      bodyHeight:window.innerHeight-68,
      newVehicle: {
        num: '',
        type: '',
        load: 30,
        other: '',
        avl: true,
      },
      editAvl: false,
      search: '',
      searchOption: '请选择',
      drawerPer: (600.0 / window.innerWidth * 100).toString() + '%',
      fullscreenLoading:false
    }
  },

  created() {
    this.getList()
    this.$store.state.currentPage="2-1"
  },
  methods: {
    getList() {
      this.fullscreenLoading=true;
      this.$axios({
        method:"post",
        url:"/vehicle_manage/vehicles",
        data:{"userType":this.$store.state.userType}
      })
          .then(res => {
            this.arr = res.data.vehicles;
            this.fullscreenLoading=false;
          })
          .catch(res => {
            this.fullscreenLoading=false;
            this.$router.push('/')
          })
    },
    checkError() {
      if (this.newVehicle.num === '') {
        this.$notify({
          title: '错误',
          message: '请输入车牌号',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if (this.newVehicle.type === '') {
        this.$notify({
          title: '错误',
          message: '请输入车辆型号',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      }
      return true;
    },
    vehicleCopy(a) {
      return {
        num: a.num,
        type: a.type,
        load: a.load,
        other: a.other,
        avl: a.avl,
      }
    },
    addini() {
      this.newVehicle.num = '';
      this.newVehicle.type = '';
      this.newVehicle.load = 30;
      this.newVehicle.other = '';
      this.newVehicle.avl = true;
      this.drawer = true;
    },
    add() {
      if (this.checkError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/vehicle_manage/add",{userType:this.$store.state.userType,newVehicle:this.newVehicle})
            .then(res=>{
              if(res.data.success) {
                this.drawer = false;
                this.$notify({
                  title: '成功',
                  message: '车辆已被创建',
                  type: 'success',
                  position: 'bottom-left'
                });
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '车辆已存在',
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
      this.newVehicle = this.vehicleCopy(row);
      this.editAvl = false;
      this.drawer2 = true;
    },
    edit() {
      if (this.checkError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/vehicle_manage/edit", {userType: this.$store.state.userType, newVehicle: this.newVehicle})
            .then(res => {
              if (res.data.success) {
                this.drawer2 = false;
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
    deleteV(row) {
      this.$axios.post("/vehicle_manage/delete", {userType: this.$store.state.userType, num:row.num})
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '车辆已被删除',
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
    handleSearch(data, index) {
      switch (index) {
        default:
          return data.num.toLowerCase().includes(this.search.toLowerCase());
        case '型号':
          return data.type.toLowerCase().includes(this.search.toLowerCase());
        case '载荷':
          return data.load === parseInt(this.search);
        case '备注':
          return data.other.toLowerCase().includes(this.search.toLowerCase());
      }
    }
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