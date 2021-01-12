<style>
  .upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100px;
    height: 100px;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
    width: 98px;
    height: 98px;
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload-list-img {

  }

  .upload-list-img .img {
    max-width: 200px;
    max-height: 200px;

  }
</style>
<template>
  <div>
    <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
      <Poptip placement="top-start" width="360px" trigger="hover">
        <template v-if="item.status === 'finished'">
          <template v-if="['jpg','jpeg','png','gif'].indexOf(item.url.split('.')[item.url.split('.').length - 1])>-1">
            <img :src="item.url">
          </template>
          <template v-else>
            <h3 style="width: 100px;
            height: 100px;
            line-height: 20px;
            padding-top: 10px;
            word-break: break-all;">
              {{item.url.split('/')[item.url.split('/').length-1]}}
            </h3>
          </template>
          <div class="upload-list-cover">
            <Poptip confirm title="您确认删除？" @on-ok="handleRemove(item)" placement="right-start" transfer>
              <Icon type="ios-trash-outline"></Icon>
            </Poptip>
            <Icon type="ios-eye-outline" @click.native="showPhotoViewer(item,index)"></Icon>
            <Icon type="ios-download-outline" @click.native="getImg(item)" />
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
        <div class="upload-list-img" slot="content">
          <img @click="showPhotoViewer(item,index)" :src="item.url">
        </div>
      </Poptip>
    </div>

    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="uploadFormat"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      :on-error="handleError"
      with-credentials
      type="drag"
      :headers="postHeaders"
      :action="uploadUrl"
      style="display: inline-block;width:100%">
      <div style="height:48px;line-height: 58px;text-align:center">
        <Icon type="ios-link-outline" size="24" />
      </div>
    </Upload>
    <PhotoViewer :picIds="value" :curIndex="curIndex" v-model="photoViewerVisible"></PhotoViewer>
  </div>

</template>
<script>
  import PhotoViewer from '../common/PhotoViewer';
  import utils from '../../utils/common';

  export default {
    props: {
      value: {},
      max: {
        default: 1
      },
      maxSize: {
        default: 2048
      },
      uploadFormat:{
        type:Array,
        default:function(){
          return ['jpg','jpeg','png','gif']
        }
      }
    },
    data () {
      return {
        defaultList: [],
        imgName: '',
        uploadUrl: window.IPS.ip+'/api/sys/attach/uploadImg',
        visible: false,
        uploadList: [],
        imagesValue: [],
        photoViewerImg: null,
        photoViewerVisible: false,
        curIndex: 0,
        postHeaders: {}
      };
    },
    methods: {
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      showPhotoViewer (item, index) {
        this.curIndex = index;
        this.photoViewerImg = item;
        this.photoViewerVisible = true;
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
        this.imagesValue.splice(this.imagesValue.indexOf(file.url), 1);
        this.$emit('input', this.imagesValue.toString());
      },
      handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        this.imagesValue.push(res.data.path);
        file.url = this.imagesValue;
        // if(file.name.indexOf('.png')>-1||file.name.indexOf('.jpg')>-1||file.name.indexOf('.jpeg')>-1||file.name.indexOf('.gif')>-1)
        // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        this.$emit('input', this.imagesValue.toString());
      },
      handleError(){
        this.$Message.error('上传失败！')
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 '+this.uploadFormat+' 格式的图片。'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      },
      handleBeforeUpload (res, file) {
        console.log(res)
        console.log(file)
        this.postHeaders.Authorization = OperatorUtils.getToken();
        const check = this.uploadList.length < this.max;
        if (!check) {
          this.$Message.warning('最多只能上传 ' + this.max + ' 张图片。');
        }
        return check;
      },
      //下载
      getImg(item){
        let name = item.url.split('/')[item.url.split('/').length-1]
        window.open(window.IPS.ip+'/api/sys/attach/getImg?fileName='+name+'&token='+OperatorUtils.getToken(),'_blank')
        // this.$http.apiGet(window.IPS.ip+'/api/sys/attach/getImg?fileName='+name)
        // .then(res=>{
        //         window.location = res.request.responseURL;
        //     })

      }
    },
    watch: {
      value (newVal, oldVal) {
        if (newVal != null) {
          this.imagesValue = [];
          this.uploadList = [];
          let arr = newVal.toString().split(','); //字符分割
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].length > 0) {
              this.imagesValue.push(arr[i]);
              let file = {status: 'finished', id: i, name: i, url: arr[i]};
              this.uploadList.push(file);
            }
          }
        } else {
          this.imagesValue = [];
          this.uploadList = [];
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    components: {PhotoViewer}
  };
</script>

