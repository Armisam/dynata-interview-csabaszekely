import { Author } from "./author.interface";

export interface Comment {
    id: number;
    body: string;
    author: Author;
    comments: Comment[];
    removed: boolean;
}

export interface CommentNode extends Comment {
    newComment?: string;
}