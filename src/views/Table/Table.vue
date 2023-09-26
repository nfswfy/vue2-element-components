<template>
  <div>
    <h1>Table</h1>
    <!-- showSelection -->
    <!-- showExpand -->
    <!-- isTree -->
    <!-- show-summary -->
    <!-- lazy -->
    <cb-table ref="table"   row-key="id"  showIndex   showSelection highlight-current-row
      :columns="columns" :data="loadData" hideOnSinglePage @lazyLoad="lazyLoad">
      <!-- <template>
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" /> -->
      <!-- </template> -->
      <template slot="customHeader" slot-scope="scope">
        <el-input v-model="search" size="mini" :placeholder="scope.column.label" />
      </template>
      <template slot="expand">
        <el-icon class="el-icon-edit" size="mini" />
      </template>
      <!-- <template slot="actionContent">
        <el-button>111</el-button>
      </template> -->
      <template slot="actionContent" slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </cb-table>
  </div>
</template>
<script>
const tableList = [
  {
    id: '1',
    date: '2016-05-02',
    name: '李四',
    address: '上海市普陀区金沙江路 1518 弄',
    customHeader: '自定义头',
    formatterColumn: '红',
    assets: 7,
    age: 12,
    tags: '家',
    actionContent: '操作',

  },
  {
    id: '2',
    date: '2016-05-04',
    name: '张三',
    address: '上海市普陀区金沙江路 1517 弄',
    customHeader: '自定义头',
    formatterColumn: '黄',
    assets: 8,
    age: 36,
    tags: '公司',
    actionContent: '操作',

  },
  {
    id: '3',
    date: '2016-05-01',
    name: '王五',
    address: '上海市普陀区金沙江路 1519 弄',
    customHeader: '自定义头',
    formatterColumn: '蓝',
    assets: 9,
    age: 66,
    tags: '学校',
    hasChildren: true,
    actionContent: '操作',

  },
  {
    id: '4',
    date: '2016-05-03',
    name: '刘大',
    address: '上海市普陀区金沙江路 1516 弄',
    customHeader: '自定义头',
    formatterColumn: '绿',
    assets: 0,
    age: 99,
    tags: '家',
    actionContent: '操作',

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
            total: 650,
            currentPage: 1,
            pageSize: 10
          }
          setTimeout(() => {
            resolve(data)
          }, 2000)
        })
      }
    }
  },
  computed: {
    columns () {
      return [
        {
          label: '姓名',
          prop: 'name',
          key: 'name',
        },
        // {
        //   label: '日期',
        //   prop: 'date',
        //   key: 'date',
        //   sortable: 'custom',
        //   width: 120
        // },
        // {
        //   label: '地址',
        //   prop: 'address',
        //   key: 'address'
        // },
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
          prop: 'customHeader',
          slotHeader: 'customHeader',
        },
        {
          label: '过滤列formatter', 
          prop: 'formatterColumn',
          formatter: (row, column, cellValue) => {
            return cellValue + '-' + row.name + '-' + '过滤列'
          },
        },
        // {
        //   label: '资产',
        //   prop: 'assets',
        //   key: 'assets',
        //   sortable: 'custom',
        // },
        // {
        //   label: '年龄',
        //   prop: 'age',
        //   summaryFun: ({ columns, data }) => {
        //     console.log('columns', columns)
        //     const age = data.map(item => item.age)
        //     const total = age.reduce((acc, cur) => acc + cur, 0)
        //     return `总年龄: ${total}`
        //   }
        // },
        // {
        //   label:'标签',
        //   prop:'tags',
        //   filters:[
        //     { text: '家', value: '家' },
        //     { text: '公司', value: '公司' },
        //     { text: '学校', value: '学校' },
        //   ],
        //   filterMultiple: true,
        //   filterMethod: (value, row) => {
        //     return row.tags === value
        //   },
        //   // formatter: (row, column, cellValue) => {
        //   //   return cellValue + '-' + row.name + '-' + '过滤列'
        //   // },
        //   // render: (h, params) => {
        //   //   return h('el-tag', {
        //   //     props: {
        //   //       type: params.row.tags === '家' ? 'primary' : 'success'
        //   //     }
        //   //   }, params.row.tags)
        //   // }
        // },
        {
          label: '操作',
          prop: 'actionContent',
          fixed: 'right',
          // slotHeader: 'actionContent',
          slotScope: 'actionContent',
          width: 200
        },
      ]
    }
  },
  methods: {
    indexMethod (index) {
      return index + 2
    },
    lazyLoad (tree, treeNode, resolve) {
      console.log(tree, treeNode, resolve)
      resolve([].concat([{
        id: `${tree.id}-1`,
        date: '2016-05-03',
        name: '刘大',
        address: '上海市普陀区金沙江路 1516 弄',
        customHeader: '自定义头',
        formatterColumn: '绿',
        assets: 0,
        age: 99,
        hasChildren: true
      }]))
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  }
}
</script>
