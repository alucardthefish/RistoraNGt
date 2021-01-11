import { Injectable } from '@angular/core';
import { resolve } from 'url';

import { Leader } from "../shared/leader";
import { LEADERS } from "../shared/leaders";

import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";

import { ProcessHTTPMsgService } from "../services/process-httpmsg.service";

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHttpMsgService: ProcessHTTPMsgService) { }


  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders')
     .pipe(catchError(this.processHttpMsgService.handleError));
  }


  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
     .pipe(map(leaders => leaders[0]))
     .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
