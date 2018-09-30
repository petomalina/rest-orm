import * as express from 'express'
import {Request, Response} from "express"
import * as bodyParser from 'body-parser'

import {User, Book, Author} from '../../bookstore/models'

interface Model {
    id: string;
}

class Store<T extends Model> {
    private store: T[] = []

    // create will create an object or replace the existing one
    create(t: T): T {
        const i = this.store.findIndex(m => m.id == t.id)
        if (i > -1) {
            this.store[i] = t
        } else {
            this.store.push(t)
        }

        return t
    }

    list(query?: { [key: string]: any }): T[] {
        if (!query || Object.keys(query).length <= 0) {
            return this.store
        }

        return this.store.filter(m => {
            for (const key in query) {
                if (query[key] instanceof Array) {
                    if (query[key].includes((<any>m)[key])) {
                        return true
                    }
                } else {
                    // supports { id: 'abc' }
                    if (query[key] == (<any>m)[key]) {
                        return true
                    }
                }
            }

            return false
        })
    }

    // update will update the object or create a new one
    update(t: T): T {
        const i = this.store.findIndex(m => m.id == t.id)
        if (i > -1) {
            Object.assign(this.store[i], t)
        } else {
            this.create(t)
        }

        return t
    }

    delete(t: T): T {
        this.store.filter(model => {
            return model.id != t.id
        })

        return t
    }
}

class Router<T extends Model> {
    constructor(private prefix: string, private store: Store<T>) {
    }

    register(app: express.Application) {
        app.route(this.prefix)
            .get((req: Request, res: Response) => {
                res.json(this.store.list(req.query))
            })
            // create or update
            .post((req: Request, res: Response) => {
                res.json(this.store.update(req.body))
            })
            // create or rewrite
            .put((req: Request, res: Response) => {
                res.json(this.store.create(req.body))
            })
            .delete((req: Request, res: Response) => {
                res.json(this.store.delete(req.body))
            })
    }
}

class App {
    public app: express.Application

    private users = new Store<User>()
    private books = new Store<Book>()
    private authors = new Store<Author>()

    constructor() {
        this.app = express()

        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))

        this.addMockData()
        this.constructRouting()
    }

    constructRouting() {
        new Router<User>('/users', this.users).register(this.app)
        new Router<Book>('/books', this.books).register(this.app)
        new Router<Author>('/authors', this.authors).register(this.app)
    }

    addMockData() {
        const userMocks: User[] = [
            {
                "id": "e2c0ccee-530f-45fb-87f6-6205074228d7",
                "name": "Pugh Trujillo",
                "email": "Mai.Blevins@notagmail.com",
                "description": "Adipisicing in tempor dolor culpa nisi nostrud enim id ad enim dolore proident laborum officia. Officia ex amet cillum duis esse reprehenderit laborum voluptate commodo laborum cupidatat. Excepteur ad amet aliqua culpa laboris ad ea tempor. Veniam ullamco aute culpa amet elit nostrud consequat duis occaecat."
            },
            {
                "id": "657ff218-636f-4862-ade8-b29055ee6bb2",
                "name": "Cynthia Barton",
                "email": "Bianca.Kline@notagmail.com",
                "description": "Et aliquip est nostrud laborum et ut fugiat mollit tempor consequat adipisicing elit ad. Proident Lorem aliquip quis reprehenderit id voluptate aliquip non. Aliqua excepteur ipsum eiusmod quis non esse ea ipsum officia. Ullamco in aliquip excepteur est veniam adipisicing sunt cupidatat aute sunt."
            },
            {
                "id": "8cfda087-e09b-4439-baa8-23885a1361c7",
                "name": "Elena Burnett",
                "email": "Munoz.Oconnor@notagmail.com",
                "description": "Eiusmod tempor ad consectetur est laborum commodo magna Lorem ad cupidatat excepteur eu elit. Ipsum non id minim occaecat aliqua ullamco mollit velit et consectetur deserunt amet exercitation. Sint deserunt voluptate laborum anim ullamco duis voluptate in occaecat adipisicing excepteur. Proident anim duis culpa eiusmod est tempor adipisicing."
            },
            {
                "id": "113c55cd-bf92-410b-b860-722b1d331d9a",
                "name": "Kristine Barnett",
                "email": "Joyner.Becker@notagmail.com",
                "description": "Ea velit in ad dolore excepteur quis excepteur elit. Ut eu elit labore cupidatat duis. Aliqua proident aute pariatur ullamco consectetur. Veniam eiusmod non Lorem sint Lorem anim."
            },
            {
                "id": "199ec702-2593-4731-947a-1c4ddd712870",
                "name": "Lynnette Paul",
                "email": "Bauer.Brewer@notagmail.com",
                "description": "Adipisicing minim anim reprehenderit elit aliquip esse laborum. Nostrud eiusmod ad voluptate commodo elit proident consequat voluptate sit laboris veniam. Fugiat incididunt est sit id ex laborum nulla tempor magna. Adipisicing Lorem Lorem eu excepteur anim ad aliqua minim nostrud ipsum esse."
            },
            {
                "id": "9dfa45b3-1c8a-449d-a39f-f789bb712ca3",
                "name": "Vera Goodwin",
                "email": "Ford.Wiley@notagmail.com",
                "description": "Duis non sunt occaecat anim proident ea cupidatat non aliqua. Ipsum incididunt aute sit qui tempor est dolore nulla et. Minim aliqua est Lorem voluptate sunt cupidatat excepteur amet do cupidatat officia magna non pariatur. Deserunt occaecat labore commodo pariatur incididunt est et."
            }
        ]

        const bookMocks: Book[] = [
            {
                "id": "a5de121f-ceb6-407c-87bd-32d28917005d",
                "name": "Lenore in the Dale",
                "description": "Laboris deserunt minim ullamco eu est velit esse do ipsum irure anim esse reprehenderit. Ex fugiat mollit ad Lorem. Aliqua magna laborum labore deserunt enim ad ea duis reprehenderit elit do. Et qui anim ut aliquip tempor incididunt mollit aute incididunt culpa non dolor incididunt."
            },
            {
                "id": "66a182be-731a-49f9-8dfe-ba89b6570382",
                "name": "Armstrong in the Oley",
                "description": "Ipsum commodo laboris proident dolor proident occaecat esse officia qui. Consequat nostrud eu esse culpa minim officia nostrud ut in anim mollit. Cillum aliquip ea consectetur ea aute ullamco laborum qui nostrud veniam ullamco. Qui duis ad velit consectetur occaecat amet."
            },
            {
                "id": "8ad9a351-f6ac-4b65-950f-d72fdfd55155",
                "name": "Jeannette in the Avalon",
                "description": "Et veniam laboris dolor occaecat aute amet incididunt aute excepteur cillum. Officia ea aliqua ipsum sint anim amet Lorem dolor qui irure quis ut excepteur amet. Quis sint voluptate quis laboris laborum do ad tempor in elit ad qui duis deserunt. Pariatur commodo labore nisi aliqua laborum aliqua sint ut amet."
            },
            {
                "id": "efd2f921-d41e-4afd-9e65-c3375d074dc5",
                "name": "Miriam in the Welda",
                "description": "Excepteur exercitation laborum aliqua fugiat nisi eiusmod dolore. Eiusmod sunt aute dolore eiusmod cillum nulla aute laboris ea nisi reprehenderit cupidatat. Adipisicing id consequat incididunt id minim sint culpa nulla amet ipsum laborum quis duis. Excepteur consequat ullamco sunt nisi mollit sunt velit aliquip."
            },
            {
                "id": "58ef5491-4e31-47d1-afa4-ea0c83e8caff",
                "name": "Barry in the Cresaptown",
                "description": "Officia enim eiusmod laboris dolore excepteur ex velit consequat. Aliqua eiusmod labore cillum ea ex in. Occaecat voluptate cupidatat duis sint do eiusmod ut ex officia nostrud proident deserunt. Ut minim ad cillum id adipisicing id irure qui occaecat."
            },
            {
                "id": "5cfb1771-0969-4d8b-8c86-b4380f38c5a7",
                "name": "Melton in the Whitestone",
                "description": "Est id officia nisi est laboris quis. Labore pariatur elit laborum ea nulla labore. Anim irure laborum pariatur non pariatur non culpa Lorem cupidatat reprehenderit. Velit anim tempor in cupidatat officia pariatur enim amet esse occaecat."
            },
            {
                "id": "982b2a41-2916-4932-b769-4eecfbf6ae9d",
                "name": "Minnie in the Robbins",
                "description": "In in incididunt occaecat amet sint eiusmod anim. Eiusmod nostrud dolor occaecat laboris incididunt qui minim sint ex voluptate. Anim laboris irure cillum sit excepteur ex veniam proident. Non est eu nostrud anim sint ex do eu ullamco qui."
            },
            {
                "id": "cdf106fb-492b-4866-a4bb-a1c46c55a9bd",
                "name": "Chandra in the Waterloo",
                "description": "Anim est eu magna duis. Sint id duis aliquip quis commodo commodo sint elit ea. Aliquip enim aute exercitation proident voluptate sint magna. Velit ad sint aute enim."
            },
            {
                "id": "445008cd-06b1-4f02-a0fa-d022aac76a26",
                "name": "Augusta in the Walton",
                "description": "Proident eu proident qui veniam tempor irure. Dolor sunt tempor nostrud duis amet proident et laboris ex deserunt. Lorem eu duis cillum reprehenderit sit pariatur officia magna non est dolore laboris. Exercitation ullamco qui ut consequat ullamco do tempor adipisicing velit eu."
            },
            {
                "id": "1965b13d-85d4-4cee-9285-d16c4fc33a41",
                "name": "Melissa in the Goochland",
                "description": "Nulla quis excepteur deserunt voluptate reprehenderit reprehenderit culpa dolor non velit. Deserunt ad culpa consequat et cupidatat minim ad. Ex veniam aliquip fugiat cillum consectetur labore adipisicing in dolor ipsum in eiusmod pariatur proident. Aliquip sit officia est sint ex elit."
            }
        ]

        const authorMocks: Author[] = [
            {
                "id": "ce84be54-d4d5-4aaf-83fb-381f7955ab13",
                "name": "Marie Franks Day"
            },
            {
                "id": "3162ebf1-e4eb-47a5-991c-58531a3c3a5c",
                "name": "Kay Singleton Henderson"
            },
            {
                "id": "5c989164-3713-4609-a4c2-ded7836e6c8b",
                "name": "Mona Austin Perkins"
            },
            {
                "id": "f2daa7da-746c-4aa4-bd00-988505b1b813",
                "name": "Shana Diaz Bird"
            },
            {
                "id": "39e41ed0-bb59-482f-9cac-f2d3092564ef",
                "name": "Natasha Watkins Harper"
            },
            {
                "id": "a50c83b0-e101-4a48-ac38-c618db217968",
                "name": "Banks Cantu Keller"
            },
            {
                "id": "2dd57145-c8d0-409c-883e-211415129687",
                "name": "Darla Williamson Marshall"
            },
            {
                "id": "92aac86a-a716-44fe-af98-f09f8834ec8f",
                "name": "Murphy Farrell Slater"
            },
            {
                "id": "ea1b6866-19c3-49c8-9fd3-06f0634527b2",
                "name": "Carmela Glover Humphrey"
            }
        ]

        userMocks.forEach(u => this.users.create(u))
        bookMocks.forEach(u => this.books.create(u))
        authorMocks.forEach(u => this.authors.create(u))
    }
}

const PORT = 8080
new App().app.listen(PORT, () => {
    console.log('Server is running on port:', PORT)
})