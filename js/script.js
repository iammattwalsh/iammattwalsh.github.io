const { createApp } = Vue
createApp({
    data () {
        return {
            projectAssets: [],
            projectOpen: false,
            projectTileTotal: 0,
            projectTileSize: 240,
            projectTilePerPage: 0,
            projectPageHolder: null,
            projectPagesTotal: 0,
            projectPageCurrent: 1,
        }
    },
    created() {
        this.debounce(this.getDimensions())
        window.addEventListener('resize', this.debounce(this.getDimensions))
    },
    mounted() {
        this.projectPageHolder = document.getElementById('project-holder')
    },
    methods: {
        debounce(func, time = 250) {
            let timer
            return function(event) {
                if(timer) clearTimeout(timer)
                timer = setTimeout(func, time, event)
            }
        },
        getDimensions() {
            let winX = window.innerWidth - 40 // 20 for each margin
            let winY = window.innerHeight - 180 // 20 for top margin, 40 for bottom margin/nav, 60 for arrows, 60 for hover overflow
            if (winX > 600 && winY > 550) {
                this.projectTileSize = 240
            } else {
                this.projectTileSize = 170
            }
            this.projectTilePerPage = Math.floor(winX / this.projectTileSize) * Math.floor(winY / this.projectTileSize)
            // console.log(`tiles tot: ${this.projectTilePerPage}`)
            this.getAssets()
        },
        getAssets() {
            this.projectAssets = []
            axios ({
                method: 'get',
                url: 'projectassets.json',
            }).then(res => {
                this.projectTileTotal = Object.values(res.data).length
                this.projectPagesTotal = Math.ceil(this.projectTileTotal / this.projectTilePerPage)
                this.projectPageCurrent = 1
                this.projectPageHolder.scrollLeft = 0
                let j = 0
                Object.values(res.data).forEach((_,i) => {
                    if (i % this.projectTilePerPage == 0) {
                        this.projectAssets.push([])
                        for (var k = 0; k < this.projectTilePerPage; k++) {
                            if (i + k < this.projectTileTotal)
                            this.projectAssets[j].push(Object.values(res.data)[i + k])
                        }
                        j++
                    }
                })
            })
        },
        changeProjectPage(direction) {
            if (direction == 'r' && this.projectPageCurrent < this.projectPagesTotal) {
                this.projectPageCurrent ++
            } else if (direction == 'l' && this.projectPageCurrent > 1) {
                this.projectPageCurrent --
            }
            this.projectPageHolder.scrollLeft = this.projectPageHolder.clientWidth * (this.projectPageCurrent - 1)
        },
        whichProject(thisProject) {
            console.log(thisProject.short)
        },
        projectFade() {
            this.projectOpen = !this.projectOpen
        }
    }
}).mount('#app')


// on scrolling highlight close button on projects page

// add close button and prev/next buttons (with project names)