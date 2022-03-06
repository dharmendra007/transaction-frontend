import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let url = environment.baseUrl;
        // console.log(token);
        url += req.url;

        // console.log(url);

        const copiedReq = req.clone({
            headers: req.headers.append('Accept','application/json'), url: url,
            setHeaders: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        return next.handle(copiedReq);
    }
}