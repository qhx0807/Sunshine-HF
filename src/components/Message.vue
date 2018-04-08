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
      columns: [
        {
          title: '类型',
          key: 'Type'
        },
        {
          title: '姓名',
          key: 'Name'
        },
        {
          title: '电话',
          key: 'Tel'
        },
        {
          title: '内容',
          key: 'Content'
        },
        {
          title: '回复',
          key: 'Reply'
        },
        {
          title: '小区',
          key: 'HouseName'
        },
        {
          title: '商场名',
          key: 'MarketName'
        },
        {
          title: '合作项目',
          key: 'ProjectName'
        },
        {
          title: '操作',
          key: '_id'
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
      totalNum: 0
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
          console.log(response)
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
</style>
