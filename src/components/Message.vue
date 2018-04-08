<template>
  <div class="msg">
    <Table size="default" :loading="loading" :columns="columns" :data="tableData"></Table>
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
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.loading = true
      axios.get(apiUrl + '/messages')
        .then(response => {
          console.log(response)
          this.loading = false
          if(response.status === 200){
            this.tableData = response.data.Data
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .msg{
    padding: 15px 10px;
  }
</style>
