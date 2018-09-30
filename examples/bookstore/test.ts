import {users, setApiUrl, books} from './orm.gen'
import {inspect} from "util";

setApiUrl('http://localhost:8080')

users
    .list({
        id: "e2c0ccee-530f-45fb-87f6-6205074228d7"
    })
    .pipe(
        users.withBooks(
            books.withAuthors()
        )
    )
    .subscribe({
        next: value => console.log(inspect(value, false, null, true)),
        error: value => console.log(value),
        complete: () => console.log('completed')
    })