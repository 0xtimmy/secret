<template>
    <div>
        <img @click="open" class="photo" :src="img">
        <div v-if="opened" class="expanded-view" @click="close">
            <div @click.stop class="img-wrapper">
                <img class="photo" :src="img" :style="{ 'rotate': `${rotation}deg`}">
            </div>
            <editor-content :editor="(editor as any)" class="note" v-model="note" @click.stop/>
        </div>
    </div>
</template>

<style>

.photo {
    max-width: 100%;
    max-height: 100%;
}

.expanded-view {
    position: fixed;
    top: 0;
    left: 0;
    width: 80vw;
    height: 80vh;
    background-color: #26262611;
    padding: 10vh 10vw;
    z-index: 1;
    display: flex;
    flex-flow: row nowrap;
}

.img-wrapper {
    padding: 1.68rem;
    display: flex;
    flex-grow: 1;
    position: relative;
    justify-content: center;
    align-items: center;
}

.note {
    background-color: #fdfdfd;
    max-width: 40ch;
    width: 40ch;
    z-index: 10;
}

.note .ProseMirror {
    min-height: 100%;
}

</style>

<script lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
    name: "Entry",
    components: { EditorContent },
    props: ["id", "passcode"],
    data() {
        return {
            img: "",
            note: "",
            opened: false,
            rotation: 0,
            editor: null,
        }
    },
    methods: {
        open: function() {
            this.opened = true;
            this.rotation = (Math.random() * 30) - 15;
        },
        close: async function() {
            const noteres = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${this.id}/note?passcode=${this.passcode}`, {
                method: "POST",
                body: (this.editor as any).getHTML()
            });
            this.opened = false;
        },
    },
    created() {
        const getPhoto = async () => {
            const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${this.id}/photo?passcode=${this.passcode}`, { method: "GET" });
            this.img = await res.text();
        }
        getPhoto();
    },
    mounted() {
        const getNote = async () => {
            const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/entry/${this.id}/note?passcode=${this.passcode}`, { method: "GET" });
            this.editor = new Editor({
            content: await res.text(),
            extensions: [
                StarterKit,
            ],
            }) as any;
        }
        getNote();
    },
    beforeUnmount() {
        (this.editor as any).destroy()
    },
}
</script>