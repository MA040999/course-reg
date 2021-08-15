import app from "../axiosConfig";
import React, { Component } from "react";
import Registrations from "./Registrations";
import Semester from "./Semester";
import Courses from "./Courses";

class Student extends Component {
  state = {
    selectedSem: "",
    regno: "",
    student: {},
    showStudent: false,
    regs: [],
    grades: [],
    gpa: {},
    showRegs: false,
    err: "",
  };

  updateRegs = () => {
    app.get(`/api/reg/${this.state.regno}`).then((res) => {
      let [regs, grades, gpa] = res.data;
      this.setState({ regs: regs, grades: grades, gpa: gpa, showRegs: true });
    });
  };

  onInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setSelectedSem = (selectedSem) => {
    this.setState({ selectedSem: selectedSem });
  };

  getStudent = (e) => {
    if (e.which === 13) {
      app
        .get(`/api/students/${this.state.regno}`)
        .then((student) => {
          if (student.data !== "") {
            this.setState({
              student: student.data,
              showStudent: true,
              err: "",
            });
          } else {
            this.setState({
              selectedSem: "",
              student: {},
              showStudent: false,
              regs: [],
              grades: [],
              gpa: {},
              err: "Student not found!",
              showRegs: false,
            });
          }
        })
        .then(() => {
          if (this.state.showStudent) {
            this.updateRegs();
          }
        });
    }
  };

  render() {
    return (
      <div className="parent">
        <div className="col">
          <div
            style={{
              color: "red",
              marginBlock: "1rem",
            }}
          >
            {this.state.err}
          </div>
          <label>
            <b>Reg No :</b>
            <input
              style={{
                marginInline: "1rem",
                padding: "0.5rem",
              }}
              type="text"
              name="regno"
              onKeyDown={this.getStudent}
              value={this.state.regno}
              placeholder="Registraion Number"
              onChange={this.onInputChange}
            />
          </label>
          {this.state.showStudent && (
            <div
              style={{
                marginBlock: "3rem",
                textAlign: "left",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <th>Student Name: </th>
                    <td>{this.state.student.studentname}</td>
                  </tr>
                  <tr>
                    <th>Father Name: </th>
                    <td>{this.state.student.fathername}</td>
                  </tr>
                </tbody>
              </table>
              <Semester
                setSelectedSem={this.setSelectedSem}
                updateRegs={this.updateRegs}
                regno={this.state.regno}
                regs={this.state.regs}
              />
              {this.state.selectedSem !== "" && (
                <Courses
                  updateRegs={this.updateRegs}
                  semester={this.state.selectedSem}
                  regno={this.state.regno}
                  regs={this.state.regs}
                />
              )}
            </div>
          )}
        </div>
        <div className="col">
          {this.state.showRegs && (
            <Registrations
              regno={this.state.regno}
              regs={this.state.regs}
              grades={this.state.grades}
              gpa={this.state.gpa}
            />
          )}
        </div>
        {/* <div className="col small-col">
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div> */}
      </div>
    );
  }
}

export default Student;
