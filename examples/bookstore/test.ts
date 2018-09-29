import { user } from './orm.gen'

const api = new user.API('https://jsonplaceholder.typicode.com/todos')

api.list([])
    .subscribe({
        next: value => console.log(value),
        error: value => console.log(value)
    })