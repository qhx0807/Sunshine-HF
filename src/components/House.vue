<template>
  <div class="wrap">
    <Spin fix v-if="loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div style="color:#ccc">Loading</div>
    </Spin>
    <Row>
      <Col span="3" v-for="item in tableData" :key="item._id" style="padding:10px 10px 0 0">
        <Card style="cursor:pointer" @click.native="onClickDel(item._id)">
          <p class="item-name">{{item.name}}</p>
          <div class="del"><Icon type="android-close"></Icon></div>
        </Card>
      </Col>
      <Col span="3" style="padding:10px 10px 0 0">
        <Card style="cursor:pointer" @click.native="onClickAddHandler">
          <p class="item-name"><Icon type="plus"></Icon></p>
        </Card>
      </Col>
    </Row>
    <Modal v-model="addModal" width="360">
      <p slot="header" style="text-align:center">
        <span>添加item</span>
      </p>
      <div style="text-align:center">
        <Form>
          <FormItem>
            <Input type="text" v-model="itemName" placeholder="请输入名称"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="modal_loading" @click="addItem">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'House',
  data () {
    return {
      tableData: [],
      loading: false,
      addModal: false,
      modal_loading: false,
      itemName: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.loading = true
      axios.get(apiUrl + '/house')
        .then(response => {
          this.loading = false
          if(response.status === 200){
            this.tableData = response.data.Data
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    onClickAddHandler () {
      this.addModal = true
    },
    addItem () {
      if (!this.itemName) {
        this.$Message.info('请输入名称！')
        return false
      }
      this.modal_loading = true
      axios.post(apiUrl + '/house', {name: this.itemName})
        .then(response => {
          this.modal_loading = false
          if(response.data.OK === 'ok'){
            this.getTableData()
            this.addModal = false
            this.$Message.success('已添加！')
          }
        })
        .catch(error => {
          console.log(error)
          this.modal_loading = false
        })
    },
    onClickDel (e) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除此项目？清确认操作~</p>',
        onOk: () => {
          axios.delete(apiUrl + '/house?id=' + e)
            .then(response => {
              if(response.data.OK === 'ok'){
                this.getTableData()
                this.$Message.success('已删除！')
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      })

    }
  }
}
</script>

<style lang="less" scoped>
.wrap{
  padding: 12px;
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
.item-name{
  text-align: center;
}
.del{
  position: absolute;
  top: 5px;
  right: 10px;
  color: #ddd;
}
</style>
