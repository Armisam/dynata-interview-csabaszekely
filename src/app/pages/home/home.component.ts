import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, take } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { Topic } from 'src/app/interfaces/topic.interface';
import { TopicService } from 'src/app/services/topics/topics.service';
import { TopicFormData } from './interfaces/topic-form-data.interface';
import { Comment, CommentNode } from 'src/app/interfaces/comment.interface';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public topics: Topic[] = [];
  public addNewTopicFormGroup!: FormGroup;

  public treeControl = new NestedTreeControl<CommentNode>(node => node.comments);
  public dataSource = new MatTreeNestedDataSource<CommentNode>();
  public hasChild = (_: number, node: CommentNode) => !!node.comments && node.comments.length > 0;
  public newComment = new FormControl('', Validators.required);

  constructor(private topicService: TopicService, private formBuilder: FormBuilder, public userService: UserService) { }

  ngOnInit(): void {
    this.addNewTopicFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });

    this.topicService.getTopics().pipe(take(1)).subscribe((object) => {
      this.topics = object.data;
    });
  }

  public addNewTopic(): void {
    if (this.addNewTopicFormGroup.invalid) {
      this.addNewTopicFormGroup.markAllAsTouched();
      return;
    }

    const topicFormData: TopicFormData = this.addNewTopicFormGroup.value;
    this.topicService.addTopic(topicFormData, this.userService.currentUser()).pipe(take(1)).subscribe((object) => this.topics.push(object.data));
  }

  public onOpenTopic(topicId: number) {
    this.dataSource.data = this.topics.find((topic) => topic.id == topicId)?.comments || [];
  }

  public addNewComment(comment: string, topicId: number, commentId?: number): void {
    if (!comment) {
      return;
    }

    this.topicService.addNewComment(comment, topicId, this.userService.currentUser(), commentId).pipe(switchMap(() => this.topicService.getTopicById(topicId))).subscribe((object) => {
      const topicWhereCommentAdded = this.topics.findIndex((topic) => topic.id === topicId);
      if (topicWhereCommentAdded === -1) {
        return;
      }
      this.topics[topicWhereCommentAdded] = object.data;
      const { comments, topics } = this.userService.getCommentsAndTopicsByAuthor(object.data, this.userService.currentUser().id);
      this.userService.totalCommentsByUser.set(comments);
      this.userService.topicsCommentedByUser.set(topics);
    });
  }

  public deleteComment(topicId: number, commentId: number): void {
    this.topicService.deleteComment(topicId, commentId).pipe(switchMap(() => this.topicService.getTopicById(topicId))).subscribe((object) => {
      const topicWhereCommentAdded = this.topics.findIndex((topic) => topic.id === topicId);
      if (topicWhereCommentAdded === -1) {
        return;
      }
      this.topics[topicWhereCommentAdded] = object.data;
    });
  }

  public onCloseTopic(): void {
    this.newComment.reset();
  }
}
