import * as M from './models'
import { Observable, Subscriber, from } from 'rxjs'
import { map } from 'rxjs/operators'
import axios from 'axios'
import { stringify } from 'querystring'

type SameOperator<T> = (i: Observable<T>) => Observable<T>;

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
        return from(axios.get(`${endpoint()}?${stringify(query)}`))
            .pipe(
                map(v => v.data)
            )
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
        constructor(sub: Subscriber<M.User[]>, private ops: SameOperator<M.Book[]>[]) {
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
            
            // let $o = from(axios.get(`${relationshipEndpoint}?${query}`))
            //     .pipe(
            //         map(v => <M.Book[]>(v.data)),
            //     )
            //
            // for (const op of this.ops) {
            //     $o = $o.pipe(op)
            // }
            //
            // $o.subscribe(val => {
            //     console.log('books');
            //     (<any>this.destination).next(val)
            // })
        }
    }
    
    export const withBooks = (src: Observable<M.User[]>): Observable<M.User[]> => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new WithBookSubscriber(sub, []))
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
        return from(axios.get(`${endpoint()}?${stringify(query)}`))
            .pipe(
                map(v => v.data)
            )
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
        constructor(sub: Subscriber<M.Book[]>, private ops: SameOperator<M.Author[]>[]) {
            super(sub)
        }
            
        _next(books: M.Book[]) {
            const relationshipEndpoint = `${API_URL}/authors`;
            
            const query: string = books.reduce((acc: string[], book) => {
                acc.push(`bookId=${book.id}`)
                return acc
            }, []).join('&')
            
            let $o = from(axios.get(`${relationshipEndpoint}?${query}`))
                .pipe(
                    map(v => <M.Author[]>(v.data)),
                )

            for (const op of this.ops) {
                $o = $o.pipe(op)
            }

            $o.subscribe(val => {
                (<any>this.destination).next(val)
            })
        }
    }
    
    export const withAuthors = (...ops: SameOperator<M.Author[]>[]) => (src: Observable<M.Book[]>): Observable<M.Book[]> => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new WithAuthorSubscriber(sub, ops))
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
        return from(axios.get(`${endpoint()}?${stringify(query)}`))
            .pipe(
                map(v => v.data)
            )
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