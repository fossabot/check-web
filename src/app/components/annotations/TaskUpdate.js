import React from 'react';
import { FormattedMessage } from 'react-intl';

class EmbedUpdate extends React.Component {
  render() {
    const changes = JSON.parse(this.props.activity.object_changes_json);
    if (changes.data) {
      const from = changes.data[0];
      const to = changes.data[1];
      let editedTitle = false;
      let editedNote = false;
      let createdNote = false;
      if (from.label && to.label && from.label != to.label) {
        editedTitle = true;
      }
      if (to.description && from.description != to.description) {
        editedNote = true;
      }
      if (!from.description && to.description) {
        editedNote = false;
        createdNote = true;
      }
      const author = this.props.authorName;
      if (editedTitle || editedNote || createdNote) {
        return (
          <span>
            <span className="annotation__update-task" />
            {editedTitle
                ? <FormattedMessage
                  id="annotation.taskLabelUpdated"
                  defaultMessage={'Task "{from}" edited to "{to}" by {author}'}
                  values={{ from: from.label, to: to.label, author }}
                />
                : null}
            { editedTitle && editedNote && <br />}
            {editedNote
                ? <FormattedMessage
                  id="annotation.taskNoteUpdated"
                  defaultMessage={
                      'Task "{title}" has note edited from "{from}" to "{to}" by {author}'
                    }
                  values={{ title: to.label, from: from.description, to: to.description, author }}
                />
                : null}
            { editedTitle && createdNote && <br />}
            {createdNote
                ? <FormattedMessage
                  id="annotation.taskNoteCreated"
                  defaultMessage={'Task "{title}" has new note "{note}" by {author}'}
                  values={{ title: to.label, note: to.description, author }}
                />
                : null}
          </span>
          );
      }

      return null;
    }
  }
}

export default EmbedUpdate;
