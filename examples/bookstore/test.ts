import {users, books, setApiUrl} from './orm.gen'

setApiUrl('http://localhost:8080')

users
    .list({
        id: "e2c0ccee-530f-45fb-87f6-6205074228d7"
    })
    .pipe(
        users.withBooks()
    )
    .subscribe({
        next: value => console.log('value:', value),
        error: value => console.log(value)
    })