import { Component, Input, OnInit } from '@angular/core';
import { post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit {
  // @Input() posts:post[] = [];
  posts:post[] = [];
  isLoading = true;
  totalPost = 10;
  postsPerPage = 1;
  pageSizeOption = [1,5, 10,15,20];
  currentPage = 1
  constructor(public postService:PostsService, public router:Router){}
  private postSub: Subscription = new Subscription;
  ngOnInit(){

   this.postService.getPost(this.postsPerPage,this.currentPage);
   this.postService.getPostUpdateListner().subscribe((postData:{posts:post[], postCount:number})=>{
    this.posts = postData.posts;
    this.totalPost = postData.postCount
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
   });
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
  onDelete(id:any){
  
  this.postService.deletePosts(id).subscribe(() =>{
    this.postService.getPost(this.postsPerPage, this.currentPage);
  })
 
  }
  onChangedPage(event:PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPost(this.postsPerPage,this.currentPage);

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
