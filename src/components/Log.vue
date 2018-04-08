<template>
  <div class="msg">
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
          title: 'API',
          key: 'api'
        },
        {
          title: 'method',
          key: 'method'
        },
        {
          title: '参数',
          key: 'body'
        },
        {
          title: '时间',
          key: 'time'
        }
      ],
      totalNum: 0,
    }
  },
  created () {
    this.getTableData(1)
  },
  methods: {
    getTableData (e) {
      this.loading = true
      axios.get(apiUrl + '/log?page=' + e)
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
</style>
