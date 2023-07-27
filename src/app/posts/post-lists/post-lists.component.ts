import { Component, Input, OnInit } from '@angular/core';
import { post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit {
  // @Input() posts:post[] = [];
  posts:post[] = [];
  isLoading = true;
  constructor(public postService:PostsService, public router:Router){}
  private postSub: Subscription = new Subscription;
  ngOnInit(){
   this.postService.getPost();
   this.postService.getPostUpdateListner().subscribe((posts:post[])=>{
    this.posts = posts;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
   });
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
  onDelete(id:any){
  
  this.postService.deletePosts(id)
 
  }
  onEdit(id:any){
    let post:post = {
      id: null,
      title: '',
      content: '',
      imagePath: ''
    }
    this.router.navigate([`/edit/${id}`]);
    // this.postService.editPosts(id,post);
    
  }
}
