<!--
功能：用户头像设置
日期：2022-06-16
-->
<template>
    <div class="avatar-container pall-30" v-loading="loading">
        <div class="maintain">
            <div class="editor">
                <vueCropper ref="cropper" :img="model.img" :autoCrop="true" :autoCropWidth="200" :autoCropHeight="200" :fixed="true" :fixedBox="true" @realTime="previewCallback" outputType="png"></vueCropper>
            </div>
            <div class="preview">
                <div>当前头像</div>
                <div class="preview-image">
                    <img :src="userStore.avatar" alt="" @error="onAvatarError($event)">
                </div>
                <div>新头像</div>
                <div v-if="preview.style!==null && preview.data!==null" class="preview-image">
                    <div :style="preview.style">
                        <div :style="preview.data.div">
                            <img :src="preview.data.url" :style="preview.data.img" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="toolbar">
            <div class="upload-container">
                <el-button type="primary" @click="fileInput!.click();"><i class="bi bi-image el-icon--left"></i>选择图片</el-button>
                <el-button type="primary" @click="saveAvatar"><i class="bi bi-upload el-icon--left"></i>保存头像</el-button>
                <input ref="fileInput" type="file" @change="onChooseFile" accept="image/jpg,image/jpeg,image/png">
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import 'vue-cropper/dist/index.css'
import {API_PATH_DEFAULT} from "@/constants/api-path"
import {VueCropper} from "vue-cropper"
import {ref, reactive, Ref} from "vue"
import {ElMessage as messageTip, ElMessageBox as messageBox} from "element-plus"
import {http} from '@/utils/http'
import {httpErrorHandler} from "@/utils/error"
import {useUserStore} from '@/pinia/user'
import defaultAvatar from '@/assets/images/icons/avatar-default.png'

const userStore = useUserStore()

//加载中
const loading = ref(false)
//事件
const emit = defineEmits(['close'])
//剪裁DOM
const cropper: any = ref(null)
//文件浏览框DOM
const fileInput: Ref<HTMLInputElement | null> = ref(null)
//模型
const model: {
    //图片地址
    img: string | null
} = reactive({
    img: null
})
//预览
const preview: {
    //图形数据
    data: any,
    //样式
    style: any
} = reactive({
    data: null,
    style: null
})

/**
 * 预览
 */
const previewCallback = (data: any) => {
    preview.style = {
        width: data.w + "px",
        height: data.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 200 / Math.max(data.w, data.h)
    }
    preview.data = data
}

/**
 * 头像加载错误
 */
const onAvatarError = (e: Event) => {
    (e.target as HTMLImageElement).src = defaultAvatar
}

/**
 * 文件变更
 */
const onChooseFile = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files!.length === 0) {
        messageTip.error('请选择图片')
        return
    }
    const file = files![0]
    if (file.size === 0) {
        messageTip.error('图片异常')
        return
    }
    model.img = URL.createObjectURL(file)
}

/**
 * 保存头像
 */
const saveAvatar = () => {
    try {
        cropper.value!.getCropBlob((data: Blob) => {
            const formData = new FormData()
            formData.append('file', data, '头像.png')
            loading.value = true
            http.post(
                '/upload/avatar',
                formData
            ).then((response) => {
                if (response.isOk) {
                    userStore.$patch((state) => {
                        state.avatar = API_PATH_DEFAULT + response.data.data.url
                    })
                    emit('close')
                }
            }).catch(httpErrorHandler).finally(() => {
                loading.value = false
            })
        })
    } catch (e) {
        messageBox.alert('图片有误', '提示')
    }
}
</script>

<style lang="scss" scoped>
.avatar-container {
    .maintain {
        display: flex;
        gap: 20px;
        justify-content: center;

        .editor {
            width: 440px;
            height: 440px;
            border: 1px solid #aaa;
            box-sizing: border-box;
        }

        .preview {
            .preview-image {
                border: 1px solid #aaa;
                box-sizing: border-box;
                width: 200px;
                height: 200px;

                img {
                    width: 100%;
                }
            }
        }
    }

    .toolbar {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        gap: 20px;
    }
}

.upload-container {
    margin-left: 10px;

    input[type=file] {
        display: none;
    }
}
</style>
