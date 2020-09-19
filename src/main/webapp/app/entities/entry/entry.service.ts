import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IEntry } from 'app/shared/model/entry.model';

type EntityResponseType = HttpResponse<IEntry>;
type EntityArrayResponseType = HttpResponse<IEntry[]>;

@Injectable({ providedIn: 'root' })
export class EntryService {
  public resourceUrl = SERVER_API_URL + 'api/entries';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/entries';

  constructor(protected http: HttpClient) {}

  create(entry: IEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entry);
    return this.http
      .post<IEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(entry: IEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entry);
    return this.http
      .put<IEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(entry: IEntry): IEntry {
    const copy: IEntry = Object.assign({}, entry, {
      date: entry.date && entry.date.isValid() ? entry.date.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((entry: IEntry) => {
        entry.date = entry.date ? moment(entry.date) : undefined;
      });
    }
    return res;
  }
}
