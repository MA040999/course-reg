import app from "../axiosConfig";
import React, { Component } from "react";

class Courses extends Component {
  state = {
    regno: "",
    masterChk: false,
    selectedCourses: [],
    courses: [],
    registered: [],
  };

  componentDidMount() {
    this.getCourses();
    this.getRegisteredIDs();
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.getCourses();
      this.getRegisteredIDs();
    }
  }

  getRegisteredIDs = () => {
    const { regs } = this.props;
    let registeredIDs = [];
    regs.map((reg) => {
      registeredIDs.push(reg.courseid);
      return null;
    });
    this.setState({ registered: registeredIDs });
  };

  handleRegister = () => {
    app
      .post(`/api/reg/add`, {
        courseids: JSON.stringify(this.state.selectedCourses),
        regno: this.state.regno,
      })
      .then(() => {
        this.props.updateRegs();
        this.setState({ selectedCourses: [] });
      });
  };

  checkMaster = () => {
    var flag = 0;
    this.state.courses.map((course) => {
      if (this.state.registered.includes(course.courseid) === false) {
        if (this.state.selectedCourses.includes(course.courseid) === false) {
          flag = 1;
        }
      }
    });
    if (flag !== 1) {
      this.setState({ masterChk: true });
    } else {
      this.setState({ masterChk: false });
    }
  };

  getCourses = () => {
    const { semester, regno } = this.props;

    app.get(`/api/courses/${semester}`).then((courses) => {
      this.setState({ courses: courses.data, regno: regno }, this.checkMaster);
    });
  };

  handleMasterChk = () => {
    const { selectedCourses, masterChk, courses } = this.state;

    if (!masterChk) {
      courses.map((course) => {
        if (this.state.registered.includes(course.courseid) === false) {
          const index = selectedCourses.indexOf(course.courseid);
          if (index === -1) {
            selectedCourses.push(course.courseid);
          }
        }
      });
    } else {
      courses.map((course) => {
        const index = selectedCourses.indexOf(course.courseid);
        if (index !== -1) {
          selectedCourses.splice(index, 1);
        }
      });
    }
    this.setState({ selectedCourses: selectedCourses, masterChk: !masterChk });
  };

  handleCheck = (e) => {
    var { value } = e.target;
    value = Number(value);
    const { selectedCourses } = this.state;
    if (selectedCourses.includes(value)) {
      selectedCourses.splice(selectedCourses.indexOf(value), 1);
    } else {
      selectedCourses.push(value);
    }
    this.setState({ selectedCourses }, this.checkMaster);
  };

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="master"
                  value={this.state.masterChk}
                  checked={this.state.masterChk}
                  onChange={this.handleMasterChk}
                />
              </th>
              <th>Code</th>
              <th>Title</th>
              <th>Cr. Hr.</th>
            </tr>
          </thead>
          <tbody>
            {this.state.courses.map((course) => (
              <tr key={course._id}>
                <td>
                  {this.state.registered.includes(course.courseid) === false ? (
                    <input
                      type="checkbox"
                      name="chkbox"
                      checked={this.state.selectedCourses.includes(
                        course.courseid
                      )}
                      value={course.courseid}
                      onChange={this.handleCheck}
                    />
                  ) : (
                    ""
                  )}
                </td>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.crhr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.selectedCourses.length > 0 && (
          <button
            style={{
              marginBlock: "2rem",
              padding: "0.8rem",
              borderRadius: "0.5rem",
            }}
            onClick={this.handleRegister}
          >
            Register
          </button>
        )}
      </div>
    );
  }
}

export default Courses;
