export interface User {
    id: string;
    name: string;
    email: string;
    description: string;

    books?: Book[];
}

export interface Book {
    id: string;
    name: string;
    description: string;

    userId?: string

    authors?: Author[];
}

export interface Author {
    id: string;
    name: string;

    bookId?: string;
}
