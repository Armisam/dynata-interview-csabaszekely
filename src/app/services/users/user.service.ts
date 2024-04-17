import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/app/api-url';
import { Author } from 'src/app/interfaces/author.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser: WritableSignal<Author> = signal({
    id: 0,
    name: "admin",
    password: "LqmSEM22VLngyjQp",
    email: "admin@admin.com",
    role: 0
  });


  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/users`);
  }
}
