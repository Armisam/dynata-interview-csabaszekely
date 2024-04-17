import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../api-url';
import { Role } from 'src/app/interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  public getRoles(): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/roles`);
  }

  public getRoleById(roleId: number): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/role/${roleId}`);
  }

  public modifyRole(role: Role): Observable<any> {
    return this.httpClient.put<any>(`${apiUrl}/role/${role.id}`, role);
  }
}
