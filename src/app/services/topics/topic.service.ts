import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiUrl } from '../../api-url';
import { TopicFormData } from '../../pages/home/interfaces/topic-form-data.interface';
import { Author } from 'src/app/interfaces/author.interface';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private httpClient: HttpClient) { }

  public getTopics(): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/topics`);
  }

  public getTopicById(topicId: number): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/topic/${topicId}`);
  }

  public addTopic(topicFormData: TopicFormData, author: Author): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}/topic/add`, {
      ...topicFormData, author: {
        id: author.id,
        name: author.name,
        email: author.email,
        role: author.role
      }
    });
  }

  public deleteTopic(topicId: number): Observable<any> {
    return this.httpClient.delete<any>(`${apiUrl}/topic/${topicId}`);
  }

  public addNewComment(comment: string, topicId: number, author: Author, commentId?: number): Observable<any> {
    if (commentId === null || commentId === undefined) {
      return this.httpClient.post<any>(`${apiUrl}/topic/${topicId}/comment/add`, {
        body: comment,
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
          role: author.role
        }
      });
    } else {
      return this.httpClient.post<any>(`${apiUrl}/topic/${topicId}/comment/${commentId}/add`, {
        body: comment,
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
          role: author.role
        }
      });
    }
  }

  public deleteComment(topicId: number, commentId: number): Observable<any> {
    return this.httpClient.delete<any>(`${apiUrl}/topic/${topicId}/comment/${commentId}`)
  }
}
