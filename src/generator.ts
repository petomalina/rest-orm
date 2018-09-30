import { Model, ModelField, Relationship } from './models'

export function generateFile(models: Model[]): string {
    return `import * as M from './models'
import { Observable, Subscriber } from 'rxjs'
import axios from 'axios'
import { stringify } from 'querystring'


let API_URL = ''

export function setApiUrl(url: string) {
    API_URL = url
}
${models.map(m => generateModel(m)).join('\n')}`
}

function generateModel(model: Model): string {
    const endpoint = pluralize(model.name)

    return `
export namespace ${endpoint} {

    function endpoint(): string {
        return \`\${API_URL}/${endpoint}\`
    }
    
    export function create(models: M.${model.name}[]): Observable<M.${model.name}[]> {
        return new Observable(sub => {
            const value = axios.post(endpoint(), models)
                .then(value => {
                    sub.next(value.data)
                })
            
        })
    }

    export function list(query: any): Observable<M.${model.name}[]> {
        return new Observable(sub => {
            axios.get(\`\${endpoint()}?\${stringify(query)}\`)
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    export function remove(ids: string[]): Observable<M.${model.name}[]> {
        return new Observable(sub => {
            axios.delete(endpoint())
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    ${model.relationships.map(r => generateRelationship(model, r)).join('\\n')}
}`
}

function generateRelationship(model: Model, rel: Relationship): string {
    return `
    class With${rel.modelName}Subscriber extends Subscriber<M.${model.name}[]> {
        constructor(sub: Subscriber<M.${model.name}>) {
            super(sub)
        }
            
        _next(${pluralize(model.name)}: M.${model.name}[]) {
            const relationshipEndpoint = \`\${API_URL}/${pluralize(rel.modelName)}\`;
            
            const query: string = ${pluralize(model.name)}.reduce((acc: string[], ${uncapitalize(model.name)}) => {
                acc.push(\`${uncapitalize(model.name)}Id=\${${uncapitalize(model.name)}.id}\`)
                return acc
            }, []).join('&')
            
            axios.get(\`\${relationshipEndpoint}?\${query}\`)
                .then(value => {
                    (<any>this.destination).next(value.data)
                })
        }
    }
    
    export const with${rel.modelName}s = (src: Observable<M.${model.name}[]>) => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new With${rel.modelName}Subscriber(sub))
            }
        })
    }
    `
}

function pluralize(name: string): string {
    return `${uncapitalize(name)}s`
}

function uncapitalize(name: string): string {
    return `${name[0].toLowerCase() + name.slice(1)}`
}