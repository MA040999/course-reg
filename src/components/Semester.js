import React, { Component } from "react";
import app from "../axiosConfig";

class Semester extends Component {
  state = {
    semester: "",
    sems: [],
    show: false,
  };
  componentDidMount() {
    this.getSems();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, show: true });
    this.props.setSelectedSem(value);
  };
  getSems = () => {
    app.get(`/api/courses/all`).then((sem) => {
      this.setState({ sems: sem.data });
    });
  };
  render() {
    return (
      <div>
        <b>Semester :</b>
        <select
          style={{
            marginBlock: "2rem",
            marginLeft: "1.5rem",
            padding: "0.3rem",
            width: "10rem",
          }}
          name="semester"
          value={this.state.semester}
          onChange={this.handleChange}
        >
          <option hidden value="">
            Select Semester...
          </option>
          {this.state.sems.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Semester;
