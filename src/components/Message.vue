<template>
  <div class="msg">
    <Row style="padding:0px 0 12px 0" :gutter="16">
        <Col span="4">
          <Select placeholder="筛选类型">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input placeholder="筛选关键字"></Input>
        </Col>
        <Col span="16" style="text-align:right">
          <!-- <Button type="primary" icon="ios-search">查询</Button> -->
          <Button type="primary" icon="ios-download-outline" @click="exportData" style="margin-left:12px">导出数据</Button>
        </Col>
    </Row>
    <hr class="line">
    <Table size="default" ref="table" :loading="loading" :columns="columns" :data="tableData"></Table>
    <div style="float: right;padding: 12px 0 0 0 ">
      <Page :total="totalNum" @on-change="onChangePage" show-total></Page>
    </div>
    <Modal v-model="repModal" width="600">
        <p slot="header" style="text-align:center">
          <span>回复</span>
        </p>
        <div>
          <Row>
            <Col span="3">个人信息：</Col>
            <Col span="21">
              <span class="msg-content">{{curData.Name}}</span>
              <span class="msg-content">{{curData.Tel}}</span>
              <span class="msg-content">{{curData.Type}}</span>
              <span class="msg-content">{{curData.HouseName }}</span>
              <span class="msg-content">{{curData.ProjectName }}</span>
              <span class="msg-content">{{curData.ProjectContent }}</span>&nbsp;&nbsp;
              <span class="msg-content">{{curData.Date }}</span>
            </Col>
          </Row>
           <hr class="divider-line">
          <Row>
            <Col span="3">留言内容：</Col>
            <Col span="21">
              <p class="msg-content">{{curData.Content}}</p>
            </Col>
          </Row>
           <hr class="divider-line">
           <Row>
            <Col span="3">最近沟通：</Col>
            <Col span="21">
              <ul class="rep-list">
                <li v-for="(item, index) in curData.Reply" :key="index" :class="{'offical' : item.type=='0'}">
                  <span v-if="item.type=='1'">{{curData.Name}}：</span>
                  <span v-if="item.type=='0'">阳光宏帆：</span>
                  <span >{{item.content}}</span>
                  <small>&nbsp;&nbsp;&nbsp;--{{item.time}}</small>
                </li>
              </ul>
            </Col>
          </Row>
           <hr class="divider-line">
           <Row>
            <Col span="3">回复内容：</Col>
            <Col span="21">
              <Input type="textarea" v-model="replyWord" :autosize="{minRows: 3,maxRows: 5}" placeholder="输入内容..."></Input>
            </Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="primary"  long :loading="modal_loading" @click="replyUser">回复TA</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Message',
  data () {
    return {
      tableData: [],
      loading: false,
      repModal: false,
      columns: [
        {
          title: '类型',
          key: 'Type',
          width: 120
        },
        {
          title: '姓名',
          key: 'Name',
          width: 100
        },
        {
          title: '电话',
          key: 'Tel',
          width: 120
        },
        {
          title: '内容',
          key: 'Content'
        },
        {
          title: '图片',
          key: 'Picture',
          render: (h, params) => {
            return h('div',
              params.row.Picture.map(item => {
                return h('img',{
                  attrs: {
                    src: apiUrl+'/'+item.filename
                  }
                })
              })
            )
          }
        },
        {
          title: '回复',
          key: 'Reply'
        },
        // {
        //   title: '小区',
        //   key: 'HouseName'
        // },
        // {
        //   title: '商场名',
        //   key: 'MarketName'
        // },
        // {
        //   title: '合作项目',
        //   key: 'ProjectName'
        // },
        {
          title: '操作',
          key: '_id',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.replyMsg(params)
                  }
                }
              }, '回复'),
              h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
              }, '删除')
            ]);
          }
        },
      ],
      cityList: [
        {
          value: '业主',
          label: '业主'
        },
        {
          value: '商业消费者',
          label: '商业消费者'
        },
        {
          value: '合作供方',
          label: '合作供方'
        }
      ],
      totalNum: 0,
      modal_loading: false,
      curData: {},
      replyWord: '',
    }
  },
  created () {
    this.getTableData(1)
  },
  methods: {
    getTableData (e) {
      this.loading = true
      axios.get(apiUrl + '/messages?page=' + e)
        .then(response => {
          this.loading = false
          if(response.status === 200){
            this.tableData = response.data.Data
            this.totalNum = response.data.Total
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: '建议留言表',
        original: false
      })
    },
    onChangePage (e) {
      this.getTableData(e)
    },
    replyMsg (e) {
      this.curData = e.row
      this.replyWord = ''
      this.repModal = true
    },
    replyUser () {
      if (!this.replyWord) {
        this.$Message.info('请输入内容！')
        return false
      }
      this.modal_loading = true
      let obj = {
        type: '0',
        content: this.replyWord,
        time: new Date().toLocaleString()
      }
      console.log(obj)
      axios.post(apiUrl + '/reply', {id: this.curData._id, doc: obj})
        .then(response => {
          this.modal_loading = false
          if(response.data.OK === 'ok'){
             this.getTableData(1)
            this.$Message.success('已提交回复！')
            this.repModal = false
          }
        })
        .catch(error => {
          this.modal_loading = false
          console.log(error)
        })
    },
    remove (e) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除此条留言？清确认操作~~~</p>',
        onOk: () => {
          axios.delete(apiUrl + '/messages?id=' + e.row._id)
            .then(response => {
              if(response.data.OK === 'ok'){
                this.getTableData(1)
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
  .msg{
    padding: 15px 10px;
  }
  .line{
    border-top: 1px solid #f8f8f8;
    margin-bottom: 12px;
  }
  .msg-content{
    color: #80848f;
  }
  .divider-line{
    border-top: 1px solid #f8f8f8;
    margin: 6px 0;
  }
  .rep-list{
    padding: 0;
    margin: 0;
    list-style: none;
    color: #ff9900;
  }
  .offical{
    color: #19be6b;
  }
</style>
