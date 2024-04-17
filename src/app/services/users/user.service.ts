import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { Observable, take } from 'rxjs';
import { apiUrl } from 'src/app/api-url';
import { Author } from 'src/app/interfaces/author.interface';
import { Role } from 'src/app/interfaces/role.interface';
import { Comment } from 'src/app/interfaces/comment.interface';
import { Topic } from 'src/app/interfaces/topic.interface';
import { TopicService } from '../topics/topic.service';
import { RoleService } from '../roles/role.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public users: Author[] = [];
  public currentrole!: Role;
  public currentUser: WritableSignal<Author> = signal({ id: 0, name: '', password: '', email: '', role: 0, });

  public canRead: WritableSignal<boolean | null> = signal(null);
  public canModifyComments: WritableSignal<boolean | null> = signal(null);
  public canModifyTopics: WritableSignal<boolean | null> = signal(null);
  public canModifyOthers: WritableSignal<boolean | null> = signal(null);

  public totalCommentsByUser: WritableSignal<number> = signal(0);
  public topicsCommentedByUser: WritableSignal<number> = signal(0);


  constructor(private httpClient: HttpClient, private topicService: TopicService, private roleService: RoleService) {
    this.getUsers().pipe(take(1)).subscribe((object) =>
      this.users = object.data
    );

    this.getUserById(0).pipe(take(1)).subscribe((object) => this.currentUser.set(object.data));

    effect(() => {
      this.roleService.getRoleById(this.currentUser().role).pipe(take(1)).subscribe((object) => {
        this.currentrole = object.data;

        this.canRead.set(this.currentrole.rights === 1 || this.currentrole.rights === 3 || this.currentrole.rights === 5 || this.currentrole.rights === 7 || this.currentrole.rights === 9 || this.currentrole.rights === 11 || this.currentrole.rights === 13 || this.currentrole.rights === 15);
        this.canModifyComments.set(this.currentrole.rights === 2 || this.currentrole.rights === 3 || this.currentrole.rights === 6 || this.currentrole.rights === 7 || this.currentrole.rights === 10 || this.currentrole.rights === 11 || this.currentrole.rights === 14 || this.currentrole.rights === 15);
        this.canModifyTopics.set(this.currentrole.rights === 4 || this.currentrole.rights === 5 || this.currentrole.rights === 6 || this.currentrole.rights === 7 || this.currentrole.rights === 12 || this.currentrole.rights === 13 || this.currentrole.rights === 14 || this.currentrole.rights === 15);
        this.canModifyOthers.set(this.currentrole.rights === 8 || this.currentrole.rights === 9 || this.currentrole.rights === 10 || this.currentrole.rights === 11 || this.currentrole.rights === 12 || this.currentrole.rights === 13 || this.currentrole.rights === 14 || this.currentrole.rights === 15);
      });
      this.topicService.getTopics().pipe(take(1))
        .subscribe((object) => {
          const { comments, topics } = this.getCommentsAndTopicsByAuthor(object.data, this.currentUser().id);
          this.totalCommentsByUser.set(comments);
          this.topicsCommentedByUser.set(topics)
        });

      this.users[this.users.findIndex((user) => user.id === this.currentUser().id)] == this.currentUser();
    });
  }

  public getUsers(): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/users`);
  }

  public getUserById(userId: number): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}/user/${userId}`);
  }

  public changeNameAndEmail(userId: number, name: string, email: string): Observable<any> {
    return this.httpClient.put<any>(`${apiUrl}/user/${userId}`, { name: name, email: email });
  }

  public changePassword(userId: number, password1: string, password2: string): Observable<any> {
    return this.httpClient.put<any>(`${apiUrl}/user/${userId}/password`, { password1: password1, password2: password2 });
  }

  public getCommentsAndTopicsByAuthor(topics: Topic[], authorId: number): { comments: number; topics: number } {
    let commentsCount = 0;
    let topicsCount = 0;

    for (const topic of topics) {
      const { comments, commented } = this.countCommentsAndTopicsByAuthorAtTopic(topic.comments, authorId);
      commentsCount += comments;
      if (commented) {
        topicsCount++;
      }
    }

    return { comments: commentsCount, topics: topicsCount };
  }

  private countCommentsAndTopicsByAuthorAtTopic(comments: Comment[], authorId: number): { comments: number; commented: boolean } {
    let commentsCount = 0;
    let commented = false;

    for (const comment of comments) {
      if (comment.author.id === authorId) {
        commentsCount++;
        commented = true;
      }

      if (comment.comments.length > 0) {
        const { comments: childComments, commented: childCommented } = this.countCommentsAndTopicsByAuthorAtTopic(comment.comments, authorId);
        commentsCount += childComments;
        if (childCommented) {
          commented = true;
        }
      }
    }

    return { comments: commentsCount, commented: commented };
  }
}
