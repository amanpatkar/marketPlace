import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.auth.getToken();

        if (authToken) {
            // Only add the Authorization header if a token exists
            const authRequest = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`)
            });

            return next.handle(authRequest); // Corrected return statement
        }

        return next.handle(request);
    }
}
