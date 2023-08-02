import { Component, Input, OnInit } from '@angular/core';
import { post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit {
  // @Input() posts:post[] = [];
  posts:post[] = [];
  isLoading = true;
  private authSubscription = new Subscription();
  isUserAuthenticated = false;
  totalPost = 10;
  postsPerPage = 1;
  userId:string = '';
  pageSizeOption = [1,5, 10,15,20];
  currentPage = 1
  constructor(public postService:PostsService, public router:Router, private auth:AuthService){}
  private postSub: Subscription = new Subscription;
  ngOnInit(){
   this.userId = String(this.auth.getUserId());
   this.postService.getPost(this.postsPerPage,this.currentPage);
   this.postService.getPostUpdateListner().subscribe((postData:{posts:post[], postCount:number})=>{
    this.posts = postData.posts;
    this.totalPost = postData.postCount
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
   });
   this.isUserAuthenticated =  this.auth.getAuthStatus();
   this.authSubscription = this.auth.getAuthStatusListner().subscribe(isAuthenticated =>{
    this.isUserAuthenticated = isAuthenticated;
    this.userId = String(this.auth.getUserId());
   })

  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authSubscription.unsubscribe();
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
      imagePath: '',
      creator:''
    }
    this.router.navigate([`/edit/${id}`]);
    // this.postService.editPosts(id,post);
    
  }
}
