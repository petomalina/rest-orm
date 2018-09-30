import * as M from './models'
import { Observable, Subscriber } from 'rxjs'
import axios from 'axios'
import { stringify } from 'querystring'


let API_URL = ''

export function setApiUrl(url: string) {
    API_URL = url
}

export namespace users {

    function endpoint(): string {
        return `${API_URL}/users`
    }
    
    export function create(models: M.User[]): Observable<M.User[]> {
        return new Observable(sub => {
            const value = axios.post(endpoint(), models)
                .then(value => {
                    sub.next(value.data)
                })
            
        })
    }

    export function list(query: any): Observable<M.User[]> {
        return new Observable(sub => {
            axios.get(`${endpoint()}?${stringify(query)}`)
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    export function remove(ids: string[]): Observable<M.User[]> {
        return new Observable(sub => {
            axios.delete(endpoint())
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    class WithBookSubscriber extends Subscriber<M.User[]> {
        constructor(sub: Subscriber<M.User>) {
            super(sub)
        }
            
        _next(users: M.User[]) {
            const relationshipEndpoint = `${API_URL}/books`;
            
            const query: string = users.reduce((acc: string[], user) => {
                acc.push(`userId=${user.id}`)
                return acc
            }, []).join('&')
            
            axios.get(`${relationshipEndpoint}?${query}`)
                .then(value => {
                    (<any>this.destination).next(value.data)
                })
        }
    }
    
    export const withBooks = (src: Observable<M.User[]>) => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new WithBookSubscriber(sub))
            }
        })
    }
    
}

export namespace books {

    function endpoint(): string {
        return `${API_URL}/books`
    }
    
    export function create(models: M.Book[]): Observable<M.Book[]> {
        return new Observable(sub => {
            const value = axios.post(endpoint(), models)
                .then(value => {
                    sub.next(value.data)
                })
            
        })
    }

    export function list(query: any): Observable<M.Book[]> {
        return new Observable(sub => {
            axios.get(`${endpoint()}?${stringify(query)}`)
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    export function remove(ids: string[]): Observable<M.Book[]> {
        return new Observable(sub => {
            axios.delete(endpoint())
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    class WithAuthorSubscriber extends Subscriber<M.Book[]> {
        constructor(sub: Subscriber<M.Book>) {
            super(sub)
        }
            
        _next(books: M.Book[]) {
            const relationshipEndpoint = `${API_URL}/authors`;
            
            const query: string = books.reduce((acc: string[], book) => {
                acc.push(`bookId=${book.id}`)
                return acc
            }, []).join('&')
            
            axios.get(`${relationshipEndpoint}?${query}`)
                .then(value => {
                    (<any>this.destination).next(value.data)
                })
        }
    }
    
    export const withAuthors = (src: Observable<M.Book[]>) => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new WithAuthorSubscriber(sub))
            }
        })
    }
    
}

export namespace authors {

    function endpoint(): string {
        return `${API_URL}/authors`
    }
    
    export function create(models: M.Author[]): Observable<M.Author[]> {
        return new Observable(sub => {
            const value = axios.post(endpoint(), models)
                .then(value => {
                    sub.next(value.data)
                })
            
        })
    }

    export function list(query: any): Observable<M.Author[]> {
        return new Observable(sub => {
            axios.get(`${endpoint()}?${stringify(query)}`)
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
    export function remove(ids: string[]): Observable<M.Author[]> {
        return new Observable(sub => {
            axios.delete(endpoint())
                .then(value => {
                    sub.next(value.data)
                })
        })
    }
    
}