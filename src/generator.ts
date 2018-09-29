import { Model, ModelField, Relationship } from './models'

export function generateFile(models: Model[]): string {
    return `
    import * as models from './models'
    import { Observable } from 'rxjs'
    import { map } from 'rxjs/operators'
    
    ${models.map(m => generateModel(m)).join('\n')}`
}

function generateModel(model: Model): string {
    return `
    function ${model.name[0].toLowerCase() + model.name.slice(1)}s() {
    }`
}

function generateRelationship(rel: Relationship): string {

}