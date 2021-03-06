import Relay from 'react-relay/classic';

class UpdateTaskMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation updateTask {
      updateTask
    }`;
  }

  getFatQuery() {
    if (this.props.operation === 'answer') {
      return Relay.QL`fragment on UpdateTaskPayload {
        first_response_versionEdge
        task {
          status
          responses
          first_response
        },
        project_media {
          translation_statuses,
          verification_statuses,
          last_status,
          id,
          log_count,
          field_value(annotation_type_field_name: "translation_status:translation_status_status"),
          translation_status: annotation(annotation_type: "translation_status")
        },
      }`;
    }
    return Relay.QL`fragment on UpdateTaskPayload {
      task,
      project_media {
        translation_statuses,
        verification_statuses,
        last_status,
        log,
        id,
        log_count,
        field_value(annotation_type_field_name: "translation_status:translation_status_status"),
        translation_status: annotation(annotation_type: "translation_status")
      },
    }`;
  }

  getOptimisticResponse() {
    if (this.props.operation === 'answer') {
      const { task, user } = this.props;
      const content = [];
      Object.keys(task.fields).forEach((field) => {
        content.push({
          field_name: field,
          value: task.fields[field],
        });
      });

      return {
        task: {
          id: task.id,
          assignments: {
            edges: [],
          },
          first_response: {
            permissions: '{}',
            content: JSON.stringify(content),
            attribution: {
              edges: [
                {
                  node: {
                    name: user ? user.name : '',
                    source: {
                      image: user ? user.profile_image : '',
                    },
                  },
                },
              ],
            },
          },
        },
      };
    }
    if (this.props.operation === 'update') {
      const { task } = this.props;
      return { task };
    }
    return {};
  }

  getVariables() {
    const { task } = this.props;
    const params = { id: task.id };
    if (task.accept_suggestion) {
      params.accept_suggestion = task.accept_suggestion;
    } else if (task.reject_suggestion) {
      params.reject_suggestion = task.reject_suggestion;
    } else if (task.annotation_type && task.fields) {
      params.response = JSON.stringify({
        annotation_type: task.annotation_type,
        set_fields: JSON.stringify(task.fields),
      });
    } else if (task.label) {
      params.label = task.label;
      params.description = task.description;
      params.required = task.required;
      params.status = task.status;
      params.assigned_to_ids = task.assigned_to_ids;
    }
    return params;
  }

  getConfigs() {
    const fieldIDs = { task: this.props.task.id };
    if (this.props.annotated) {
      fieldIDs.project_media = this.props.annotated.id;
    }
    const configs = [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs,
      },
    ];
    if (this.props.operation === 'answer') {
      configs.push({
        type: 'RANGE_ADD',
        parentName: 'project_media',
        parentID: this.props.annotated.id,
        connectionName: 'log',
        edgeName: 'first_response_versionEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      });
    }
    return configs;
  }
}

export default UpdateTaskMutation;
