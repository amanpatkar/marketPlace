import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from './error/error/error.component';


@Injectable()
export class ErrroInterceptor implements HttpInterceptor {

    constructor(private dialogue:MatDialog) {}
    intercept(request: HttpRequest<any>, next: HttpHandler) {
     

        return next.handle(request).pipe(
            catchError((error:HttpErrorResponse) =>{
                // console.log(error);
                // alert(error.error.error.message)
                let errorMessage = 'An unknown error occured!'
                if(error.error.error.message){
                    errorMessage = error.error.error.message
                }
                this.dialogue.open(ErrorComponent, {data:{message:errorMessage}})
                return throwError(error);
            })
        );
    }
}
