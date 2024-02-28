export interface Meeting {
    id: number;
    title: string;
    name: string;
    date: string;
    time: string;
}

export interface User {
    email: string;
    firstname?: string;
    surname?: string;
    avatarUrl?: string;
}