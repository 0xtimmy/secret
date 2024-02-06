<template>
    <div>
        <header>
            <h2>Scrapbook <span style="float: right">{{ pagenum }}</span></h2>
        </header>
        <div class="photos">
            <Entry v-for="entry in Object.keys(entries)" :id="entry" :passcode="passcode" class="entry" />
        </div>
    </div>
</template>

<style>

.photos {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    gap: 18px;
    padding: 10px 18px;
}

.entry {
    position: relative;
    flex-grow: 1;
    flex-basis: calc(50% - 18px);
}

</style>

<script lang="ts">
import Entry from "../components/Entry.vue"

export default {
    name: "Scrapbook",
    props: ["passcode"],
    components: { Entry },
    data() {
        return {
            entries: []
        }
    },
    computed: {
        pagenum: function() {
            return this.$route.params["pagenum"]
        },
    },
    mounted() {
        const fetchPage = async () => {
            const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/page/${this.pagenum}?passcode=${this.passcode}`, { method: "GET" }) as any;
            this.entries = JSON.parse(await res.json());
            console.log(this.entries);
        };
        fetchPage();
  },
}
</script>