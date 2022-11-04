export class ProjectModel {
    id: string = ""
    components: Array<ComponentModel> = []
    papers: Array<PaperModel> = []
}

export class ComponentModel {
    x!: number
    y!: number
    z!: number
    from!: string
}

export class PaperModel {
    id!: string
    type!: string
}

export class PaperRectangleModel extends PaperModel {
    length!: number
    width!: number
    height!: number
}

export class PaperPathModel extends PaperModel {
    path!: Array<Array<number>>
}