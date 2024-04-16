import { Topic } from "./topic.interface";

export interface RootObject {
    status: number;
    message: string;
    data: Topic[];
}