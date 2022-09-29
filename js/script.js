
const { createApp } = Vue
createApp({
    data () {
        return {
            rawAssets: [],
            projectAssets: {},
            projectPages: [],
            projectTileTotal: 0,
            projectTileSize: 240,
            projectTilePerPage: 0,
            projectPageHolder: null,
            projectPagesTotal: 1,
            projectPageCurrent: 1,
            projectOpen: false,
            projectCurrent: {},
            projectNext: {},
            projectPrev: {},
            projectDetailFade: false,
        }
    },
    created() {
    },
    mounted() {
        this.projectPageHolder = document.getElementById('project-holder')
        this.debounce(this.getDimensions())
        window.addEventListener('resize', this.debounce(this.getDimensions))
        this.getAssets()
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
            if (winX > 1440) {winX = 1440}
            let winY = window.innerHeight - 180 // 20 for top margin, 40 for bottom margin/nav, 60 for arrows, 60 for hover overflow
            if (winX > 600 && winY > 550) {
                this.projectTileSize = 240
            } else {
                this.projectTileSize = 170
            }
            this.projectTilePerPage = Math.floor(winX / this.projectTileSize) * Math.floor(winY / this.projectTileSize)
            if (this.projectPages.length != 0) {this.sortProjectAssets()}
        },
        getAssets() {
            axios ({
                method: 'get',
                url: 'projectassets.json',
            }).then(res => {
                this.rawAssets = Object.values(res.data)
                Object.values(res.data).forEach(e => {
                    this.projectAssets[e.short] = e
                })
                this.projectTileTotal = this.rawAssets.length
                this.sortProjectAssets()
            })
        },
        sortProjectAssets() {
            this.projectPages = []
            this.projectPagesTotal = Math.ceil(this.projectTileTotal / this.projectTilePerPage)
            this.projectPageCurrent = 1
            this.projectPageHolder.scrollLeft = 0
            let j = 0
            this.rawAssets.forEach((_,i) => {
                if (i % this.projectTilePerPage == 0) {
                    this.projectPages.push([])
                    for (var k = 0; k < this.projectTilePerPage; k++) {
                        if (i + k < this.projectTileTotal) {
                            this.projectPages[j].push(this.rawAssets[i + k].short)
                        }
                    }
                    j++
                }
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
            let projectKeys = Object.keys(this.projectAssets)
            let thisProjectIndex = projectKeys.indexOf(thisProject)
            this.projectCurrent = this.projectAssets[thisProject]
            this.projectCurrent.img = 'projectassets/' + this.projectCurrent.short + '.png'
            this.projectCurrent.imgsm = 'projectassets/' + this.projectCurrent.short + 'sm.png'
            if (thisProjectIndex < projectKeys.length - 1) {
                this.projectNext = this.projectAssets[projectKeys[thisProjectIndex + 1]]
            } else {
                this.projectNext = false
            }
            if (thisProjectIndex > 0) {
                this.projectPrev = this.projectAssets[projectKeys[thisProjectIndex - 1]]
            } else {
                this.projectPrev = false
            }
        },
        projectFade() {
            this.projectOpen = !this.projectOpen
        },
        projectTrans(transitionTo) {
            if (transitionTo) {
                this.projectDetailFade = true
                setTimeout(() => {
                    this.whichProject(transitionTo)
                    this.projectDetailFade = false
                },500)
            }
        },
    }
}).mount('#app')