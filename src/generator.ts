import { Model, ModelField, Relationship } from './models'

export function generateFile(models: Model[]): string {
    return `
import * as M from './models'
import { Observable, Subscriber } from 'rxjs'
    
${models.map(m => generateModel(m)).join('\n')}`
}

function generateModel(model: Model): string {
    return `
namespace ${model.name[0].toLowerCase() + model.name.slice(1)} {
    export class API {
        constructor(private url: string) {}
    
        create(models: M.${model.name}[]): Observable<M.${model.name}[]> {
            return new Observable()
        }
    
        list(ids: string[]): Observable<M.${model.name}[]> {
            return new Observable()
        }
        
        delete(ids: string[]): Observable<M.${model.name}[]> {
            return new Observable()
        }
    }
    
    ${model.relationships.map(r => generateRelationship(r)).join('\\n')}
}`
}

function generateRelationship(rel: Relationship): string {
    return `
    class With${rel.modelName}Subscriber extends Subscriber<M.${rel.modelName}> {
        constructor(sub: Subscriber<M.${rel.modelName}>) {
            super(sub)
        }
            
        _next(value) {
            this.destination.next(value)
        }
    }
    
    export const with${rel.modelName}s = (src: Observable<M.${rel.modelName}>) => {
        src.lift({
            call(sub, source) {
                source.subscribe(new With${rel.modelName}Subscriber(sub))
            }
        })
    }
    `
}