import * as M from './models'
import { Observable, Subscriber, from } from 'rxjs'
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

    export function list(query?: any): Observable<M.User[]> {
        return new Observable(sub => {
            const value = axios.get(`${endpoint()}?${stringify(query)}`)
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
        constructor(sub: Subscriber<M.User[]>, private ops: SameOperator<M.Book[]>[]) {
            super(sub)
        }
            
        _next(users: M.User[]) {
            const relationshipEndpoint = `${API_URL}/books`;
            
            const query: string = users.reduce((acc: string[], user) => {
                acc.push(`userId=${user.id}`)
                return acc
            }, []).join('&')
            
            let $o = new Observable<M.Book[]>(sub => {
                axios.get(`${relationshipEndpoint}?${query}`)
                    .then(value => sub.next(value.data))
            })
            
            for (const op of this.ops) {
                $o = $o.pipe(op)
            }

            $o.subscribe(val => {
                // perform linking
                for (const model of val) {
                    const link = users.find(user => {
                        return user.id == model.userId
                    })

                    if (!link) {
                        console.log('Could not link:', model)
                        continue
                    }

                    if (!link.books) {
                        link.books = []
                    }

                    link.books.push(model)
                }
                
                (<any>this.destination).next(users)
            })
        }
    }
    
    export const withBooks = (...ops: SameOperator<M.Book[]>[]) => (src: Observable<M.User[]>): Observable<M.User[]> => {
        return src.lift({
            call(sub, source) {
                source.subscribe(new WithBookSubscriber(sub, ops))
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

    export function list(query?: any): Observable<M.Book[]> {
        return new Observable(sub => {
            const value = axios.get(`${endpoint()}?${stringify(query)}`)
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
        constructor(sub: Subscriber<M.Book[]>, private ops: SameOperator<M.Author[]>[]) {
            super(sub)
        }
            
        _next(books: M.Book[]) {
            const relationshipEndpoint = `${API_URL}/authors`;
            
            const query: string = books.reduce((acc: string[], book) => {
                acc.push(`bookId=${book.id}`)
                return acc
            }, []).join('&')
            
            let $o = new Observable<M.Author[]>(sub => {
                axios.get(`${relationshipEndpoint}?${query}`)
                    .then(value => sub.next(value.data))
            })
            
            for (const op of this.ops) {
                $o = $o.pipe(op)
            }

            $o.subscribe(val => {
                // perform linking
                for (const model of val) {
                    const link = books.find(book => {
                        return book.id == model.bookId
                    })

                    if (!link) {
                        console.log('Could not link:', model)
                        continue
                    }

                    if (!link.authors) {
                        link.authors = []
                    }

                    link.authors.push(model)
                }
                
                (<any>this.destination).next(books)
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

    export function list(query?: any): Observable<M.Author[]> {
        return new Observable(sub => {
            const value = axios.get(`${endpoint()}?${stringify(query)}`)
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