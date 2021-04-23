<template>
    <div style="height:100%">
        <div style="height:calc(100% - 42px);overflow:auto;padding:0 5px;">
            <div v-show="type==1">
                <h3>聚合条件</h3>
                <p v-for="(item,index) in groupTerm" class="groupTerm" :key="index+'a'">
                    <span>{{item.title}}</span>
                    <Icon class="colse colseHover" type="md-close" @click="removeItem(index)" />
                </p>
                <Dropdown trigger="click" style="width:100%;position:relative">
                    <p class="dropHover" style="color:#88BF4D;width:100%;cursor:pointer;padding:5px;">
                        <Icon type="md-add" /><span>添加指标</span>
                    </p>
                    <DropdownMenu slot="list">
                        <DropdownItem>
                            <p v-for="(item,index) in [
                                {type:1,type:1,title:'总行数',xq:'总的数据行数'},
                                {type:2,title:'总和',xq:'一个字段所有数值的总和'},
                                {type:4,title:'不重复值的总数',xq:'一个字段所有相互不重复的总数'},
                                {type:8,title:'最小值',xq:'一个字段所有数值的最小值'},
                                {type:9,title:'最大值',xq:'一个字段所有数值的最大值'}
                            ]" :key="index" class="zhibiaohover" @click="selectItem(item)">
                                <!-- <ChartSvg :type="item.dataType"></ChartSvg> -->
                                <span></span>
                                &nbsp;<span>{{item.title}}</span>
                                <Tooltip :content="item.xq" v-if="item.xq" :disabled="!item.xq" style="float:right" placement="bottom">
                                    <Icon type="ios-help-circle-outline" style="float:right"/>
                                </Tooltip>
                            </p>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Divider />
                <h3>
                    <span>分组条件</span>
                    <Input v-model="tableName" type="text" placeholder="字段名称" style="    width: calc(100% - 80px);"/>
                </h3>
                <p v-for="(item,index) in data" :key="index" class="zhibiaohover" style="margin:3px 0;" :class="{selectedGroupClass:selectedGroup.indexOf(item.title)>-1}" @click="selectItemGroup(item)">
                    <template v-if="item.title.indexOf(tableName)>-1">
                        <ChartSvg :type="item.dataType" style="    vertical-align: middle;"></ChartSvg>
                        &nbsp;<span :style="selectedGroup.indexOf(item.title)>-1?'width: calc(100% - 90px)':'width: calc(100% - 30px)'" style="
                        display: inline-block;
                        word-break: break-all;
                        vertical-align: middle;">{{item.title}}</span>
                        <!-- <Dropdown v-if="item.dataType=='DATE'" trigger="hover" style="margin-left: 20px">
                            <span href="javascript:void(0)">
                                [时间戳] {{dateTypeValue[item.key]?'按'+dateTypeValue[item.key].label+'计算':''}}
                            </span>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="dateTypeValue[item.key]={value:'hour',label:'时'}">时</DropdownItem>
                                <DropdownItem @click.native="dateTypeValue[item.key]={value:'day',label:'天'}">天</DropdownItem>
                                <DropdownItem @click.native="dateTypeValue[item.key]={value:'week',label:'周'}">周</DropdownItem>
                                <DropdownItem @click.native="dateTypeValue[item.key]={value:'month',label:'月'}">月</DropdownItem>
                                <DropdownItem @click.native="dateTypeValue[item.key]={value:'year',label:'年'}">年</DropdownItem>
                                <DropdownItem @click.native="dateTypeValue[item.key]=null">不选</DropdownItem>
                            </DropdownMenu>
                        </Dropdown> -->
                        <!-- <Icon v-if="selectedGroup.indexOf(item.key)<=-1" @click.stop="addItemGroup(item)" type="md-add" style="font-size:18px;float:right"/> -->
                        <Icon v-if="selectedGroup.indexOf(item.title)>-1" @click.stop="removeItemGroup(item)" class="colseHover" type="md-close" style="font-size:18px;float:right" />
                        <template v-if="selectedGroup.indexOf(item.title)>-1">
                            <span v-if="alias[item.title]" @click="fillInAlias=item.title" style="display: inline-block;padding:10px;">别名:{{alias[item.title]}}</span>
                            <span v-else @click="fillInAlias=item.title">[别名]</span>
                            <span v-if="item.title==fillInAlias" style="display: inline-block;padding:10px;">
                                <Input size="small" :value="alias[item.title]" search enter-button="确定" @on-search="(v)=>{onSearch(v,item)}"></Input>
                            </span>
                        </template>
                    </template>
                </p>
            </div>
            <div v-show="type==2">
                <h3>
                    <a @click="type=1" style="word-break: break-all;">
                    <Icon type="ios-arrow-back" />&nbsp;&nbsp;{{checkedItem.title}}
                    </a>
                </h3>
               <div>
                    <template v-for="(item,index) in data">
                        <template v-if="[2,3,5,7,8,9].indexOf(checkedItem.type)>-1">
                            <p v-if="item.dataType.toLowerCase()=='number'" :key="index" class="zhibiaohover" @click="selectItemDetail(item)">
                                    <ChartSvg :type="item.dataType" style="    vertical-align: middle;"></ChartSvg>
                                    &nbsp;<span style="width:calc(100% - 30px);display: inline-block;
                        word-break: break-all;
                        vertical-align: middle;">{{item.title}}</span>
                            </p>
                        </template>
                        <template v-if="[4,6].indexOf(checkedItem.type)>-1">
                            <p :key="index" class="zhibiaohover" @click="selectItemDetail(item)">
                                    <ChartSvg :type="item.dataType" style="    vertical-align: middle;"></ChartSvg>
                                    &nbsp;<span style="width:calc(100% - 30px);display: inline-block;
                        word-break: break-all;
                        vertical-align: middle;">{{item.title}}</span>
                            </p>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div style="text-align:center">
            <Button v-if="canSave" @click="addFilter" style="background:#88BF4D;color:#fff;vertical-align:text-top;border-radius:5px;">添加过滤器</Button>
            <Button v-else @click="$emit('update:showGl',false)" style="background:#88BF4D;color:#fff;vertical-align:text-top;border-radius:5px;">取消</Button>
        </div>
    </div>
</template>
<script>
import {ChartSvg} from '../../index.js'
export default {
    props:['data','showGl','filter'],
    components:{ChartSvg},
    data(){
        return{
            type:1,
            checkedItem:{dataType:''},
            filterType:'',
            filterType2:'',
            filterValue:'',
            timeValue:[],
            groupTerm:[],
            dateTypeValue:{},
            selectedGroup:[],
            alias:{},
            fillInAlias:'',
            tableName:''
        }
    },
    computed:{
        canSave(){
            if(this.type==2){
                if(this.filterType&&this.filterValue){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }
    },
    methods:{
        init(){
            this.type = 1
            this.checkedItem = {dataType:''}
            this.filterType = ''
            this.filterType2 = ''
            this.filterValue = ''
            this.timeValue = []
            this.groupTerm = []
            this.dateTypeValue = {}
            this.selectedGroup = []
            this.alias={}
            this.fillInAlias=''
        },
        hanlderName(name){
            if(name.indexOf('.')>-1){
                let lastIndex = name.lastIndexOf('.')
                return name.slice(0,lastIndex)+'\n'+name.slice(lastIndex)
            }else{
                return name
            }
        },
        reflashGetObject(){
            if(this.selectedGroup.length>0){
                let arr =[]
                for(let a of this.selectedGroup){
                    let obj = {column:a}
                    if(this.dateTypeValue[a]) obj.timeInterval =this.dateTypeValue[a].value
                    arr.push(obj)
                }
                this.$emit('reflashGetObject',this.filter,this.groupTerm,arr)
            }
            else
            this.$emit('reflashGetObject',this.filter,this.groupTerm)
        },
        selectItem(item){
            if(item.type==1){
                this.groupTerm.push({type:1,title:item.title})
                this.reflashGetObject()
            }else{
                this.type = 2
                this.filterValue = ''
            }
            this.checkedItem = item
        },
        selectItemDetail(item){
            let obj = {
                type:this.checkedItem.type,
                column:item.title,
                title:this.checkedItem.title +' [ '+item.title+' ]'
            }
            this.groupTerm.push(obj)
             this.reflashGetObject()
            this.type=1
        },
        removeItem(index){
            this.groupTerm.splice(index,1)
            this.reflashGetObject()
        },
        selectItemGroup(item){
            if(this.selectedGroup.indexOf(item.title)<=-1)
            this.selectedGroup.push(item.title)
            console.log(this.selectedGroup)
            this.reflashGetObject()
        },
        addItemGroup(item){
            this.selectedGroup.push(item.title)
            this.reflashGetObject()
        },
        removeItemGroup(item){
            let index = this.selectedGroup.indexOf(item.title)
                this.selectedGroup.splice(index,1)
                this.reflashGetObject()
        },
        formartDate(date){
            // console.log(typeof date)
            if(date){
                let sdate = new Date(date)
                // console.log(sdate)
                let year = sdate.getFullYear()
                let month = sdate.getMonth() + 1
                if(month<10) month = '0'+month
                let date = sdate.getDay()
                if(date<10) date = '0'+date
                let hours = sdate.getHours()
                if(hours<10) hours = '0'+hours
                let minutes = sdate.getMinutes()
                if(minutes<10) minutes = '0'+minutes
                let seconds = sdate.getSeconds()
                if(seconds<10) seconds = '0'+seconds
                return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds
            }else{
                return ''
            }
        },
        addFilter(){

        },
        onSearch(value,item){
            if(value){
                this.$set(this.alias,item.title,value)
                // this.alias[item.title] = value
                this.fillInAlias = ''
                this.reflashGetObject()
            }else{
                delete this.alias[item.title]
                this.fillInAlias = ''
                this.reflashGetObject()
            }
        }
    },
    watch:{
        filterValue(){
            // console.log(this.filterValue)
            // console.log(this.filterValue[0])
            if(this.checkedItem.dataType=='DATETIME'){
                this.timeValue[0] = this.formartDate(this.filterValue[0])
                this.timeValue[1] = this.formartDate(this.filterValue[1])
            }
        },
    }
}
</script>
<style scoped>
.zhibiaohover:hover{
  background:#88BF4D;
  color:#fff;
}
.selectedGroupClass{
    background:#88BF4D;
  color:#fff;
}
h3{
    padding: 6px 0;
    border-bottom: 1px solid #ddd;
}
.dropHover:hover{
    background:#EDF2F5;
}
.groupTerm{
    background:#88BF4D;
    color:#F8FFFF;
    padding:5px;
    border-radius: 5px;
    cursor: pointer;
    margin:3px 0;
}
.groupTerm:hover{
    background:#A0CC71;
    color:#F0FFFF;
}
.groupTerm .colse{
    color:#B8D994;
    float:right;
    font-size:16px;
}
.groupTerm .colse:hover{
    color:#fff;
}
p{
    margin:3px 0;
}
</style>