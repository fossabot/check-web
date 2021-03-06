import Relay from 'react-relay/classic';

class CreateDynamicMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createDynamic {
      createDynamic
    }`;
  }

  getFatQuery() {
    switch (this.props.parent_type) {
    case 'source':
      return Relay.QL`fragment on CreateDynamicPayload {
        dynamicEdge,
        source {
          log,
          log_count,
          languages: annotations(annotation_type: "language", first: 10000)
        }
      }`;
    case 'project_media':
      return Relay.QL`fragment on CreateDynamicPayload {
        dynamicEdge,
        project_media {
          log,
          log_count,
          field_value(annotation_type_field_name: "translation_status:translation_status_status"),
          translation_status: annotation(annotation_type: "translation_status"),
          translations: annotations(annotation_type: "translation", first: 10000)
        }
      }`;
    case 'project_source':
      return Relay.QL`fragment on CreateDynamicPayload {
        dynamicEdge,
        project_source {
          source {
            log,
            log_count,
            languages: annotations(annotation_type: "language", first: 10000)
          }
        }
      }`;
    default:
      return '';
    }
  }

  getFiles() {
    if (this.props.image) {
      return { 'file[]': this.props.image };
    }
    return {};
  }

  getVariables() {
    const dynamic = this.props.annotation;
    return {
      set_fields: JSON.stringify(dynamic.fields), annotation_type: dynamic.annotation_type, annotated_id: `${dynamic.annotated_id}`, annotated_type: dynamic.annotated_type,
    };
  }

  getConfigs() {
    const fieldIds = {};
    fieldIds[this.props.parent_type] = this.props.annotated.id;

    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: fieldIds,
      },
    ];
  }
}

export default CreateDynamicMutation;
