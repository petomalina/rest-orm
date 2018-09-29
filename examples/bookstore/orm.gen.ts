
import * as M from './models'
import { Observable, Subscriber } from 'rxjs'
import axios from 'axios'
    

export namespace user {
    export class API {
        constructor(private url: string) {}
    
        create(models: M.User[]): Observable<M.User[]> {
            return new Observable(sub => {
                const value = axios.post(this.url, models)
                    .then(value => {
                        sub.next(value.data)
                    })
                
            })
        }
    
        list(ids: string[]): Observable<M.User[]> {
            return new Observable(sub => {
                axios.get(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
        
        delete(ids: string[]): Observable<M.User[]> {
            return new Observable(sub => {
                axios.delete(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
    }
    
    
    class WithBookSubscriber extends Subscriber<M.User> {
        constructor(sub: Subscriber<M.User>) {
            super(sub)
        }
            
        _next(value: M.User) {
            (<any>this.destination).next(value)
        }
    }
    
    export const withBooks = (src: Observable<M.Book>) => {
        src.lift({
            call(sub, source) {
                source.subscribe(new WithBookSubscriber(sub))
            }
        })
    }
    
}

export namespace book {
    export class API {
        constructor(private url: string) {}
    
        create(models: M.Book[]): Observable<M.Book[]> {
            return new Observable(sub => {
                const value = axios.post(this.url, models)
                    .then(value => {
                        sub.next(value.data)
                    })
                
            })
        }
    
        list(ids: string[]): Observable<M.Book[]> {
            return new Observable(sub => {
                axios.get(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
        
        delete(ids: string[]): Observable<M.Book[]> {
            return new Observable(sub => {
                axios.delete(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
    }
    
    
    class WithAuthorSubscriber extends Subscriber<M.Book> {
        constructor(sub: Subscriber<M.Book>) {
            super(sub)
        }
            
        _next(value: M.Book) {
            (<any>this.destination).next(value)
        }
    }
    
    export const withAuthors = (src: Observable<M.Author>) => {
        src.lift({
            call(sub, source) {
                source.subscribe(new WithAuthorSubscriber(sub))
            }
        })
    }
    
}

export namespace author {
    export class API {
        constructor(private url: string) {}
    
        create(models: M.Author[]): Observable<M.Author[]> {
            return new Observable(sub => {
                const value = axios.post(this.url, models)
                    .then(value => {
                        sub.next(value.data)
                    })
                
            })
        }
    
        list(ids: string[]): Observable<M.Author[]> {
            return new Observable(sub => {
                axios.get(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
        
        delete(ids: string[]): Observable<M.Author[]> {
            return new Observable(sub => {
                axios.delete(this.url)
                    .then(value => {
                        sub.next(value.data)
                    })
            })
        }
    }
    
    
}