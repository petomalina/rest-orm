import { Model, ModelField, Relationship } from './models'

export function generateFile(models: Model[]): string {
    return `
import * as M from './models'
import { Observable, Subscriber } from 'rxjs'
import axios from 'axios'
    
${models.map(m => generateModel(m)).join('\n')}`
}

function generateModel(model: Model): string {
    return `
export namespace ${model.name[0].toLowerCase() + model.name.slice(1)} {
    export class API {
        constructor(private url: string) {}
    
        create(models: M.${model.name}[]): Observable<M.${model.name}[]> {
            return new Observable(sub => {
                const value = axios.post(this.url, models)
                    .then(value => {
                        sub.next(value.data)
                    })
                
            })
        }
    
        list(ids: string[]): Observable<M.${model.name}[]> {
            return new Observable(sub => {
                axios.get(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
        
        delete(ids: string[]): Observable<M.${model.name}[]> {
            return new Observable(sub => {
                axios.delete(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
    }
    
    ${model.relationships.map(r => generateRelationship(model, r)).join('\\n')}
}`
}

function generateRelationship(model: Model, rel: Relationship): string {
    return `
    class With${rel.modelName}Subscriber extends Subscriber<M.${model.name}> {
        constructor(sub: Subscriber<M.${model.name}>) {
            super(sub)
        }
            
        _next(value: M.${model.name}) {
            (<any>this.destination).next(value)
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