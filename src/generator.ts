import { Model, ModelField, Relationship } from './models'

export function generateFile(models: Model[]): string {
    return `
    import * as models from './models'
    import { Observable, Subscriber } from 'rxjs'
    import { map } from 'rxjs/operators'
    
    ${models.map(m => generateModel(m)).join('\n')}`
}

function generateModel(model: Model): string {
    return `
    namespace ${model.name[0].toLowerCase() + model.name.slice(1)} {
    
        function create(models: ${model.name}[]): Observable<${model.name}[]> {
        
        }
    
        function list(ids): Observable<${model.name}[]> {
        
        }
        
        function delete(ids): Observable<${model.name}[]> {
        
        }
        
        ${model.relationships.map(r => generateRelationship(r)).join('\n')}
    }`
}

function generateRelationship(rel: Relationship): string {
    return `
    class With${rel.modelName}Subscriber extends Subscriber {
        constructor(sub) {
            super(sub)
        }
            
        _next(value) {
            this.destination.next(value)
        }
    }
    
    export const with${rel.modelName} = source => {
        source.lift({
            call(sub, source) => {
                source.subscribe(new With(${rel.modelName}Subscriber(sub))
            }
        })
    }
    `
}