import app from "../axiosConfig";
import React, { Component } from "react";

class Registrations extends Component {
  state = {
    regs: [],
    grades: [],
    gpa: 0,
  };
  componentDidMount() {
    this.showRegistrations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.showRegistrations();
    }
  }

  handleChange = (e, regid) => {
    const { value } = e.target;
    app
      .patch(`/api/reg/update`, {
        gradeid: value,
        regid: regid,
      })
      .then(() => {
        app.get(`/api/reg/gpa/${this.props.regno}`).then((res) => {
          let [regs, gpa] = res.data;
          this.setState({
            regs: regs,
            gpa: gpa.gpa,
          });
        });
      });
  };

  showRegistrations = () => {
    const { regs, grades, gpa } = this.props;
    this.setState({
      regs: regs,
      grades: grades,
      gpa: gpa === null ? 0 : gpa.gpa,
    });
  };
  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Cr. Hr.</th>
              <th>Grade</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            {this.state.regs.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.course.code}</td>
                <td>{reg.course.title}</td>
                <td>{reg.course.crhr}</td>
                <td>
                  <select
                    onChange={(e) => {
                      this.handleChange(e, reg._id);
                    }}
                    name="grades"
                    defaultValue={reg.gradeid || ""}
                  >
                    <option hidden value=""></option>
                    {this.state.grades.map((grade) => (
                      <option key={grade._id} value={grade.gradeid}>
                        {grade.grade}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{reg.gradeid === null ? "" : reg.grade.gpa}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Total:{" "}
                {this.state.gpa !== null ? this.state.gpa.toFixed(2) : ""}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Registrations;
