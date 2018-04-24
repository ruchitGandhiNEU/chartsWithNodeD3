import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../shared/appConstants';
import 'rxjs/add/operator/map';
import {SpinnerService} from '../shared/spinner.service';
import {catchError} from 'rxjs/operators';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class AnnouncementService {

  constructor(private http: HttpClient,
              private appConstants: AppConstants,
              private spinner: SpinnerService) {
  }

  private handleError(error: HttpErrorResponse) {
    this.spinner.showSpinner.next(false);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      error.error.message || 'Something went wrong; please try again later.');
  }

  getAllCharts() {
    const httpOptions = {
      headers: this.appConstants.privateHeaders
    };

    return this.http.get(`${this.appConstants.CHART_ENDPOINT}/getAllCharts`, httpOptions)
      .pipe(catchError(this.handleError.bind(this)));

  }

  createAnnouncement(receivers, editorContent) {

    const httpOptions = {
      headers: this.appConstants.privateHeaders
    };

    let body = {
      editorContent,
      receivers,
    };

    return this.http.post(`${this.appConstants.ANNOUNCEMENT_ENDPOINT}/createAnnouncement`, body, httpOptions)
      .map((result: any) => {
        if (result.success) {
          return result;
        }
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
}