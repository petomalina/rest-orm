
export interface User {
    id: string;

    books: Book[];
}

export interface Book {
    id: string;

    authors: Author[];
}

export interface Author {
    id: string;
}
