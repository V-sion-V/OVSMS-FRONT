<template>
  <div class="DriverManage" style="height:100%">
    <el-row :gutter="20" style="margin:14px 0">
      <el-col :span="3" :offset="1" style="height:40px">
        <div  style="vertical-align:middle">
          <h3  style="margin:7px;">
            司机管理
          </h3>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" v-on:click="addini" v-loading.fullscreen.lock="fullscreenLoading">新增司机</el-button>
      </el-col>
      <el-col :span="2">
        <el-select v-model="searchOption" :placeholder="searchOption">
          <el-option label="编号" value="编号"></el-option>
          <el-option label="姓名" value="姓名"></el-option>
          <el-option label="年龄" value="年龄"></el-option>
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
          <el-table :data="arr.filter(data => !search || handleSearch(data,searchOption))"
                      stripe
                      border
                      ref="filterTable"
                      style="width: 90%; margin: auto"
            >
              <el-table-column align="center" prop="num" label="编号" min-width="18">

              </el-table-column>
              <el-table-column align="center" prop="name" label="姓名" min-width="18">

              </el-table-column>
              <el-table-column align="center" prop="age" label="年龄" min-width="18" sortable>

              </el-table-column>
              <el-table-column align="center" label="状态" min-width="22"
                               :filters="[{text:'在职',value:true},{text:'停职',value:false}]" :filter-method="filterAvl">
                <el-switch v-model="scope.row.avl" slot-scope="scope" active-color="#3292ff" inactive-color="#99a9bf" disabled
                           active-text="在职" inactive-text="停职"></el-switch>
              </el-table-column>
              <el-table-column align="center" label="兼职" min-width="22"
                               :filters="[{text:'兼职',value:true},{text:'全职',value:false}]" :filter-method="filterPart">
                <el-switch v-model="scope.row.part" slot-scope="scope" active-color="#CA6FD2" inactive-color="#89ca78" disabled
                           active-text="兼职" inactive-text="全职"></el-switch>
              </el-table-column>
              <el-table-column align="center" label="查看" min-width="12">
                <el-button slot-scope="scope" @click="editini(scope.row)" size='mini'>查看</el-button>
              </el-table-column>
              <el-table-column align="center" label="删除" min-width="12">
                <el-popconfirm width="160"
                               title="你确定要删除司机吗？"
                               confirm-button-type="danger"
                               cancel-button-type="info"
                               icon="el-icon-info"
                               slot-scope="scope"
                               @confirm="deleteV(scope.row)">
                  <el-tooltip slot="reference" class="item" effect="dark" content="删除该司机" placement="top">
                    <el-button type="danger" size="mini">删除</el-button>
                  </el-tooltip>
                </el-popconfirm>
              </el-table-column>
            </el-table>
        </div>
      </el-main>
    </el-container>
    <el-drawer
        title="新增司机"
        :visible.sync="drawer"
        direction="rtl"
        :size="drawerPer">
      <el-row :gutter="20" class="row-bg">
        <el-col :span="16" :offset="3">
          <div>
            <el-form ref="newDriver" :model="newDriver" label-width="20%">
              <el-form-item label="编号">
                <el-input placeholder="请输入编号" v-model="newDriver.num"/>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="请输入司机姓名" v-model="newDriver.name"/>
              </el-form-item>
              <el-form-item label="年龄">
                <el-slider v-model="newDriver.age" :min="1" :max="100" show-input/>
              </el-form-item>
              <el-form-item label="可用">
                <el-switch v-model="newDriver.avl" active-color="#3292ff" inactive-color="#99a9bf" active-text="在职"
                           inactive-text="停职"/>
              </el-form-item>
              <el-form-item label="兼职">
                <el-switch v-model="newDriver.part" active-color="#CA6FD2" inactive-color="#89ca78" active-text="兼职"
                           inactive-text="全职"/>
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
            <el-form ref="newDriver" :model="newDriver" label-width="20%">
              <el-form-item label="编号">
                <el-input placeholder="请输入编号" v-model="newDriver.num" :disabled="!editavl"/>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="请输入司机姓名" v-model="newDriver.name" :disabled="!editavl"/>
              </el-form-item>
              <el-form-item label="年龄">
                <el-slider v-model="newDriver.age" :min="1" :max="100" show-input :disabled="!editavl"/>
              </el-form-item>
              <el-form-item label="可用">
                <el-switch v-model="newDriver.avl" active-color="#3292ff" inactive-color="#99a9bf" active-text="在职"
                           inactive-text="停职"   :disabled="!editavl"/>
              </el-form-item>
              <el-form-item label="兼职">
                <el-switch v-model="newDriver.part" active-color="#CA6FD2" inactive-color="#89ca78" active-text="兼职"
                            inactive-text="全职"  :disabled="!editavl"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="edit" style="width:30%">确认</el-button>
                <el-button v-if="!editavl" type="danger" @click="editavl = true" style="width:30%">编辑</el-button>
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
      count: 0,
      drawer: false,
      drawer2: false,
      newDriver: {
        num: '',
        name: '',
        age: 30,
        part: true,
        avl: true,
      },
      editavl: false,
      bodyHeight:window.innerHeight-68,
      search: '',
      searchOption: '请选择',
      drawerPer: (600.0 / window.innerWidth * 100).toString() + '%',
      fullscreenLoading:false
    }
  },
  methods: {
    checkError() {
      if (this.newDriver.num === '') {
        this.$notify({
          title: '错误',
          message: '请输入编号',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      } else if (this.newDriver.name === '') {
        this.$notify({
          title: '错误',
          message: '请输入姓名',
          position: 'bottom-left',
          type: "error"
        });
        return false;
      }
      return true;
    },
    DriverCopy(a) {
      return {
        num: a.num,
        name: a.name,
        age: a.age,
        part: a.part,
        avl: a.avl,
      }
    },
    addini() {
      this.newDriver.num = '';
      this.newDriver.name = '';
      this.newDriver.age = 30;
      this.newDriver.part = true;
      this.newDriver.avl = true;
      this.drawer = true;
    },
    add() {
      if (this.checkError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/driver_manage/add",{userType:this.$store.state.userType,newDriver:this.newDriver})
            .then(res=>{
              if(res.data.success) {
                this.drawer = false;
                this.$notify({
                  title: '成功',
                  message: '司机已被创建',
                  type: 'success',
                  position: 'bottom-left'
                });
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '司机已存在',
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
      this.newDriver = this.DriverCopy(row);
      this.editavl = false;
      this.drawer2 = true;
    },
    edit() {
      if (this.checkError()) {
        this.fullscreenLoading=true;
        this.$axios.post("/driver_manage/edit", {userType: this.$store.state.userType, newDriver: this.newDriver})
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
      this.$axios.post("/driver_manage/delete", {userType: this.$store.state.userType, num:row.num})
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '司机已被删除',
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
    filterPart(value, row) {
      return row.part === value;
    },
    handleSearch(data, index) {
      switch (index) {
        default:
          return data.num.toLowerCase().includes(this.search.toLowerCase());
        case '姓名':
          return data.name.toLowerCase().includes(this.search.toLowerCase());
        case '年龄':
          return data.age === parseInt(this.search);
        case '备注':
          return data.other.toLowerCase().includes(this.search.toLowerCase());
      }
    },
    getList() {
      this.fullscreenLoading=true;
      this.$axios({
        method:"post",
        url:"/driver_manage/drivers",
        data:{"userType":this.$store.state.userType}
      })
          .then(res => {
            this.arr = res.data.drivers;
            this.fullscreenLoading=false;
          })
          .catch(res => {
            this.fullscreenLoading=false;
            this.$router.push('/')
          })
    },
  },
  created() {
    this.$store.state.currentPage = "3"
    this.getList()
  }
}
</script>

<style>
.el-row {
  margin-bottom: 0;
}

.el-col {
  border-radius: 0;
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
  border-radius: 0;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #ffffff;
}

.VManage {
  margin: 0
}
</style>