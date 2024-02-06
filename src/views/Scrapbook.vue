<template>
    <div>
        <header>
            <h2>Scrapbook <span style="float: right"><span @click="prevpage">{{ "<" }}</span>{{ pagenum }}<span @click="nextpage">{{ ">" }}</span></span></h2>
        </header>
        <div class="photos">
            <Entry v-for="entry in entries" :id="entry" :passcode="passcode" class="entry" />
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
    methods: {
        nextpage: function() {
            if(this.entries.length >= 4) {
                const to = parseInt(this.pagenum as string) + 1
                this.$router.push(`/scrapbook/${to}`);
            }
        },
        prevpage: function() {
            const to = parseInt(this.pagenum as string) - 1
            if(to <= 0) this.$router.push(`/scrapbook/${0}`)
            else this.$router.push(`/scrapbook/${to}`);
        },
    },
    mounted() {
        console.log("fetching page");
        const fetchPage = async () => {
            const res = await fetch(`https://dearpriya-api.0xtimmy.workers.dev/page/${this.pagenum}?passcode=${this.passcode}`, { method: "GET" }) as any;
            this.entries = await res.json();
        };
        fetchPage();
  },
}
</script>