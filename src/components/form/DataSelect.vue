<style scoped>

</style>

<style>

</style>

<template>
  <Select ref="select"
          v-model="selected"
          style="width:100%"
          @on-change="onSelectChange"
          :loading="loading"
          :filterable="filterable"
          :multiple="multiple"
          transfer
          :placeholder="placeholder"
          :size="size"
          :disabled="disabled"
          :clearable="clearable">
    <span v-show="selectData==null || selectData.length===0">　暂无数据</span>
    <Option v-for="item in selectData" :value="item.value" :key="item.value">{{item.label}}
    </Option>
  </Select>
</template>

<script>
  import utils from '../../utils/common';

  export default {
    name: 'DataSelect',
    props: {
      value: {},
      valField: {
        default: 'value'
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      textField: {
        default: 'label'
      },
      filterable: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      dataUrl: {},
      param: {},
      dict: {},
      size: {},
      dataType:'post',
      headers:{}
    },
    data () {
      return {
        loading: false,
        mData: [],
        selected: ''
      };
    },
    computed: {
      selectData () {
       // console.log("selectdata:" + this.data == null ? this.mData : this.data);
       if(this.data == null){
         return this.mData
       }else{
         for(let a of this.data){
           if(this.textField.indexOf(',')>-1){
           a.label = a[this.textField.split(',')[0]]+ a[this.textField.split(',')[1]]
          }else{
            a.label = a[this.textField]
          }
           a.value = a[this.valField]
         }
         return this.data
       }
        return (this.data == null ? this.mData : this.data);
      },
      vField () {
       // console.log("vField:" + this.dict != null ? 'id' : this.valField);
        return this.dict != null ? 'id' : this.valField;
      },
      tField () {
        return this.dict != null ? 'name' : this.textField;
      }
    },
    methods: {
      /**
       * 获取数据
       */
      queryData () {
        let textField = this.textField;
        let valField = this.valField;

        let url = this.dataUrl;
        // 如果是字典数据
        if (this.dict != null) {
          url = '/sys/dict/get?type=' + this.dict;
        //  console.log("url::" + url);
          textField = 'name';
          valField = 'id';
        }
        if (url == null) {
          return;
        }
        let headers = this.headers
        console.log(headers)
        this.loading = true;
         let param = Object.assign({simple: true}, this.param);
         if(this.dataType=='post'){
           this.$http.apiPost(url, param,{headers}).then((res) => {
             this.loading = false;
             if (!res.success) {
               this.$http.handleError(res);
             } else {
               this.mData = utils.constructSelect(res.data.rows, textField, valField);
             }
           });
         }else{
           param.headers = headers
           this.$http.apiGet(url, param).then((res) => {
             this.loading = false;
             if (!res.success) {
               this.$http.handleError(res);
             } else {
               this.mData = utils.constructSelect(res.data.rows, textField, valField);
               console.log(this.mData)
             }
           });
         }
      },
      onSelectChange (select) {
        // 判断数组是否有错误的值
        console.log(select)
        if (utils.isArray(select)) {
          for (let i = 0; i < select.length; i++) {
            if (select[i] == null || select[i] == '') {
              select.splice(i, 1);
            }
          }
        }
        //let selected = (select == null ? null : select.toString());
        this.$emit('input', select);
        // on-change
        if (select === null) {
          this.$emit('on-change', null);
        }
        if (this.data === null) {
          for (let i = 0; i < this.mData.length; i++) {
            if (this.mData[i][this.vField] === select) {

              this.$emit('on-change', this.mData[i]);
              break;
            }
          }
        } else {
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][this.vField] === select) {
              this.$emit('on-change', this.data[i]);
              break;
            }
          }
        }
      },
      setSelected (newVal) {
       // console.log("this.multiple:" + this.multiple);
        if (this.multiple) {
          if (newVal != null) {
            if (utils.isString(newVal)) {
              // 字符分割
              let strs = newVal.split(',');
              let arr = [];
              for (let i = 0; i < strs.length; i++) {
                arr.push(parseInt(strs[i]));
              }
              this.selected = arr;
            }
          } else {
            this.selected = [];
          }
        } else {
          if (newVal != null) {
            if (utils.isString(newVal)) {
              //2019-10-09 修改前
              // this.selected = parseInt(newVal);
              //修改后 可以字符串作为value值
              this.selected = newVal;
            }else {
              this.selected = newVal;
            }
          } else {
            this.selected = '';
          }

        }
      }
    },
    created: function () {
    //  console.log("create start:"+this.value  +"  "+this.multiple);
      if (this.multiple) {
        this.selected = [];
      }
      if (!this.lazy) {
        this.queryData();
      }
      if (this.value != null) {
    //    console.log("created selected:" + this.value);
        this.setSelected(this.value);
      }
    },
    watch: {
      value (newVal, oldVal) {
        this.setSelected(newVal);
     //   console.log(this.selected, newVal);
      },
      param: {
        handler (curVal, oldVal) {
          this.queryData();
        },
        deep: true
      },
    },
    components: {}
  };
</script>
