import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadStudents = () => {
    axios.get("http://localhost:5000/students").then((response) => {
      setStudents(response.data);
    });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const clearForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditId(null);
  };

  const saveStudent = () => {
  if (name == "" || course == "" || age == "") {
    setError("Please fill in all fields.");
    return;
  }



  setError("");

  if (editId) {
    axios
      .put(`http://localhost:5000/students/${editId}`, { name, course, age })
      .then(() => {
        loadStudents();
        clearForm();
      });
  } else {
    axios
      .post("http://localhost:5000/students", { name, course, age })
      .then(() => {
        loadStudents();
        clearForm();
      });
  }
};

  const deleteStudent = (id) => {
    axios.delete(`http://localhost:5000/students/${id}`).then(() => {
      loadStudents();
    });
  };

  const editStudent = (student) => {
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditId(student._id);
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>{editId ? "Edit Student" : "Add Student"}</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={saveStudent}>
        
        {editId ? "Update Student" : "Add Student"}
      </button>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => editStudent(student)}>Edit</button>
          <button onClick={() => deleteStudent(student._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;