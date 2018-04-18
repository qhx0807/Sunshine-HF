<template>
  <div class="wrap">
    <Spin fix v-if="loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div style="color:#ccc">Loading</div>
    </Spin>
    <div style="width:600px">
      <h2 style="padding-bottom:12px">自动回复内容</h2>
      <Alert show-icon @click.native="onClickHandler">
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">
          {{tableData.content}}
        </template>
      </Alert>
    </div>
    <Modal v-model="addModal" width="400">
      <p slot="header" style="text-align:center">
        <span>自动回复</span>
      </p>
      <div style="text-align:center">
        <Input v-model="content" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="modal_loading" @click="saveContent">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AutoReply',
  data () {
    return {
      tableData: {},
      loading: false,
      addModal: false,
      modal_loading: false,
      content: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods:{
    getTableData () {
      this.loading = true
      axios.get(apiUrl + '/autoreply')
        .then(response => {
          this.loading = false
          console.log(response)
          if(response.status === 200){
            this.tableData = response.data.Data[0]
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    onClickHandler(){
      this.content = this.tableData.content
      this.addModal = true
    },
    saveContent(){
      this.modal_loading = true
      var doc = {_id: this.tableData._id, content: this.content}
      axios.post(apiUrl + '/autoreply', doc)
        .then(response => {
          this.modal_loading = false
          console.log(response)
          if(response.data.OK === 'ok'){
            this.$Message.info("保存成功！")
            this.getTableData()
            this.addModal = false
          }else{
            this.$Message.warning(response.data.Data)
          }
        })
        .catch(error => {
          console.log(error)
          this.modal_loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.wrap{
  padding: 20px;
  position: relative;
}
.demo-spin-icon-load{
  color: #ccc;
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.box{
  margin: 20px 0px;
  padding: 12px;
  border: 1px solid #eee;
  width: 500px;
}
</style>

