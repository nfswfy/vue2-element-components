<template>
  <div>
    <h1>Table</h1>
    <cb-table ref="table" showSelection :columns="columns" :data="loadData" hideOnSinglePage>
    <template >
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template slot="custom_header">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
      </template>
      <template slot="action_content" >
        <el-button>111</el-button>
      </template>
      <!-- <template slot="action_content" slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template> -->
    </cb-table>
  </div>
</template>
<script>
const tableList = [
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    custom_header: '自定义头',
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
    custom_header: '自定义头',
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
    custom_header: '自定义头',
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    custom_header: '自定义头',
  }
]
export default {
  name: 'Table',
  components: {
    'cb-table': () => import('@/components/Table')
  },
  data () {
    return {
        search: '',
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam, { clientId: this.clientId })
        console.log('loadData request parameters:', requestParameters)
        return new Promise((resolve) => {
          const data = {
            records: tableList,
            total: 100,
            currentPage: 1,
            pageSize: 10
          }
          resolve(data)
        })
      }
    }
  },
  computed: {
    columns () {
      return [
        {
          label: '日期',
          prop: 'date',
          key: 'date',
          width: 200
        },
        {
          label: '姓名',
          prop: 'name',
          key: 'name',
          width: 200
        },
        {
          label: '地址',
          prop: 'address',
          key: 'address'
        },
        // {
        //     label:'多级表头',
        //     children:[
        //         {
        //             label:'多级表头1',
        //             prop:'children1',
        //             children:[
        //                 {
        //                     label:'多级表头1-1',
        //                     prop:'children1-1',
        //                 },
        //                 {
        //                     label:'多级表头1-2',
        //                     prop:'children1-2',
        //                 }
        //             ]
        //         },
        //         {
        //             label:'多级表头2',
        //             prop:'children2',
        //             children:[
        //                 {
        //                     label:'多级表头2-1',
        //                     prop:'children2-1',
        //                 },
        //                 {
        //                     label:'多级表头2-2',
        //                     prop:'children2-2',
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
          label: '自定义头',
          prop: 'custom_header',
          slotHeader: 'custom_header',
        },
        {
          label: '操作',
          prop: 'action_content',
          fixed: 'right',
          slotScope: 'action_content',
        },
      ]
    }
  },
}
</script>
