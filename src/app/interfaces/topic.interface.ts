import { Author } from "./author.interface";
import { Comment } from "./comment.interface";

export interface Topic {
    id: number;
    author: Author;
    title: string;
    body: string;
    comments: Comment[];
}
