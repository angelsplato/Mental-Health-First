import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEntry } from 'app/shared/model/entry.model';
import { EntryService } from './entry.service';

@Component({
  templateUrl: './entry-delete-dialog.component.html',
})
export class EntryDeleteDialogComponent {
  entry?: IEntry;

  constructor(protected entryService: EntryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('entryListModification');
      this.activeModal.close();
    });
  }
}
