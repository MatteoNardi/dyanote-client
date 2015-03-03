'use strict';

angular.module('dyanote')

// Controller for the notes view.
// It is responsible for navigation (via breadcrumb or clicked links)
.controller('NotesCtrl', function ($scope, $log, $location, $timeout, openNotes, notesGraph) {
  $scope.notes = openNotes.notes;

  $scope.$on('openNote', function (event, callerNoteId, targetNoteId) {
    var callerNote = notesGraph.getById(callerNoteId);
    var targetNote = notesGraph.getById(targetNoteId);
    openNotes.open(targetNote, callerNote);
    $scope.$broadcast('$scrollToNote', targetNote);
    event.preventDefault();
    event.stopPropagation();
  });

  $scope.onBreadcrumbItemClicked = function ($event, note) {
    $event.preventDefault();
    $scope.$broadcast('$scrollToNote', note);
  };

  $scope.archive = function (note) {
    note.archive();
    var pos = openNotes.notes.indexOf(note);

    if (pos > 0) {
      var previous = openNotes.notes[pos -1];
      $scope.$broadcast('$scrollToNote', previous);
      $timeout(function () {
        openNotes.close(note);
      }, 500);
    }
  };

  // Show a dialog to move the note to a new parent.
  $scope.showMoveDialog = function (note) {
    console.log('show move dialog', note);
  };
});