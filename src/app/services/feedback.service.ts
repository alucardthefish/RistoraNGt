import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Feedback } from "../shared/feedback";
import { baseURL } from "../shared/baseurl";
import { catchError } from "rxjs/operators";
import { ProcessHTTPMsgService } from "../services/process-httpmsg.service";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  
    submitFeedback(feedback: Feedback) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      return this.http.post<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
       .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
