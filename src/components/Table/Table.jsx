import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import ElPagination from 'element-ui/lib/pagination'
//比较两个对象中有没有相同属性
function compareProps(props1, props2) {
  let result = []
  for (let key in props1) {
    if (Object.keys(props2).includes(key)) {
      result.push(key) // 属性名称不匹配
    }
  }
  return result
}
console.log(compareProps(ElTable.props, ElPagination.props))
// eslint-disable-next-line no-unused-vars
const { pageSize, currentPage, total, ...ElPaginationProps } = ElPagination.props

const props = Object.assign({}, ElTable.props, ElPaginationProps, {
  size: {
    type: String,
    default: 'default'
  },
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Function,
    required: true
  },
  defaultLoad: {
    // 默认加载表格
    type: Boolean,
    default: true
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  indexMethod: {
    type: Function,
    default: (index) => {
      return index + 1
    }
  },
  showSelection: {
    type: Boolean,
    default: false
  },
  showExpand: {
    type: Boolean,
    default: false
  },
  isTree: {
    type: Boolean,
    default: false
  },
  showPagination: {
    type: String | Boolean,
    default: 'auto'
  },
  currentPageName: {
    type: String,
    default: 'currentPage'
  },
  pageSizeName: {
    type: String,
    default: 'pageSize'
  },
  totalName: {
    type: String,
    default: 'total'
  }
})
const pagination = { pageSize: 10, currentPage: 1, hideOnSinglePage: true }
export default {
  name: 'Table',
  props: props,
  data() {
    return {
      tableLoading: false,
      sorter: {}, //排序字段及类型 {sortField: 'id', sortOrder: 'desc'}
      localData: [],
      pagination: {}
    }
  },
  created() {
    this.initPagination()
    if (this.defaultLoad) {
      this.loadTableData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$el.addEventListener('click', (e) => {
        let target = e.target
        if (target.tagName === 'A') {
          let page = target.getAttribute('data-page')
          if (page) {
            this.$emit('page', page)
          }
        }
      })
    })
  },
  methods: {
    /**
     * 初始化分页数据
     * 监听数据变化
     */
    initPagination() {
      this.pagination = Object.assign({}, pagination, { total: 0 })
      //   this.$on('total', (total) => {
      //     this.pagination['total'] = total
      //     this.pagination['pageCount'] = total / this.pagination['pageSize']
      //   })
      //   this.$on('pageSize', (pageSize) => {
      //     this.pagination['pageSize'] = pageSize
      //   })
      //   this.$on('currentPage', (currentPage) => {
      //     this.pagination['currentPage'] = currentPage
      //   })
      this.$on('pagination', (pagination) => {
        this.pagination = Object.assign({}, pagination, this.pagination)
      })
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.pagination = Object.assign(
          {},
          {
            currentPage: 1,
            pageSize: this.pageSize
          }
        ))
      this.loadTableData()
    },
    loadTableData() {
      this.tableLoading = true
      const parameter = Object.assign(
        {},
        { [this.pageSizeName]: this.pagination['pageSize'], [this.currentPageName]: this.pagination['currentPage'] },
        this.sorter
      )

      const result = this.data(parameter)

      if (result instanceof Promise) {
        result.then((res) => {
          this.pagination = Object.assign({}, this.pagination, {
            currentPage: res[this.currentPageName],
            total: res[this.totalName]
          })
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (res.records.length === 0 && this.showPagination && this.pagination.currentPage > 1) {
            this.pagination.currentPage--
            this.loadTableData()
            return
          }
          // 这里用于判断接口是否有返回 res.total 且 this.showPagination = true 且 currentPage 和 pageSize 存在 且 total 小于等于 currentPage * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if (this.hideOnSinglePage) {
              this.pagination.hideOnSinglePage = true
            } else if (
              ['auto'].includes(this.showPagination) &&
              res[this.totalName] <= res[this.currentPageName] * this.pagination.pageSize
            ) {
              this.pagination.hideOnSinglePage = true
            }
          } catch (e) {
            console.error(e)
            this.pagination.hideOnSinglePage = false
          }
          this.localData = res.records // 返回结果中的数组数据
          this.tableLoading = false
          console.log(this.tableLoading)
        })
      } else {
        console.error('Invalid prop:result.then is not a function. Prop of data must be Promise.')
      }
    },
    lazyLoad(tree, treeNode, resolve) {
      console.log(tree, treeNode, resolve)
      this.$emit('lazyLoad', tree, treeNode, resolve)
    },
    summaryFun({ columns, data }) {
      const sums = []
      //判断columns包含的特殊类型
      const specialTypeLength = columns.filter((item) => {
        return item.type === 'index' || item.type === 'selection' || item.type === 'expand'
      }).length
      columns.forEach((column, index) => {
        if (specialTypeLength) {
          sums[specialTypeLength - 1] = this.sumText || '合计'
        }
        const summarycol = this.columns.find((item) => {
          if (item.prop !== column.property) {
            return false
          }
          let flag = false
          if ('summaryFun' in item) {
            if (typeof item['summaryFun'] === 'function') {
              const result = item.summaryFun({ columns, data })
              if (result) {
                flag = true
                console.info(`属性 summaryFun 是一个函数，并且返回了值：${result}`)
              } else {
                console.error(`属性 summaryFun 是一个函数，但是返回的不是值`)
              }
            } else {
              console.error(`属性 summaryFun 不是一个函数`)
            }
          }
          return flag
        })
        if (summarycol && summarycol.summaryFun) {
          const { summaryFun } = summarycol
          try {
            sums[index] = summaryFun({ column, data })
          } catch (e) {
            sums[index] = 'N/A'
            console.error(e)
          }
        } else {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
    },
    handleSizeChange(pageSize) {
      this.pagination['pageSize'] = pageSize
      this.loadTableData()
    },
    handlePrevClick(currentPage) {
      this.$emit('prev-click', currentPage)
    },
    handleNextClick(currentPage) {
      this.$emit('next-click', currentPage)
    },
    handleCurrentChange(currentPage) {
      this.pagination['currentPage'] = currentPage
      this.loadTableData()
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      console.log(currentRow, oldCurrentRow)
    },
    handleSortChange({ column, prop, order }) {
      console.log(column, prop, order)
      this.sorter = Object.assign(
        {},
        (order && {
          sortOrder: order
        }) ||
          {},
        (order &&
          prop && {
            sortField: prop
          }) ||
          {}
      )
      this.loadTableData()
    },
    renderTableColumns(h, columns) {
      console.log('ElTableColumn.props', ElTableColumn.props)
      // 数据列
      const defaultColumns = columns.map((column, index) => {
        //判断是不是多级表头
        if (typeof column.children !== 'undefined') {
          return <ElTableColumn {...{ props: column }}>{this.renderTableColumns(h, column.children)}</ElTableColumn>
        }
        const tableColumnProps = {}
        const tableColumnKeys = Object.keys(column)
        Object.keys(ElTableColumn.props).forEach((k) => {
          if (tableColumnKeys.includes(k)) {
            tableColumnProps[k] = column[k]
            return tableColumnProps[k]
          }
          //特殊处理的k
          return tableColumnProps[k]
        })
        const scopedSlots = {
          default: (scope) => {
            if (column.slotScope) {
              return this.$scopedSlots[column.slotScope](scope)
            }
            return scope.row[column.prop]
          },
          header: (scope) => {
            if (column.slotHeader && column.slotHeader.endsWith('Header')) {
              return this.$scopedSlots[column.slotHeader](scope)
            }
            return column.label
          }
        }
        return (
          <ElTableColumn key={index} {...{ props: tableColumnProps }} scopedSlots={scopedSlots}>
            {/* {column.slotHeader && column.slotHeader.endsWith('Header') && (
              <template slot="header" slot-scope="scope">{this.$slots[column.slotHeader]} </template>
            )} */}
          </ElTableColumn>
        )
      })
      return [].concat(defaultColumns)
    }
  },
  render(h) {
    const tableProps = {}
    const paginationProps = {}
    const localKeys = Object.keys(this.$data)
    //table的props赋值
    Object.keys(ElTable.props).forEach((k) => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        tableProps[k] = this[localKey]
        return tableProps[k]
      }
      //特殊处理的k
      if (k === 'summaryMethod') {
        //使用列中的合并项
        tableProps[k] = this.summaryFun
        return tableProps[k]
      }
      if (k === 'load') {
        //树形懒加载的方法
        tableProps[k] = this.lazyLoad
        return tableProps[k]
      }
      //如果table的props没有，就去this中找
      this[k] && (tableProps[k] = this[k])
      return tableProps[k]
    })
    const paginationKeys = Object.keys(this.pagination)
    //pagination的props赋值
    Object.keys(ElPagination.props).forEach((k) => {
      if (paginationKeys.includes(k)) {
        paginationProps[k] = this.pagination[k]
        return paginationProps[k]
      }
      //特殊处理的k
      //如果table的props没有，就去this中找
      this[k] && (paginationProps[k] = this[k])
      return paginationProps[k]
    })
    const table = (
      <ElTable
        ref="table"
        v-loading={this.tableLoading}
        {...{ props: tableProps }}
        class={['cb-table', `cb-table-${this.size}`]}
        v-on:selection-change={this.handleSelectionChange}
        v-on:current-change={this.handleCurrentRowChange}
        v-on:sort-change={this.handleSortChange}
      >
        {this.showSelection && <ElTableColumn type="selection" width={55} />}
        {this.showExpand && (
          <ElTableColumn type="expand" width={55}>
            {this.$slots['expand']}
          </ElTableColumn>
        )}
        {this.showIndex && <ElTableColumn type="index" index={this.indexMethod} width={55} />}
        {this.isTree && <ElTableColumn type="default" />}
        {this.renderTableColumns(h, this.columns)}
      </ElTable>
    )
    const pagination = (
      <el-pagination
        small
        {...{ props: paginationProps }}
        // total={this.pagination.total}
        v-on:size-change={this.handleSizeChange}
        v-on:current-change={this.handleCurrentChange}
        v-on:prev-click={this.handlePrevClick}
        v-on:next-click={this.handleNextClick}
      />
    )
    return (
      <div className="table-wrapper">
        {table}
        {this.showPagination&&pagination}
      </div>
    )
  }
}
