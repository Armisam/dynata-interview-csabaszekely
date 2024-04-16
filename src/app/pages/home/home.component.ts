import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { Topic } from 'src/app/interfaces/topic.interface';
import { TopicsService } from 'src/app/services/topics.service';
import { TopicFormData } from './interfaces/topic-form-data.interface';
import { Comment, CommentNode } from 'src/app/interfaces/comment.interface';

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

  constructor(private topicsService: TopicsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addNewTopicFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });

    this.topicsService.getTopics().pipe(take(1)).subscribe((object) => {
      this.topics = object.data;
    });
  }

  public addNewTopic(): void {
    if (this.addNewTopicFormGroup.invalid) {
      this.addNewTopicFormGroup.markAllAsTouched();
      return;
    }

    const topicFormData: TopicFormData = this.addNewTopicFormGroup.value;
    // this.topicsService.addTopic(topicFormData).subscribe((topic) => this.topics.push(topic));
  }

  public onOpenTopic(topicId: number) {
    this.dataSource.data = this.topics.find((topic) => topic.id == topicId)?.comments || [];
  }

  public addNewComment(topicId: number, commentId?: number): void {
    //TODO
  }

  public onCloseTopic(): void {
    this.newComment.reset();
  }
}
