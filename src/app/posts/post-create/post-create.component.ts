import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
 
  enteredValue = '';
  enteredTitle = '';
  isLoading = true;
 private postId:string = '';
 private mode = 'create';
  post:any;
  // @Output() postCreated = new EventEmitter<post>();
  constructor(public postService:PostsService, public route:ActivatedRoute){}
  newPost = '';
  title = '';
  content = '';
  savePost(form:NgForm){
    if(form.invalid){
      return
    }
    if(this.mode === 'create'){

      this.newPost = this.enteredValue;
      const post:post = {
        id:null,
        title: form.value.title,
        content:form.value.content
      }
      // this.postCreated.emit(post);
      this.postService.addPost(form.value.title, form.value.content);
    }else{
      this.postService.editPosts(this.postId, this.post.title,this.post.content);
    }
    form.resetForm();
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((response:ParamMap) =>{
      console.log(response);
      if(response.has('postId')){
        this.mode = 'edit';
        this.postId = String(response.get('postId'))
        this.post = this.postService.getPostData(this.postId).subscribe((postsData:any) =>{
          this.post = {
            id:postsData._id,
            title:postsData.title, 
            content:postsData.content
          }
          setTimeout(() => {
            
            this.isLoading = false;
          }, 500);
        }) 
      }else{
        this.mode ='create';
        this.postId = '';
        this.post = {
          id:null,
          title: '',
          content:'',
        }
        this.isLoading = false;
      }
    })
  }
}
