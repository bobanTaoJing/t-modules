<style scoped>
  .tree-panel {
    padding: 0px 10px;
    width: 100%;
    height: 200px;
    overflow-y: auto;
  }

  .tree-select-panel .ivu-select-selection .ivu-select-dropdown {
    display: none;
  }

  .tree-select-panel {
    width: 100%;
  }
</style>

<style>
  .tree-panel input {
    cursor: pointer;
  }

  .tree-panel .ivu-tree ul li {
    margin: 0px 0px;
  }

  .ivu-form-item-content .tree-select-panel {
    line-height: 24px !important;
  }

  .ivu-dropdown-transfer {
    z-index: 1060;
  }
</style>


<template>
  <Dropdown
    trigger="custom"
    :visible="visible"
    class="tree-select-panel">
    <a href="javascript:void(0)" @click="handleOpen">
      <i-input v-model="selectedText"
               :icon="visible?'arrow-up-b':'arrow-down-b'"
               :placeholder="placeholder" :disabled="disabled"
               @on-click.stop="iconClick"
               @on-clear="$emit('on-change', null);$emit('input', null)"
               :clearable="clearable"
               :readonly="readonly">

      </i-input>
    </a>
    <DropdownMenu slot="list">
      <div class="tree-panel">
        <Tree v-if="reflashTree" ref="tree" v-model="value" :showCheckbox="showCheckbox" :multiple="multiple" :data="treeData"
              @on-select-change="selectChange" @on-check-change="checkChange" @on-toggle-expand="toggleExpand"></Tree>
      </div>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  // import clickoutside from 'iview/src/directives/clickoutside';
  import utils from '../../utils/common';

  export default {
    // directives: {clickoutside},
    name: 'TreeSelect',
    props: {
      value: {},
      valField: {
        default: 'id'
      },
      textField: {
        default: 'name'
      },
      disabled:{
        type:Boolean,
        default:false,
      },
      data: {
        type: Array
      },
      placeholder: {
        default: '请选择'
      },
      constructTree: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      lastStep: {
        type: Boolean,
        default: false
      },
      param: {},
      dataUrl: {},
      clearable:{
        type:Boolean,
        default:true
      },
      isAsync:{
        type:Boolean,
        default:false
      },//是否为异步加载的树
      selectedTreeData:{},//选择的树节点数据
      leftTreeData:{},//左侧树的数据
      ip:{},
      readonly:{
        type:Boolean,
        default:true
      },
      multiple:{
        type:Boolean,
        default:false
      },
      expandAll:{
        type:Boolean,
        default: false
      },
      headers:{}
    },
    data () {
      return {
        mData: [],
        tData: [],
        asyncData:[],
        visible: false,
        selected: null,
        selectedText: '',
        reflashTree:true,
        isSelected:false
      };
    },
    computed: {
      treeData:{
        get:function(){
          if(this.isAsync)
            return this.asyncData
          else{
            if(this.expandAll){
              let data = this.data == null ? this.tData : this.data
              return this.setTreeExpand(data)
            }else
              return this.data == null ? this.tData : this.data;
          }
        },
      },
    },
    methods: {
      flashTree(){
        this.reflashTree = false
        setTimeout(()=>{
          this.reflashTree = true
          if(this.isSelected&&this.multiple){
            this.visible = true
            this.isSelected = false
          }
        },10)
      },
      /**
       * 获取数据
       */
      queryData () {
        if (this.dataUrl == null) {
          return;
        }
        this.loading = true;
        let param = Object.assign({}, this.param);
        let headers = this.headers
        if(!this.isAsync){
          this.$http.apiPost(this.dataUrl, param,{headers}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.mData = res.data.rows;
              this.$emit('on-data-loaded', res.data.rows, res);
              if (this.constructTree) {
                this.tData = utils.constructTree(res.data.rows, this.textField, true);
              } else {
                this.tData = res.data.rows;
              }
              if (this.value != null) {
                this.findSelected(this.value, this.treeData);
              }
            }
          });
        }else{
          if(this.leftTreeData.length>0){
            // console.log(this.leftTreeData)
            for(let a of this.leftTreeData){
              a.expand=false
            }
            this.asyncData=this.leftTreeData
            if(this.selectedTreeData){
                this.$emit('on-change', this.selectedTreeData)
                this.$emit('input', this.selectedTreeData.level+'-'+this.selectedTreeData.id)
                this.selectedText=this.selectedTreeData.title
                }
          }else{
            param.headers = headers
            this.$http.apiGet(this.ip+this.dataUrl,param).then(res=>{
              if(res.success){
                  let arr = []
                  for(let a of res.data.rows){
                    a.level=0
                    a.name=a.title
                    a.modalId = a.level + '-' + a.id//用于弹框选择父资源
                      a.hc=false
                      if(a.hasChildren)
                          a.children=[{}]
                      arr.push(a)
                  }
                  this.asyncData=arr
              }
            })
          }
        }
      },
      //异步树加载请求
      treeQuery(data){
            // console.log(data)
            this.$http.apiGet(this.ip+data.treeUrl)
                .then(res=>{
                    if(res.success){
                        let children=[]
                        for(let a of res.data.rows){
                          a.level=data.level+1
                          a.name=a.title
                          a.modalId = a.level + '-' + a.id//用于弹框选择父资源
                          a.parent=data
                            a.hc=false
                            if(a.hasChildren)
                                a.children=[{}]
                            children.push(a)
                        }
                        this.$set(data,'hc',true)
                        this.$set(data,'children',children)
                    }
                })
      },
      //树自动展开请求
      treeQueryAuto(data){
        return new Promise((resolve, reject) => {
          this.$http.apiGet(data.treeUrl)
                .then(res=>{
                    if(res.success){
                        let children=[]
                        for(let a of res.data.rows){
                          a.level=data.level+1
                          a.name=a.title
                          a.modalId = a.level + '-' + a.id//用于弹框选择父资源
                          a.parent=data
                            a.hc=false
                            if(a.hasChildren)
                                a.children=[{}]
                            children.push(a)
                        }
                        this.$set(data,'hc',true)
                        this.$set(data,'children',children)
                        resolve()
                    }
                })
        })
      },
      //树的节点展开与关闭事件
      toggleExpand(data){
            if(data.expand&&!data.hc&&data.hasChildren&&data.treeUrl){
                this.treeQuery(data)
            }
      },
      //默认展开所有树节点 新增 2019-12-09
      setTreeExpand(treeData){
        if(treeData){
          for(let a of treeData){
            a.expand = true
            if(a.children){
              a.children = this.setTreeExpand(a.children)
            }
          }
        }
        return treeData
      },
      selectChange (selected) {
        this.isSelected = true
        if (this.showCheckbox) {
          return;
        }

        if (selected == null || selected.length <= 0) {
          this.selected = null;
          this.selectedText = '';
          this.$emit('input', null);
        } else {
          //单选
          if(!this.multiple){
            if (this.lastStep && selected[0].children != null && selected[0].children.length > 0) {
              return;
            }
            this.selected = selected[0];
                this.selectedText = this.selected[this.textField].toString();
              this.$emit('input', this.selected[this.valField]);
          }else{
            if(selected.length<=0) return
            this.selected = selected
            let arr = [],arrName=[],arrValue=[]
            for(let a of selected){
              arrName.push(a[this.textField])
              arrValue.push(a[this.valField])
            }
            this.selectedText = arrName.join(',');
            this.$emit('input', arrValue.join(','));
          }
          
          
        }
        if(!this.multiple)
        this.visible = false;
        this.$emit('on-change', this.selected);
      },
      checkChange (checked) {
        if (checked == null || checked.length <= 0) {
          this.selected = null;
          this.selectedText = '';
          this.$emit('input', null);
        } else {
          let textArr = [];
          let valArr = [];
          for (let i = 0; i < checked.length; i++) {
            if (!this.lastStep || checked[i].children == null || checked[i].children.length <= 0) {
              textArr.push(checked[i][this.textField]);
              valArr.push(checked[i][this.valField]);
            }
          }
          this.selectedText = textArr.join(',');
          this.selected = checked;
          this.$emit('input', valArr);
        }
        this.$emit('on-change', this.selected);
      },
      checkAll () {
        let checkData = [];
        this.checkChildren(this.mData, checkData);
        this.checkChange(checkData);
      },
      checkChildren (data, checkData) {
        for (let i = 0; i < data.length; i++) {
          this.$set(data[i], 'checked', true);
          checkData.push(data[i]);
          if (data[i].children) {
            this.checkChildren(data[i].children, checkData);
          }
        }
      },
      unAllSelect () {
        for (let i = 0; i < this.mData.length; i++) {
          if (this.mData[i].selected) {
            this.$set(this.mData[i], 'selected', false);
          }
          if(this.mData[i].children){
            this.unAllSelect2(this.mData[i].children)
          }
        }
      },
      unAllSelect2(data){
        for (let i = 0; i < data.length; i++) {
          if (data[i].selected) {
            this.$set(data[i], 'selected', false);
          }
          if(data[i].children){
            this.unAllSelect2(data[i].children)
          }
        }
      },
      handleOpen () {
        if(this.disabled) return
        this.visible = true;
      },
      handleClose () {
        this.visible = false;
      },
      iconClick (e) {
        e.stopPropagation();
        this.visible = !this.visible;
      },
      findSelected (val, data) {
        if(val==null) return
        for (let i = 0; i < data.length; i++) {
          if(!this.multiple){
            if (data[i][this.valField] == val) {
              data[i].selected = true;
              this.selected = data[i];
              this.selectedText = this.selected[this.textField].toString();
              return;
            }
          }
          else{
            console.log(val)
            let arrVal= val.toString().split(',')
            if (arrVal.indexOf(data[i][this.valField].toString()) >-1) {
              data[i].selected = true;
              this.selected.push(data[i]);
              let arrName = []
              for(let a of this.selected){
                arrName.push(a[this.textField])
              }
              this.selectedText = arrName.join(',');
              // return;
            }
          }
          if (data[i].children != null) {
            this.findSelected(val, data[i].children);
          }
        }
      }
    },
    created () {
      this.queryData();
    },
    watch: {
      value (newVal, oldVal) {
        this.unAllSelect();
        if(!this.multiple)
        this.selected = null;
        else this.selected = []
        this.findSelected(newVal, this.treeData);
        this.flashTree()
      }
    },
    components: {}
  };
</script>
