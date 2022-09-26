// import jsonTest from 'projectassets.json'
// console.log(jsonTest)
// export default {
//     data() {
//         return {
//             myJson: json
//         }
//     }
// }
// projectsJson = fetch('projectassets.json').json()
// fetch('projectassets.json').then(res => projectsJson = res.json())
// generate app

// import jsonObject from 'projectassets.json'



const { createApp } = Vue
createApp({
    data () {
        return {
            projectAssets: [],
        }
    },
    created() {
        axios ({
            method: 'get',
            url: 'projectassets.json',
        }).then(res => {
            let resData = Object.values(res.data)
            Object.values(res.data).forEach((_, i) => {
                if (i % 2 == 0) {
                    this.projectAssets.push([resData[i], resData[i + 1]])
                }
            })
            // console.log(resData)
            console.log(this.projectAssets)
            });
        
    },
    methods: {
        test() {
            console.log('boop!')
        }
    }
}).mount('#app')


// add overflow:hidden; to main on popup, remove on close & nav interaction
// ^^^ consider if this is good for UX

// add close button and prev/next buttons (with project names)

