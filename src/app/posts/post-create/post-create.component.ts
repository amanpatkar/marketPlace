import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { post } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './mime-type.validator'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  form!: FormGroup;
  enteredValue = '';
  enteredTitle = '';
  private authStatusSub = new Subscription();
  isLoading = true;
  imagePreview:string = '';
 private postId:string = '';
 private mode = 'create';
  post:any;
  // @Output() postCreated = new EventEmitter<post>();
  constructor(public postService:PostsService, public route:ActivatedRoute,private auth:AuthService){}
  newPost = '';
  title = '';
  content = '';
  savePost(){
    console.log(this.form.value);
    
    if(this.form.invalid){
      return
    }
    if(this.mode === 'create'){

      this.newPost = this.enteredValue;
      const post:post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: ''
      }
      // this.postCreated.emit(post);
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    }else{
      this.postService.editPosts(this.postId, this.form.value.title,this.form.value.content, this.form.value.image);
    }
  }



  ngOnInit(): void {
    this.authStatusSub = this.auth.getAuthStatusListner().subscribe(authStatus =>{
      if(!authStatus){
        this.isLoading = false;
      }else{
        this.isLoading = true;
      }
   })
    this.form = new FormGroup({
      title:new FormControl(null, {validators: [Validators.required,Validators.minLength(3)]}),
      content: new FormControl(null , {validators: [Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required]})
    })
    this.route.paramMap.subscribe((response:ParamMap) =>{
      console.log(response);
      if(response.has('postId')){
        this.mode = 'edit';
        this.postId = String(response.get('postId'))
        this.post = this.postService.getPostData(this.postId).subscribe((postsData:any) =>{
          this.post = {
            id:postsData._id,
            title:postsData.title, 
            content:postsData.content,
            imagePath:postsData?.imagePath
          }
          this.form?.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })
         console.log( this.form);
         this.imagePreview = this.form.value.image;
          setTimeout(() => {
            
            this.isLoading = false;
          }, 500);
        }) 
      }else{
        this.mode ='create';
        this.postId = '';
        this.post = {
          id:null,
          title:'', 
          content:''
        }
      
        this.isLoading = false;
      }
    })
  }
  onSelection(event:any){
    const file = (event.target).files[0];
    this.form.patchValue({
      image:file
    })
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = String(reader.result);
    }
    reader.readAsDataURL(file);

  }
}
