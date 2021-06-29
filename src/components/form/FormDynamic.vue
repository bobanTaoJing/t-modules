<style scoped>
.title {
    padding: 0px 5px 3px 10px;
    font-size: 14px;
    border-bottom: #e0e0e0 1px solid;
    width: 100%;
    margin-bottom: 15px;
}

.ivu-tooltip {
    width: 100%;
}
.formItemTip{
    position:absolute;
    top: 100%;
    left: 0;
    line-height: 1;
    padding-top: 6px;
    color:#969393;
}
.ivu-form-item-error .formItemTip{
    display:none;
}
</style><style>
.no-label .ivu-form-item-content {
    margin-left: 30px !important;
}
/* .popup-edit-modal .ivu-modal-body{
    overflow: visible !important;
} */
.ivu-select-selection> div{
    min-height:28px;
}
.noSuffix .ivu-input-suffix{
    display: none;
}
.noSuffix .ivu-input-with-suffix{
    padding-right: 0px;
}
</style>

<template>
<i-form ref="fromData" :style="{'min-height':minHeight+'px'}" :model="fromData" :label-width="this.labelWidth" :label-position="this.labelPosition">
    <Row v-for="(rowItem, rowIndex) in hdData" :key="'rowItem'+rowIndex">
        <i-col v-for="(item, index) in rowItem" :span="item.span" :key="'col'+index" :class="{'no-label': item.noLabel}" :style="colStyle">
            <template v-if="item.type==='title'">
                <div class="title">
                    {{item.text}}
                </div>
            </template>
            <template v-else>
                <FormItem :key="'formItem'+index" :label="placeholderLabel?'':item.label" :label-width="item.labelWidth" v-show="!item.hidden" :rules="item.rules==null?null:item.rules" :prop="item.name">
                    <!-- <Tooltip :placement="item.tipfx?item.tipfx:'top'" :content="item.tiptext" :disabled="item.tiptext===undefined"> -->
                        <!-- <div slot="content">
                          <p>{{item.tiptext}}</p>
                      </div> -->
                      <!-- 输入框自动生成内容 -->
                      <template v-if="item.type==='text'&&item.autoCreate">
                          <i-input class="noSuffix" style="width:calc(100% - 0px)" :type="getInputType(item)" v-model="fromData[item.name]" :placeholder="getPlaceholder(item)" :readonly="item.readonly" :disabled="item.disabled" @on-click="(val) =>{ if( item.onClick!==null){item.onClick(fromData,mData)}}" :autosize="item.textarea">
                          </i-input>
                          <span @click="$emit('autoCreate',item)" title="自动生成" style="position:absolute;right:7px;top:4px;height:25px;background:#fff;cursor:pointer;padding-left:10px">
                              <!-- <img src="../../assets/img/auto.png" style="width:25px;vertical:middle" alt="" srcset=""> -->
                          </span>
                      </template>
                        <!--输入框-->
                        <template v-else-if="item.type==='text'&&!item.autoCreate&&(reflashIndex!==index||(reflashIndex===index&&reflashPassWord))">
                            <i-input :type="getInputType(item)" v-model="fromData[item.name]" :placeholder="getPlaceholder(item)" :readonly="item.readonly" :disabled="item.disabled" :icon="item.icon" @on-click="(val) =>{ if( item.onClick!==null){item.onClick(fromData,mData)}}" :autosize="item.textarea">
                                <Icon style="cursor:pointer" @click="showPassWord(item,true,index)" v-show="item.password&&!item.showPassWord" type="md-eye" slot="suffix" />
                                <Icon style="cursor:pointer" @click="showPassWord(item,false,index)" v-show="item.password&&item.showPassWord" type="md-eye-off" slot="suffix" />
                            </i-input>
                        </template>
                        <!--数字输入框-->
                        <template v-else-if="item.type==='number'">
                            <input-number style="width:100%" v-model="fromData[item.name]" :readonly="item.readonly" :disabled="item.disabled" :icon="item.icon" :placeholder="getPlaceholder(item)" :max="item.max" :min="item.min" :editable="item.editable" :step="item.step||1" :precision="item.precision||0" @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}" :autosize="item.textarea">
                            </input-number>
                        </template>
                        <!--选择框-->
                        <template v-else-if="item.type==='popText'">
                            <i-input type="text" v-model="fromData[item.textField]" :placeholder="getPlaceholder(item)" :disabled="item.disabled" :readonly="item.readonly == undefined ? true : item.readonly" icon="ios-search" @on-click="(val) =>{ if( item.onClick!==null){item.onClick(fromData,mData)}}" :autosize="item.textarea">
                            </i-input>
                        </template>
                        <!--选择框-->
                        <template v-else-if="item.type==='select'">
                            <DataSelect v-model="fromData[item.name]" :data="item.data" :dict="item.dict" :param="item.param" :headers="item.headers?item.headers:headers" :disabled="item.disabled" :dataUrl="item.dataUrl" :valField="item.valField" :textField="item.textField" :clearable="item.clearable" :placeholder="getPlaceholder(item)" @on-change="(val)=>{$emit('changeSelect',item.name);if(item.onChange!=null){item.onChange(val,fromData,mData)}}" :multiple="item.multiple">
                            </DataSelect>
                        </template>
                        <!--时间选择器-->
                        <template v-else-if="item.type==='time'">
                            <TimePicker transfer type="time" :disabled="item.disabled" @on-change="(val)=>{item.onChange?item.onChange(val):''}" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </TimePicker>
                        </template>
                        <!--日期选择器-->
                        <template v-else-if="item.type==='year'">
                            <DatePicker transfer style="width:100%" type="year" format="yyyy" @on-change="(val)=>{item.onChange?item.onChange(val):''}" :disabled="item.disabled" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </DatePicker>
                        </template>
                        <!--日期选择器-->
                        <template v-else-if="item.type==='date'">
                            <DatePicker transfer style="width:100%" type="date" @on-change="(val)=>{item.onChange?item.onChange(val):''}" :disabled="item.disabled" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </DatePicker>
                        </template>
                        <!--日期选择器 yyyy-MM-dd HH:mm:ss-->
                        <template v-else-if="item.type==='datetime'">
                            <DatePicker transfer style="width:100%" type="datetime" @on-change="(val)=>{item.onChange?item.onChange(val):''}" format="yyyy-MM-dd HH:mm:ss" :disabled="item.disabled" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </DatePicker>
                        </template>
                        <!--日期选择器 yyyy-MM-dd HH:mm:ss-->
                        <template v-else-if="item.type==='datetimerange'">
                            <DatePicker transfer style="width:100%" type="datetimerange" @on-change="(val)=>{item.onChange?item.onChange(val):''}" :format="item.format || 'yyyy-MM-dd HH:mm:ss'" :disabled="item.disabled" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </DatePicker>
                        </template>
                        <template v-else-if="item.type==='month'">
                            <DatePicker transfer style="width:100%" type="month" @on-change="(val)=>{item.onChange?item.onChange(val):''}" :format="item.format || 'yyyy-MM'" :disabled="item.disabled" :placeholder="getPlaceholder(item)" v-model="fromData[item.name]">
                            </DatePicker>
                        </template>
                        <!--多选框-->
                        <template v-else-if="item.type==='checkbox'">
                            <Checkbox v-if="item.enableCheckAll" :value="mData[item.name].checkAll" @click.prevent.native="handleCheckAll(item)">{{item.checkAllLabel}}
                            </Checkbox>
                            <CheckboxGroup v-model="fromData[item.name]" @on-change="checkGroupChange($event,item)">
                                <Checkbox v-for="(option, optionIndex) in item.data " :label="option.value" transfer :key="'checkbox'+index+'_'+optionIndex">
                                    {{option.label}}
                                </Checkbox>
                            </CheckboxGroup>
                        </template>
                        <!--开关选项-->
                        <template v-else-if="item.type==='switch'">
                            <i-switch v-model="fromData[item.name]" size="large" :key="'switch'+index" :disabled="item.disabled" :trueValue="item.trueValue" @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}" :falseValue="item.falseValue">
                                <span slot="open">{{item.openText}}</span>
                                <span slot="close">{{item.closeText}}</span>
                            </i-switch>
                        </template>
                        <!--单选框-->
                        <template v-else-if="item.type==='radio'">
                            <RadioGroup v-model="fromData[item.name]" :type="item.button?'button':null" @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,fromData,mData)}}">
                                <Radio v-for="(option, optionIndex) in item.data" :key="'radio'+index+'_'+optionIndex" :label="option.value==null?optionIndex:option.value">
                                    {{option.label}}
                                </Radio>
                            </RadioGroup>
                        </template>
                        <!--选择树-->
                        <template v-else-if="item.type==='treeSelect'">
                            <TreeSelect v-model="fromData[item.name]" :data="item.data" :disabled="item.disabled" :param="item.param" :headers="item.headers?item.headers:headers" :valField="item.valField" :textField="item.textField" :lastStep="item.lastStep" :onlyShowLevel1="item.onlyShowLevel1" :constructTree="item.constructTree" :dataUrl="item.dataUrl" :isAsync="item.isAsync" :expandAll="item.expandAll" :selectedTreeData="item.selectedTreeData" :leftTreeData="item.treeData" @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,data,fromData,mData)}}">
                            </TreeSelect>
                        </template>
                        <!--选择树2-->
                        <template v-else-if="item.type==='treeSelect2'">
                            <TreeSelect2 v-model="fromData[item.name]" :data.sync="item.data" :disabled="item.disabled">
                            </TreeSelect2>
                        </template>
                        <template v-else-if="item.type==='inputSelect'">
                            <inputSelect v-model="fromData[item.name]" :value.sync="item.value" :valField="item.valField" :textField="item.textField" :dataUrl="item.dataUrl"
                                         :pageIndexField="item.pageIndexField" :pageSizeField="item.pageSizeField" :dataUrlType="item.dataUrlType" :headers="item.headers"
                                          :resFun="item.resFun" :paramStr="item.paramStr">
                            </inputSelect>
                        </template>
                        <!--图片上传-->
                        <template v-else-if="item.type==='imgUpload'">
                            <ImgUpload v-model="fromData[item.name]" :data="item.data" :param="item.param" :max="item.max" :uploadFormat="item.uploadFormat" :disabled="item.disabled" :dataUrl="item.dataUrl">
                            </ImgUpload>
                        </template>

                        <!--标签-->
                        <template v-else-if="item.type==='label'">
                            <div v-html="item.data"></div>
                        </template>

                        <!--按钮组-->
                        <template v-else-if="item.type==='buttons'">
                            <Button style="margin-left: 5px" v-for="(option, optionIndex) in item.data" :key="'button'+index+'_'+optionIndex" :type="option.btnType" :shape="option.shape" :icon="option.icon" :size="item.size" @click="option.onClick(fromData)">{{option.label}}
                            </Button>
                        </template>
                        <template v-else-if="item.type==='colorPicker'">
                            <ColorPicker type="text" v-model="fromData[item.name]">
                            </ColorPicker>
                        </template>

                        <!--代码编辑器-->
                        <!-- <template v-else-if="item.type==='codeEditor'">
                            <MonacoEditor
                                v-model="fromData[item.name]"
                                :height="item.height"
                                :showAction="false"
                                :language="item.language?item.language:'mysql'"/>
                        </template> -->
                        <!--代码编辑器2-->
                        <template v-else-if="item.type==='codeEditor'||item.type==='aceCodeEditor'">
                            <AceEditor
                                v-model="fromData[item.name]"
                                :height="item.height"
                                :showAction="false"
                                :language="item.language?item.language:'mysql'"/>
                        </template>
                        <!--cron生成器-->
                        <template v-else-if="item.type==='cron'">
                            <easyCron v-model="fromData[item.name]" />
                        </template>
                        <!-- 文本编辑器2 -->
                        <!-- <template v-else-if="item.type==='VueQuillEditor'">
                            <VueQuillEditor v-model="fromData[item.name]"/>
                        </template> -->

                        <template v-else>
                            {{item.type}}未匹配到对应的组件
                        </template>
                    <!-- </Tooltip> -->
                    <!-- 表单提示 -->
                    <div class="formItemTip" v-show="item.tiptext!==undefined">
                        <Icon type="ios-alert-outline" />{{item.tiptext}}
                    </div>
                </FormItem>
            </template>
            <slot v-if="rowIndex==appendIndex[0]&&index==appendIndex[1]" name="appendIndex">

            </slot>
        </i-col>

        <slot v-if="rowIndex==data.length-1" name="append">

        </slot>

    </Row>

</i-form>
</template>

<script>
//linkage:true,relyKey:'serviceClasses',relyValue:0
import {
    TreeSelect,
    DataSelect,
    ImgUpload,
    FormEditor,
} from '../../components/index';
// import MonacoEditor from '../editor/MonacoEditor'
import AceEditor from '../editor/AceEditor.vue'
import easyCron from '../../../self_node_modules/vue-easy-cron/src/lib/easy-cron/input-cron'//cron生成器
import VueQuillEditor from '../editor/vue-quill-editor'
import CryptoJS from "crypto-js";
import TreeSelect2 from './TreeSelect2.vue'
import inputSelect from './InputSelect.vue'

export default {
    name:'FormDynamic',
    props: {
        data: {},
        labelWidth: {
            default: 1
        },
        labelPosition: {
            default: 'right'
        },
        placeholderLabel: {
            default: false,
            type: Boolean
        },
        minHeight: {
            default: 0
        },
        colHeight: {},
        paddingRight: {},
        headers:{},
        appendIndex:{
            type:[Array],
            default:function(){
                return []
            }
        }
    },
    data() {
        return {
            keys: null,
            fromData: {},
            mData: {},
            showTip: '',
            linkageJudge: {},
            reflashPassWord:true,
            reflashIndex:''
        };
    },
    computed: {
        colStyle() {
            return {
                height: this.colHeight + 'px',
                paddingRight: this.paddingRight + 'px'
            };
        },
        // linkageJudge(){
        //     let obj={}
        //     for(let a of this.data){
        //         if(a.linkage&&this.fromData[a.relyKey]==a.relyValue)
        //             obj[a.name] = true
        //     }
        //     return obj
        // }
        hdData() {
            let arr = []
            if(this.data){
                for (let a of this.data) {
                    let hidden = true,arr2=[]
                    if(typeof a == 'object')
                    for (let b of a) {
                        if (b.linkage||b.linkages) {
                            if (this.fromData[b.relyKey] === b.relyValue)
                                hidden = false
                            if(b.relys){
                                hidden = false
                                let arra=[],arrb=[]
                                for(let c of b.relys){
                                    if(c.essential) arra.push(c)
                                    else arrb.push(c)
                                }
                                //且
                                let qie = true
                                for(let item of arra){
                                    if (this.fromData[item.relyKey] != item.relyValue)
                                    qie = false
                                }
                                //或
                                let hou = true
                                arrb.length>0?hou=false:true
                                for(let item of arrb){
                                    if (this.fromData[item.relyKey] == item.relyValue)
                                    hou = true
                                }
                                hidden = !(qie&&hou)
                            }
                        } else hidden = false
                        if (!hidden&&!b.disappear) arr2.push(b)
                    }
                    arr.push(arr2)
                }
            }
            return arr
        }
    },
    created() {
        this.initForm(this.data);
        this.reset();
        this.fromData
    },
    mounted() {},
    methods: {
        showPassWord(item,value,index){
           this.$set(item,'showPassWord',value)
           this.reflashIndex = index
           this.reflashPassWord = false
           setTimeout(()=>{
               this.reflashIndex = true
           },10)
        },
        getInputType(item) {
            if(item.password){
                if(item.showPassWord) return 'text'
                else return 'password'
            }
            return item.textarea == null ? item.password === true ? 'password' : 'text' : 'textarea';
        },
        initForm(data) {
            // console.log("data:" + JSON.stringify(data))
            for (let i in data) {
                for (let j in data[i]) {
                    let obj = data[i][j];
                    if (obj) {
                        if (obj.rules != null) {
                            if (obj.rules.message == null && !obj.rules.validatorSimp) {
                                obj.rules.message = obj.label + '不能为空';
                            }
                            if (obj.rules.trigger == null) {
                                obj.rules.trigger = 'blur';
                            }
                            if (obj.rules.validatorSimp) {
                                obj.rules.validator = (rule, value, callback) => {
                                    if (!value && obj.rules.required) {
                                        return callback(new Error(obj.label + '不能为空'))
                                    }
                                    let res = obj.rules.validatorSimp.res
                                    if(typeof res == 'string') res = new RegExp(res)
                                    if(res){
                                        if (res.test(value)||value==''||value==null) {
                                            return callback()
                                        } else {
    
                                            return callback(new Error(obj.rules.validatorSimp.msg))
                                        }
                                    }else return callback()
                                }
                            }
                        }
                        if (obj.name != null && obj.name.length > 0) {
                            // console.log("stringify(obj)::"+JSON.stringify(obj));
                            this.mData[obj.name] = obj;
                        }
                    }
                }
            }
        },
        getPlaceholder(item) {
            //console.log("this.placeholderLabel:" + this.placeholderLabel);
            if (this.placeholderLabel) {
                return item.label;
            }
            let result;
            // console.log("item.placeholder:" + item.placeholder == null);
            // console.log("items.placeholder:" + item.placeholder);
            if (item.placeholder == null) {
                switch (item.type) {
                    case 'text':
                        result = item.disabled || item.readonly ? '' : '请输入...';
                        break;
                    case 'popText':
                        result = item.disabled || item.readonly ? '' : '请选择...';
                        break;
                    case 'time':
                        result = item.disabled || item.readonly ? '' : '选择时间';
                        break;
                    case 'datetime':
                    case 'date':
                        result = item.disabled || item.readonly ? '' : '选择日期';
                        break;
                    case 'datetimerange':
                        result = item.disabled || item.readonly ? '' : '选择时间段';
                        break;
                    case 'year':
                        result = item.disabled || item.readonly ? '' : '选择年份';
                        break;
                    default:
                        result = '';
                        break;
                }
            } else {
                result = item.placeholder;
            }
            return result;
        },
        checkAll(data, name) {
            let checkArr = [];
            for (let i = 0; i < data.length; i++) {
                checkArr.push(data[i].value);
            }
            this.$set(this.fromData, name, checkArr);
            this.$set(this.mData[name], 'checkAll', true);
        },
        handleCheckAll(item) {
            let checkAll = this.mData[item.name].checkAll;
            if (checkAll) {
                this.$set(this.fromData, item.name, []);
                this.$set(this.mData[item.name], 'checkAll', false);
            } else {
                let data = this.mData[item.name].data;
                this.checkAll(data, item.name);
            }
            item.onChange(item, this.mData, this.fromData);
        },
        checkGroupChange(event, item) {
            let selected = event.length;
            let orign = this.mData[item.name].data.length;
            if (selected === orign) {
                this.$set(this.mData[item.name], 'checkAll', true);
            } else {
                this.$set(this.mData[item.name], 'checkAll', false);
            }
            if (item.onChange) {
                item.onChange(item, this.mData, this.fromData);
            }

        },
        /**
         * 重置
         */
        reset() {
            this.keys = [];
            // 设置初始默认值
            for (var name in this.mData) {
                if (this.mData[name].value != null) {
                    let val = this.mData[name].value;
                    this.$set(this.fromData, name, val);
                } else {
                    if (this.mData[name].type === 'number') {
                        this.$set(this.fromData, name, this.mData[name].min || 0);
                    } else if (this.mData[name].type === 'checkbox' && this.mData[name].enableCheckAll === true) {
                        this.checkAll(this.mData[name].data, name);
                    } else if (this.mData[name].type === 'popText') {
                        this.$set(this.fromData, this.mData[name].textField, null);
                        this.keys.push(this.mData[name].textField);
                        this.$set(this.fromData, name, null);
                    } else {
                        this.$set(this.fromData, name, null);
                    }
                }
                this.keys.push(name);
            }
        },
        /**
         * 验证表单
         * @param success
         * @param error
         */
        submit(success, error) {
            this.$refs.fromData.validate((valid) => {
                let data = this.fromData;
                if (valid) {
                    // console.log(this.mData)
                    // console.log(this.linkageJudge)
                    for (var name in this.mData) {
                        let obj = this.mData[name];
                        if (obj != null && data[name] != null) {
                            if (data[name] instanceof Date) {
                                if (obj.type == 'date') {
                                    let format = obj.format || 'yyyy-MM-dd';
                                    data[name] = data[name].Format(format);
                                } else if (obj.type == 'datetime') {
                                    let format = obj.format || 'yyyy-MM-dd hh:mm:ss';
                                    data[name] = data[name].Format(format);
                                } else if (obj.type == 'year') {
                                    let format = obj.format || 'yyyy';
                                    data[name] = data[name].Format(format);
                                } else if (obj.type == 'month') {
                                    let format = obj.format || 'yyyy-MM';
                                    data[name] = data[name].Format(format);
                                }
                            }
                            if(obj.type == 'select'){
                                if(obj.valueType == 'string'){
                                    data[name] = data[name].toString()
                                }else if(obj.valueType=='arrayString'){
                                    data[name] = data[name].join(',')
                                }
                            }
                            if (obj.type == 'datetimerange') {
                                if (data[name].length == 2 && data[name][0] instanceof Date && data[name][1] instanceof Date) {
                                    let format = obj.format || 'yyyy-MM-dd hh:mm:ss';
                                    let arr = [];
                                    arr.push(data[name][0].Format(format));
                                    arr.push(data[name][1].Format(format));
                                    data[name] = arr;
                                }
                            }
                            if(obj.type=='text'){
                                if(obj.crypto){
                                  data[name] =  this.jiami(data[name],obj.aseKey)
                                }
                            }
                        }
                        if (obj != null && data[name] != null && obj.type === 'checkbox' && obj.toJson) {
                            // data[name] = JSON.stringify(data[name]);
                        }
                        //过滤 不显示的字段
                        if(!this.linkageJudge[obj.name]){
                            delete(data[obj.name])
                        }
                    }
                    success(data);
                } else {
                    this.$Message.error('请填写正确再提交!');
                    if (error != null) {
                        error(data);
                    }
                }
            });
        },
        //加密
        jiami(message,aseKey='62666118'){
            // var aseKey = "62666118"     //秘钥必须为：8/16/32位
            // var message = "80018000142";
            //加密
            var encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
            return encrypt
        },
        //解密
        jiemi(encrypt,aseKey='62666118'){
            var decrypt = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(aseKey), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8);
                return decrypt
        },
        getData() {
            return this.fromData;
        },
        /**
         * 设置表单数据
         * @param fromData
         */
        setFormData(fromData) {
            this.reset();
            this.fromData = {}
            // 设置表单传进来的值
            for (let name in fromData) {
                let val = fromData[name];
                if (this.mData[name] != null) {
                    // console.log("name::"+name +"  val::" + val+"   type::"+this.mData[name].type);
                    if (this.mData[name].type == 'date'||this.mData[name].type == 'datetime') {
                        val = new Date(val);
                    } else if (this.mData[name].type == 'checkbox') {
                        if (val.length != this.mData[name].data.length) {
                            this.mData[name].checkAll = false;
                        }
                    } else if (this.mData[name].type == 'year') {
                        let d = new Date();
                        d.setFullYear(val);
                        val = d;
                    }else if(this.mData[name].type=='text'){
                        if(this.mData[name].crypto){
                            if(val){
                               val = this.jiemi(val,this.mData[name].aseKey)
                            }
                        }
                    }
                }
                if (this.keys.contains(name)) {
                    this.$set(this.fromData, name, val)
                }
            }
        },
        //处理字段显示 和取舍
        handlerParams(){
            let obj = {}
                for (let a of this.data) {
                    let hidden = true,arr2=[]
                    if(typeof a == 'object')
                    for (let b of a) {
                        if (b.linkage||b.linkages) {
                            if (this.fromData[b.relyKey] === b.relyValue)
                                hidden = false
                            if(b.relys){
                                hidden = false
                                let arra=[],arrb=[]
                                for(let c of b.relys){
                                    if(c.essential) arra.push(c)
                                    else arrb.push(c)
                                }
                                //且
                                let qie = true
                                for(let item of arra){
                                    if (this.fromData[item.relyKey] != item.relyValue)
                                    qie = false
                                }
                                //或
                                let hou = true
                                arrb.length>0?hou=false:true
                                for(let item of arrb){
                                    if (this.fromData[item.relyKey] == item.relyValue)
                                    hou = true
                                }
                                hidden = !(qie&&hou)
                            }
                        } else hidden = false
                        if (!hidden&&!b.disappear) obj[b.name] = true
                    }
                }
                this.linkageJudge = obj
        }
    },
    watch: {
        data:{
            handler(newVal, oldVal){
                this.initForm(newVal);
                this.handlerParams()
            },
            deep:true
        },
        fromData: {
            handler() {
                this.handlerParams()
            },
            deep: true
        },
    },
    components: {
        TreeSelect,
        DataSelect,
        ImgUpload,
        FormEditor,AceEditor,VueQuillEditor,easyCron,TreeSelect2,inputSelect
    }
};
</script>
