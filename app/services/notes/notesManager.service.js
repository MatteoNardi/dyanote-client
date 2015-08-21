
class notesManager {
  constructor (notesGraph, backend, notifications, openNotes) {
    this.notesGraph = notesGraph;
    this.backend = backend;
    this.loaded = new Set();

    // Keep the graph of notes updated
    backend.onGraphUpdate(graph => {
      var rootNote;
      for (let note in graph) {
        if (!graph[note] && !rootNote)
          rootNote = note;
        notesGraph.setParent(note, graph[note]);
      }

      if (openNotes.notes.length === 0)
        openNotes.open(rootNote);
    });

    openNotes.addOpenHandler(note => this.load(note));
  }

  load (note) {
    if (!this.loaded.has(note)) {
      this.loaded.add(note);
      this.backend.onTitleUpdate(note, title => this.notesGraph.setTitle(note, title));
      this.backend.onBodyUpdate(note, body => this.notesGraph.setBody(note, body));
    }
  }

  newNote (parent, title) {
    title = title || "New note";
    return this.backend.newNote(parent, title);
  }

  setTitle (id, title) {
    // notesCoherenceTools.renameLink(note.parent, note, oldTitle);
    this.backend.updateTitle(id, title);
  }

  setBody (id, body) {
    // TODO: check if all children are still present and move to
    // lost&found the ones which are not.
    this.backend.updateBody(id, body);
  }

  archiveNote (id) {
    // notifications.warn('"' + note.title + '" was moved to "' + note.parent.title + '"');
    // notesCoherenceTools.removeLink(oldParent, note.url);
  }
}

angular.module('dyanote').service('notesManager', notesManager);
