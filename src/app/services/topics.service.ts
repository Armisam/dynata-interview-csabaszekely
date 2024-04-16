import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiUrl } from '../api-url';
import { RootObject } from '../interfaces/root-object.interface';
import { TopicFormData } from '../pages/home/interfaces/topic-form-data.interface';
import { Topic } from '../interfaces/topic.interface';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  constructor(private httpClient: HttpClient) { }

  public getTopics(): Observable<RootObject> {
    return this.httpClient.get<RootObject>(`${apiUrl}/topics`);
  }

  public addTopic(topicFormData: TopicFormData): Observable<Topic> {
    return this.httpClient.post<Topic>(`${apiUrl}/topic/add`, { ...topicFormData, author: {} });
  }
}
