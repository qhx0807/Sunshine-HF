<template>
  <div class="msg">
    <Row style="padding:0px 0 12px 0" :gutter="16">
        <Col span="4">
          <Select placeholder="筛选类型">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input v-model="keyWord" placeholder="筛选关键字"></Input>
        </Col>
        <Col span="16" style="text-align:right">
          <!-- <Button type="primary" icon="ios-search">查询</Button> -->
          <Button type="primary" icon="ios-download-outline" @click="exportData" style="margin-left:12px">导出数据</Button>
        </Col>
    </Row>
    <hr class="line">
    <Table size="small" ref="table" :loading="loading" :columns="columns" :data="searchData"></Table>
    <div style="float: right;padding: 12px 0 0 0 ">
      <Page :total="totalNum" @on-change="onChangePage" show-total></Page>
    </div>
    <Modal v-model="repModal" width="800">
        <p slot="header" style="text-align:center">
          <span>回复</span>
        </p>
        <div>
          <Row>
            <Col span="2">个人信息：</Col>
            <Col span="22">
              <span class="msg-content">{{curData.Name}}</span>&nbsp;
              <span class="msg-content">{{curData.Tel}}</span>&nbsp;
              <span class="msg-content">{{curData.Type}}</span>&nbsp;
              <span class="msg-content">{{curData.HouseName }}</span>&nbsp;
              <span class="msg-content">{{curData.DoorNumber }}</span>&nbsp;
              <span class="msg-content">{{curData.ProjectName }}</span>&nbsp;
              <span class="msg-content">{{curData.ProjectContent }}</span>&nbsp;&nbsp;
              <span class="msg-content">{{curData.Date }}</span>
            </Col>
          </Row>
           <hr class="divider-line">
          <Row>
            <Col span="2">留言内容：</Col>
            <Col span="22">
              <p class="msg-content">{{curData.Content}}</p>
            </Col>
          </Row>
           <hr class="divider-line">
           <Row>
            <Col span="2">最近沟通：</Col>
            <Col span="22">
              <ul class="rep-list">
                <li v-for="(item, index) in curData.Reply" :key="index" :class="{'offical' : item.type=='0'}">
                  <span v-if="item.type=='1'">{{curData.Name}}：</span>
                  <span v-if="item.type=='0'">阳光宏帆：</span>
                  <span>{{item.content}}</span>
                  <span class="imgs-icon" v-if="item.imgs" v-for="n in item.imgs" :key="n">
                    <Icon type="image" @click.native="seeImage(n)"></Icon>
                  </span>
                  <small>&nbsp;&nbsp;&nbsp;--{{item.time}}</small>
                </li>
              </ul>
            </Col>
          </Row>
          <hr class="divider-line">
          <Row>
            <Col span="2">回复内容：</Col>
            <Col span="22">
              <Input type="textarea" v-model="replyWord" :autosize="{minRows: 3,maxRows: 5}" placeholder="输入内容..."></Input>
            </Col>
          </Row>
          <hr class="divider-line">
          <Row>
            <Col span="2">上传图片：</Col>
            <Col span="22">
              <ul class="upload-imgs">
                <li class="imgs" v-for="(item, index) in replyImgs" :key="item" @mouseover="onMouseOver(index)" @mouseout="onMouseOut(index)">
                  <img :src="item" alt="">
                  <div class="mask" v-show="index === actLi">
                    <Icon type="ios-trash-outline" @click.native="onRemoveImg(index)"></Icon>
                  </div>
                </li>
                <li class="upload" @click="onClickUpload"><Icon type="ios-plus-empty"></Icon></li>
              </ul>
              <input type="file" @change="onUploadHandler" id="uploader">
            </Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="primary" long :loading="modal_loading" @click="replyUser">回复TA</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import exportExcel from '../utlis'
export default {
  name: 'Message',
  data () {
    return {
      tableData: [],
      loading: false,
      repModal: false,
      columns: [
        {
          title: '状态',
          key: 'Status',
          width: 100,
          render: (h, params) => {
            const row = params.row
            const color = row.Status === '待处理' ? 'yellow' : 'green'
            return h('Tag', {
              props: {
                type: 'border',
                color: color
              }
            }, params.row.Status);
          }
        },
        {
          title: '类型',
          key: 'Type',
          width: 100
        },
        {
          title: '项目名称',
          key: 'HouseName',
          width: 100,
          render: (h, params) => {
            return h('div', { }, params.row.HouseName || params.row.MarketName || params.row.ProjectName);
          }
        },
        {
          title: '姓名/电话',
          key: 'Name',
          width: 120,
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: `<p>${params.row.Name}</p><p>${params.row.Tel}</p>`
              }
            })
          }
        },
        {
          title: '内容',
          key: 'Content',
          minWidth: 400,
        },
        {
          width: 140,
          title: '图片',
          key: 'Picture',
          render: (h, params) => {
            return h('div',
              params.row.Picture.map(item => {
                return h('img',{
                  attrs: {
                    src: item.path
                  },
                  style: {
                    width: '30px',
                    height: '30px'
                  },
                  on: {
                    click: () => {
                      // this.seeImage(item.path)
                    }
                  },
                  directives: [
                    {
                      name: 'imgview'
                    }
                  ]
                })
              })
            )
          }
        },
        {
          title: '回复',
          key: 'Reply',
          minWidth: 400,
          render: (h, params) => {
            return h('div',
            {
              style: {
                padding: '10px'
              }
            },
            params.row.Reply.map(item => {
              return h('p', {
                domProps: {
                  innerHTML: item.content
                }
              })
            }))
          }
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
          width: 200,
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
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
              }, '删除'),
              params.row.Status === '待处理' && h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.changeStatus(params)
                    }
                  }
              }, '已处理')
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
      replyImgs: [],
      actLi: -1,
      keyWord: '',
      page: 1
    }
  },
  created () {
    this.getTableData(1)
  },
  computed: {
    searchData(){
      var search =  this.keyWord
      if(search){
        return this.tableData.filter(function(item){
          return Object.keys(item).some(function(key){
            return String(item[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }else{
        return this.tableData
      }
    }
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
      var d = JSON.parse(JSON.stringify(this.tableData))
      d.forEach(item => {
        item.Reply = JSON.stringify(item.Reply)
        item.Picture = JSON.stringify(item.Picture)
        delete item._id
        delete item.Openid
        delete item.__v
      })
      exportExcel(d, '投诉建议数据导出')
    },
    onChangePage (e) {
      this.page = e;
      this.getTableData(e)
    },
    replyMsg (e) {
      this.curData = e.row
      this.replyWord = ''
      this.replyImgs = []
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
        imgs: this.replyImgs,
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
                this.getTableData(this.page)
                this.$Message.success('已删除！')
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    changeStatus(e) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>将此条记录标记为已处理？</p>',
        onOk: () => {
          axios.post(apiUrl + '/changeStatus', {id: e.row._id})
            .then(response => {
              if(response.data.OK === 'ok'){
                this.getTableData(this.page)
                this.$Message.success('操作成功！')
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    onClickUpload () {
      document.getElementById("uploader").click()
    },
    onUploadHandler () {
      var Input = document.querySelector("#uploader")
      var url = apiUrl
      var files = Input.files
      var fd = new FormData()
      fd.append('file', files[0])
      var config = {
        headers:{'Content-Type':'multipart/form-data'}
      }
      axios.post(url + '/upload', fd, config)
        .then(response => {
          if(response.data.Data){
            this.replyImgs.push(url + '/' + response.data.Data.filename)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    onMouseOver (index) {
      this.actLi = index
    },
    onMouseOut () {
      this.actLi = -1
    },
    onRemoveImg (index) {
      this.replyImgs.splice(index, 1)
    },
    seeImage (path) {
      // this.$Modal.info({
      //   width: 680,
      //   title: '查看图片',
      //   content: '<img style="max-width:600px" src='+ path +' />',
      // })
      window.open(path)
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
  .upload{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i{
      font-size: 60px;
      color: #ddd;
    }
    &:hover{
      border: 1px solid #5cadff;
      i{
        color: #5cadff;
      }
    }
  }
  .upload-imgs{
    list-style: none;
    margin: 0;
    padding: 0;
    li{
      float: left;
      height: 80px;
      width: 80px;
      border: 1px solid #ddd;
      overflow: hidden;
      margin-right: 12px;
      img{
        height: 100%;
        width: 100%;
      }
    }
  }
  #uploader{
    width: 0px;
    visibility: hidden;
  }
  .imgs{
    position: relative;
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .5);
      text-align: center;
      i{
        font-size: 35px;
        color: #fff;
        margin-top: 20px;
        cursor: pointer;
      }
    }
  }
  .imgs-icon{
    font-size: 18px;
    padding-left: 5px;
    color: #80848f;
    cursor: pointer;
  }
</style>
