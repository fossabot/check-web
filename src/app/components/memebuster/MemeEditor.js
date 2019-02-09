import React from 'react';
import TextField from '@material-ui/core/TextField';
import { CirclePicker } from 'react-color';
import UploadImage from '../UploadImage';

class MemeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e) => {
    if (this.props.onParamChange) {
      const param = {};
      param[e.target.name] = e.target.value;
      this.props.onParamChange(param);
    }
  };

  handleColorSelect = (color) => {
    if (this.props.onParamChange) {
      this.props.onParamChange({ overlayColor: color.hex });
    }
  };

  handleImage = (image) => {
    if (this.props.onParamChange) {
      const param = { image: image.preview };
      this.props.onParamChange(param);
    }
  };

  render() {
    return (
      <div>
        <UploadImage onImage={this.handleImage} />
        <TextField
          name="headline"
          label="Headline"
          onChange={this.handleChange}
          value={this.props.params.headline}
          margin="normal"
          fullWidth
        />
        <TextField
          name="description"
          label="Description"
          onChange={this.handleChange}
          value={this.props.params.description}
          margin="normal"
          fullWidth
          multiline
        />
        <TextField
          name="statusText"
          label="Status Text"
          onChange={this.handleChange}
          value={this.props.params.statusText}
          margin="normal"
        />
        <TextField
          name="overlayColor"
          label="Overlay color"
          onChange={this.handleChange}
          value={this.props.params.overlayColor}
          margin="normal"
        />
        <CirclePicker onChangeComplete={this.handleColorSelect} />
      </div>
    );
  }
}

export default MemeEditor;
