// generate app
const { createApp } = Vue
createApp({
    data () {
        return {
            // set up variables
            test: {
                test: 'hello'
            },
            test2: 'world'
        }
    },
    methods: {
    }
}).mount('#app')