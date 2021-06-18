<template>
<div>
  <el-col :span="4">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#ffffff"
      text-color="#000"
      active-text-color="#24ADF3">
      <el-menu-item v-for="item in ToList" index="item.id">
        <i class="el-icon-menu"></i>
        <el-button plain @click="changeToid(item.Toid)">{{ item.Toid }}</el-button>
        <el-button type="danger" plain @click="end_com(item.Toid)" v-if="usr_type === false">结束投诉</el-button>
      </el-menu-item>
    </el-menu>
  </el-col>
  <el-col :span="20" class="chat">
    <div class="messageBox">
      <div class = "messageBubble" v-for="(message) in messageList" :key="message.id">
        <div class="messageOfEnding" v-if ="message.isEnd === true">
          {{message.content}}
          <br>
        </div>
        <div class="messageOfSelf" v-else-if ="message.type === usr_type">
          {{message.isEnding}}
          {{message.content}}
          <br>
        </div>
        <div class="messageOfOther" v-else-if ="message.type !== usr_type">
          {{message.isEnding}}
          {{message.content}}
          <br>
        </div>
        <br>
      </div>
    </div>
    <div class="sendBox">
      <el-input 
      type="textarea" 
      :autosize="{ minRows: 3, maxRows: 3}" 
      maxlength="50" placeholder="请输入内容" 
      id="messageSend" class = "messageSend" 
      v-model="text" 
      @keydown.enter="send(text)" 
      clearable show-word-limit></el-input>
      <button class="sendButton" @click="send(text)">发送</button>
    </div>
  </el-col>
</div>
  
</template>

<style scoped>
  .messageBox{
    height: 660px;
    overflow-y:auto;
  }
  .messageBubble{
    height: 85px;
  }
  .messageOfSelf{
    float:right;
    width: 200px;
    height: 80px;
    background-color: rgb(152, 225, 101);
    border-bottom-color: rgb(152, 225, 101);
    /*为了给after伪元素自动继承*/
    color: #000;
    font-size: 12px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    right:10px;
    word-break: break-all;
  }
  .messageOfOther{
    float:left;
    width: 200px;
    height: 80px;
    background-color: skyblue;
    border-bottom-color: skyblue;
    /*为了给after伪元素自动继承*/
    color: #000;
    font-size: 12px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    left:10px;
    word-break: break-all;

  }
  .messageOfOther::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -5px;
    width: 10px;
    height: 10px;
    margin-top: -10px;
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
  }
  .messageOfSelf::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -5px;
    width: 10px;
    height: 10px;
    margin-top: -10px;
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
  }
  .sendBox{
    width: 100%;
    height: 120px;
    max-height: 120px;
    float: bottom;
    text-align: center;
    position: relative;
    bottom: 5px;
  }
  .messageSend{
    width: 100%;
  }

  .messageOfEnding{
    height: 25px;
    background-color: red;
    border-bottom-color: red;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    right:10px;
    word-break: break-all;
  }
  .sendButton {
    display: inline-block;
    border-radius: 10px;
    background-color: rgb(133, 211, 241);
    border: none;
    color: #000000;
    text-align: center;
    font-size: 20px;
    padding: 5px;
    width: 90px;
    transition: all 0.5s;
    cursor: pointer;
    margin-left: 5px;
    margin-bottom: 10px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    position: absolute;
    bottom: -10%;
    right: 8%;
  }
  .sendButton span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }
  .sendButton span:after {
    content: '»';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }
  .sendButton:hover {
    background-color: rgb(120, 190, 218);
  }
  .sendButton:hover span {
    padding-right: 25px;
  }
  .sendButton:hover span:after {
    opacity: 1;
    right: 0;
  }

</style>

<script>
  export default {
    data() {
      return {
        messageList : [],
        Fromid:this.$store.state.username,
        Toid:'',
        ToList:[],
        usr_type :false,
        text:'',
        timer:null
      }
    },
    created(){
      if(this.Fromid === undefined||this.Fromid=== null||this.Fromid===''){
        this.$router.push("/");
      }
      else {
        this.Fromid = this.$store.state.username;
        //this.Fromid = this.$store.state.username;
        if(this.$store.state.userType === "客户"){
          this.usr_type = false;
        }else {
          this.usr_type = true;
        }
        this.load_chatter();
        //this.Toid = 'snum1';
        this.timer = setInterval(() => {
          this.getmessageList();
          //console.log(this.Toid);
          //alert(this.Toid);
        }, 1000*10)
      }

    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      load_chatter(){
        if(this.Fromid === undefined||this.Fromid=== null||this.Fromid===''){
          this.$router.push("/");
        }
        //this.Fromid = this.$store.state.username;
        console.log(this.Fromid);
        this.$axios.post("/Chat/load_chatter", {Fromid:this.Fromid,isService:this.usr_type})
            .then(res => {
              this.ToList=[];
              if(res.data.ToList.length>=1) {
                for (let i = 0; i < res.data.ToList.length; i++) {
                  let temp = res.data.ToList[i];
                  this.ToList.push({
                    id:i,
                    Toid:temp.Toid
                  })
                }
                this.Toid = this.ToList[0].Toid;
                this.getmessageList();
              }
              else {
                alert("no message now");
                this.$router.push("/SelfCenter");
              }
              //alert(this.Toid);
            })
            .catch(function () {
              alert("404 not found");
            });
      },
      send(text){
        if(this.Fromid === undefined||this.Fromid=== null||this.Fromid===''){
          this.$router.push("/");
        }
        if(text===''){
          this.$notify({
            title: '错误',
            message: '空信息',
            position: 'bottom-left',
            type: "error"
          });
        }
        else{
          console.log(this.text);
          this.$axios.post("/Chat/send", {Fromid:this.Fromid,content:this.text,type:this.usr_type,Toid:this.Toid})
              .then(res => {
                console.log(res);
                if (!res.data.success) {
                  this.$notify({
                    title: '错误',
                    message: '发送失败',
                    position: 'bottom-left',
                    type: "error"
                  });
                } else {
                  this.getmessageList();
                  this.$notify({
                    title: '成功',
                    message: '发送成功',
                    position: 'bottom-left',
                    type: "success"
                  });
                }
              })
              .catch(function () {
                alert("404 not found");
              });
          this.text='';
        }

      },
      getmessageList(){
        if(this.Fromid === undefined||this.Fromid=== null||this.Fromid===''){
          this.$router.push("/");
        }
        if(!this.usr_type){
          this.$axios.post("/Chat/getmessageList", {cid:this.Fromid,sid:this.Toid})
              .then(res => {
                this.messageList=[];
                if(res.data.messageList.length === 0){
                  alert("no message now");
                }
                else{
                  for(let i = 0; i<res.data.messageList.length;i++) {
                    let temp = res.data.messageList[i];
                    this.messageList.push({
                      id: i,
                      content: temp.content,
                      type: temp.type,
                      time: temp.time,
                      isEnd: temp.isEnd
                    })
                  }
                }

              })
              .catch(function () {
                alert("404 not found");
              });
        }
        else{
          this.$axios.post("/Chat/getmessageList", {cid:this.Toid,sid:this.Fromid})
              .then(res => {
                this.messageList=[];
                for(let i = 0; i<res.data.messageList.length;i++) {
                  let temp = res.data.messageList[i];
                  this.messageList.push({
                    id: i,
                    content: temp.content,
                    type: temp.type,
                    time: temp.time,
                  })
                }
              })
              .catch(function () {
                alert("404 not found");
              });
        }
      },
      changeToid(Toid){
        //alert(Toid);
        this.Toid = Toid;
        this.getmessageList();
      },
      end_com(Toid){
        this.$axios.post("/Chat/end_com", {cid:this.Fromid,sid:Toid})
            .then(res => {
              if (!res.data.success) {
                this.$notify({
                  title: '错误',
                  message: '结束失败',
                  position: 'bottom-left',
                  type: "error"
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '结束成功',
                  position: 'bottom-left',
                  type: "success"
                });
              }
              this.getmessageList();
            }).catch(function () {
          alert("404 not found");
        });
        this.$router.push("/SelfCenter");
      }
    },

  };
</script>

