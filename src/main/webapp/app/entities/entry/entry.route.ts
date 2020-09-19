import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEntry, Entry } from 'app/shared/model/entry.model';
import { EntryService } from './entry.service';
import { EntryComponent } from './entry.component';
import { EntryDetailComponent } from './entry-detail.component';
import { EntryUpdateComponent } from './entry-update.component';

@Injectable({ providedIn: 'root' })
export class EntryResolve implements Resolve<IEntry> {
  constructor(private service: EntryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((entry: HttpResponse<Entry>) => {
          if (entry.body) {
            return of(entry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Entry());
  }
}

export const entryRoute: Routes = [
  {
    path: '',
    component: EntryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Entries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntryDetailComponent,
    resolve: {
      entry: EntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Entries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntryUpdateComponent,
    resolve: {
      entry: EntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Entries',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntryUpdateComponent,
    resolve: {
      entry: EntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Entries',
    },
    canActivate: [UserRouteAccessService],
  },
];
