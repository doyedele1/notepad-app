import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
// import { resolve } from 'dns';

import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  
  // set up class members
  public notes: Note[] = [];
  public loaded: boolean = false;

  constructor(private storage: Storage) {

  }

  load(): Promise<boolean> {

    // return a promise so that we know when this operation has been completed- asynchronous behaviour
    return new Promise((resolve) => {

      // get the notes that were saved into storage
      this.storage.get('notes').then((notes) => {

        // only set this.notes to the returned value if there were values stored
        if(notes != null) {
          this.notes = notes;
        }

        // this allows us to check if the data has been loaded in or not
        this.loaded = true;
        resolve(true);

      });
    
    });

  }

  save(): void {

    // save the current array of notes to storage
    this.storage.set('notes', this.notes);
  }

  getNote(id): Note {

    // return the note that has an id matching the id passed in 
    return this.notes.find(note => note.id === id);
  }

  createNote(title): void {

    // create a unique id that is one larger than the current largest id
    let id = Math.max(...this.notes.map(note => parseInt(note.id)), 0) + 1;

    this.notes.push({
      id: id.toString(),
      title: title,
      content: ''
    });

    this.save();
  }

  deleteNote(note): void {

    // get the index in the array of the note that was passed in
    let index = this.notes.indexOf(note);

    // delete that element of the array and resave the data
    if(index > -1) {
      this.notes.splice(index, 1);
      this.save();
    }
  }
}
