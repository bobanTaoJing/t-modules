<template>
<div class="slid">
    <Menu v-if="reflash" :theme="'dark'" accordion :width="width" :active-name="activeName">
        <template v-for="(item,index) in menuData">
            <template v-if="item.children">
                <Submenu :name="item.url" :key="index">
                    <template slot="title">
                        <Icon :style="hidden?'position:relative;left:-10px':''" :type="item.icon" />
                        <span v-show="!hidden">
                            {{item.title}}
                        </span>
                    </template>
                    <MenuItem :name="item2.url" :to="item2.url" v-for="(item2,index2) in item.children" :key="index+'-'+index2">
                    <Icon :style="hidden?'position:relative;left:-10px':''" :type="item2.icon" />
                    <span v-show="!hidden">
                            {{item2.title}}
                        </span>
                    </MenuItem>
                </Submenu>
            </template>
            <template v-else>
                <MenuItem :name="item.url" :to="{path:item.url,query:{name:item.title}}" :key="index">
                <Icon :style="hidden?'position:relative;left:-10px':''" :type="item.icon" />
                <span v-show="!hidden">
                            {{item.title}}
                        </span>
                </MenuItem>
            </template>
        </template>
    </Menu>
</div>
</template>

<script>
import {
    menuData
} from './menuData'
import {
    Menu,
    MenuGroup,
    MenuItem,
    Submenu
} from 'view-design';
import {
    deepCopyData
} from '../../utils/tools'
export default {
    components: {
        Menu,
        MenuGroup,
        MenuItem,
        Submenu
    },
    props: {
        width: {
            type: String,
            default: '200px'
        },
        hidden:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            activeName: '',
            menuData: [],
            reflash: true
        }
    },
    computed: {
        menu: {
            get: function () {
                return this.$store.getters.userInfo.pmenu
            },
        },
        rname: {
            get: function () {
                return this.$store.getters.userInfo.rname
            },
        },
    },
    created() {
        this.handlerMenu()
        this.activeName = this.$route.path

    },
    methods: {
        handlerMenu() {
            this.menuData = []
            if(window.ZCGL.menhu){
                let cmenuData = deepCopyData(this.menu)
                this.menuData = this.constructTree(cmenuData,'name')
                console.log(this.menuData)
            }else{
                let cmenuData = deepCopyData(menuData)
                this.menuData = this.constructTree(cmenuData,'name')
                console.log(this.menuData)
                this.$nextTick(() => {
                    this.reflash = false
                    setTimeout(() => {
                        this.reflash = true
                    }, 10)
                })
            }
        },
        constructTree: function (data, name, expand) {
            // console.log(data)
            for (let i in data) {
                if (data[i].parentId > 0) {
                    for (let j in data) {
                        if (data[j].id == data[i].parentId) {
                            if (data[j].children == null) {
                                data[j].children = [];
                            }
                            data[j].children.push(data[i]);
                        }
                    }
                } else {
                    if (expand == true) {
                        data[i].expand = true;
                    }
                }
            }
            // 过滤已经子类
            let result = [];
            for (let i = 0; i < data.length; i++) {
                data[i].title = data[i][name];
                if (data[i].parentId == null || data[i].parentId == 0) {
                    // console.log("data["+i+"]:" + data[i].children);
                    result.push(data[i]);
                }
            }
            // console.log(result)
            return result;
        },
    },
    watch: {
        $route() {
            this.activeName = this.$route.path
        },
        pmenu() {
            this.handlerMenu()
        }
    }
}
</script>

<style>
/* .slid{
        background:#074444;
        box-shadow: 1px 1px 5px 5px #E9E9E9;
    } */
</style>
