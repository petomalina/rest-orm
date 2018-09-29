export interface Model {
    name: string

    fields: ModelField[]
    relationships: Relationship[]
}

export interface ModelField {
    name: string
    type: string
}

export interface Relationship {
    modelName: string
    form: string
}