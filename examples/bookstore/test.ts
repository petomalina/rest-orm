import { user } from './orm.gen'

const api = new user.API('http://localhost:8080/users')

api.list([])
    .subscribe({
        next: value => console.log(value),
        error: value => console.log(value)
    })