<template>
<quillEditor v-model="content" :options="options" />
</template>

<script>
import {
    quillEditor
} from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
export default {
    name: 'VueQuillEditor',
    components: {
        quillEditor
    },
    props: {
        value:{

        },
        options: {
            default: function () {
                return {
                    theme: 'snow',
                    boundary: document.body,
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{
                                'header': 1
                            }, {
                                'header': 2
                            }],
                            [{
                                'list': 'ordered'
                            }, {
                                'list': 'bullet'
                            }],
                            [{
                                'script': 'sub'
                            }, {
                                'script': 'super'
                            }],
                            [{
                                'indent': '-1'
                            }, {
                                'indent': '+1'
                            }],
                            [{
                                'direction': 'rtl'
                            }],
                            [{
                                'size': ['small', false, 'large', 'huge']
                            }],
                            [{
                                'header': [1, 2, 3, 4, 5, 6, false]
                            }],
                            [{
                                'color': []
                            }, {
                                'background': []
                            }],
                            [{
                                'font': []
                            }],
                            [{
                                'align': []
                            }],
                            ['clean'],
                            // ['link', 'image', 'video']
                        ]
                    },
                    placeholder: 'Insert text here ...',
                    readOnly: false
                }
            }
        }
    },
    data() {
        return {
            content: ''
        }
    },
    model: {
        prop: 'value',
        event: 'returnBack'
    },
    mounted(){
        if (this.value == this.content || typeof this.value != 'string') return
            else {
                this.content = this.value
            }
    },
    watch: {
        value() {
            // console.log(typeof this.codes)
            if (this.value == this.content || typeof this.value != 'string') return
            else {
                this.content = this.value
            }
        },
        content() {
            this.$emit('returnBack', this.content);
        }
    }
}
</script>
