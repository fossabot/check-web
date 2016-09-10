import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class CreateFlagMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createFlag {
      createFlag
    }`;
  }

  getFatQuery() {
    var query = '';
    switch (this.props.parent_type) {
      case 'source':
        query = Relay.QL`fragment on CreateFlagPayload { flagEdge, source { annotations } }`;
        break;
      case 'media':
        query = Relay.QL`fragment on CreateFlagPayload { flagEdge, media { annotations } }`;
        break;
    }
    return query;
  }

  getVariables() {
    var flag = this.props.annotation;
    var vars = { flag: flag.flag, annotated_id: flag.annotated_id + '', annotated_type: flag.annotated_type };
    if (Checkdesk.context.project) {
      vars.context_type = 'Project';
      vars.context_id = Checkdesk.context.project.dbid.toString();
    }
    return vars;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: this.props.parent_type,
      parentID: this.props.annotated.id,
      connectionName: 'annotations',
      edgeName: 'flagEdge',
      rangeBehaviors: {
        '': 'prepend'
      }
    }];
  }
}

export default CreateFlagMutation;