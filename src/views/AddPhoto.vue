<template>
    <div>
        <header>
            <h2>Add Photo</h2>
        </header>
        <div class="uploader">
            <div class="form">
                <div class="img-wrapper">
                    <img src="/frame.svg" style="position: absolute; top: 0; left: 0; rotate: 0;"/>
                    <img src="/frame.svg" style="position: absolute; top: 0; right: 0; rotate: 90deg;"/>
                    <img src="/frame.svg" style="position: absolute; bottom: 0; left: 0; rotate: 270deg;"/>
                    <img src="/frame.svg" style="position: absolute; bottom: 0; right: 0; rotate: 180deg;"/>
                    <img v-if="uploaded_img" :src="img" alt="" class="preview">
                    <input v-else type="file" @change="onFileChanged($event)" accept="image/*" class="preview">
                </div>
                <editor-content :editor="(editor as any)" class="note" v-model="note"/>
            </div>
            <button class="upload-btn" style="font-family: 'IBM Plex Mono', monospace;" @click="upload">{{  uploadbtn }}</button>
        </div>
    </div>
</template>

<style>
.uploader {
    padding: 18px 1.68rem; 
}
.form {
    display: flex;
    flex-flow: row nowrap;
    gap: 1.68rem;
}
.img-wrapper {
    min-height: 120px;
    position: relative;
    flex-grow: 1;
    flex-basis: 0;
}
.preview {
    width: 100%;
    height: 100%;
}
input.preview {
    opacity: 0;
}
.note {
    flex-grow: 1;
    flex-basis: 0;
}
.note .ProseMirror {
    min-height: 100%;
}

.upload-btn {
    width: 100%;
    border-radius: 0;
    border-top: 1px solid #262626; 
    border-bottom: 1px solid #262626; 
    border-left: none;
    border-right: none;
    background-color: #fdfdfd;
    font-size: 1rem;
    margin: 1rem 0;
}

.upload-btn:hover {
    cursor: pointer;
    text-decoration: underline;
}

</style>

<script lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { time } from 'console';

export default {
    name: "Add Photo",
    props: ["passcode"],
    components: {
        EditorContent
    },
    data() {
        return {
            editor: null,
            note: "",
            img: "",
            uploaded_img: false,
            uploadbtn: "upload"
        }
    },
    methods: {
        upload: async function() {
            if(this.uploadbtn == "upload") {
                const id = `${Date.now()}`;
                const photores = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${id}/photo?passcode=${this.passcode}`, {
                    method: "POST",
                    body: this.img
                });
                const noteres = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${id}/note?passcode=${this.passcode}`, {
                    method: "POST",
                    body: (this.editor as any).getHTML()
                });
                const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${id}?passcode=${this.passcode}`, {
                    method: "POST",
                    body: JSON.stringify({ photo: photores, note: noteres })
                })
                if(photores.status == 200 && noteres.status == 200 && res.status == 200) {
                    console.log("uploaded successfully");
                    (this.editor as any).content = "<p></p>";
                    this.img = "";
                    this.uploaded_img = false;
                    this.uploadbtn = "uploaded successfully!";
                    setTimeout(() => {
                        this.uploadbtn = "upload";
                    }, 2000)
                }
            }
        },
        onFileChanged: function(event: any) {
            console.log(event);
            const target = event.target as HTMLInputElement;
            if (target && target.files) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.img = e.target.result;
                    this.uploaded_img = true;
                }
                reader.readAsDataURL(target.files[0]);
            }

        }
    },
    mounted() {
        this.editor = new Editor({
        content: '<p></p>',
        extensions: [
            StarterKit,
        ],
        }) as any;
    },
    beforeUnmount() {
        (this.editor as any).destroy()
    },
}

</script>