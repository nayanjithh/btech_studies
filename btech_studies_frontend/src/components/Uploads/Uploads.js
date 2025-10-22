import React, { useRef, useState } from "react";
import "./Uploads.css";
import axios from "axios";

export default function Uploads() {
    const [semester, setSemester] = useState("");
    const [branch, setBranch] = useState("");
    const [module, setModule] = useState("");
    const [noteType, setNoteType] = useState("");
    const [subject, setSubject] = useState("");
    const fileSelected = useRef(null);

    const clear = () => {
        fileSelected.current.value = null;
    };

    const handleUpload = async () => {
        if ((!semester || !branch || !noteType || !subject || !fileSelected.current.files[0])){
            alert("Please fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append("semester", semester);
        formData.append("branch", branch);
        formData.append("note_type", noteType);
        formData.append("module", module);
        formData.append("subject", subject);
        formData.append("file", fileSelected.current.files[0]);

        try {
            const response = await axios.post("http://127.0.0.1:8000/upload/",formData);
        } catch (e) {
            console.error(e);
            alert("Failed Upload");
        }
    }

  const subjectsData = {
    cs: {
      s1: ["Engineering Mathematics I", "Engineering Physics", "Engineering Chemistry", "Basics of Electrical & Electronics", "Engineering Graphics", "Civil & Mechanical Workshop"],
      s2: ["Engineering Mathematics II", "Computer Programming", "Engineering Mechanics", "Basic Civil Engineering", "Electronics Workshop", "Computer Workshop"],
      s3: ["Data Structures", "Digital Logic Design", "Computer Organization", "Discrete Mathematical Structures", "Object-Oriented Programming", "Environmental Studies"],
      s4: ["Database Management Systems", "Operating Systems", "Computer Networks", "Design and Analysis of Algorithms", "Microprocessors", "Management and Economics"],
      s5: ["Compiler Design", "Software Engineering", "Computer Graphics", "Theory of Computation", "Web Technologies"],
      s6: ["Machine Learning", "Distributed Systems", "Embedded Systems", "System Software", "Cloud Computing"],
      s7: ["Artificial Intelligence", "Data Mining", "Information Security", "IoT Systems", "Elective I"],
      s8: ["Project Work", "Seminar", "Comprehensive Viva", "Elective II"],
    },

    ece: {
      s1: ["Engineering Mathematics I", "Engineering Physics", "Engineering Chemistry", "Basic Electrical Engineering", "Engineering Graphics", "Mechanical Workshop"],
      s2: ["Engineering Mathematics II", "Programming in C", "Network Analysis", "Basic Civil Engineering", "Electronics Workshop", "Computer Workshop"],
      s3: ["Electronic Circuits I", "Digital Electronics", "Signals and Systems", "Network Theory", "Electronic Measurements"],
      s4: ["Electronic Circuits II", "Microprocessors & Microcontrollers", "Control Systems", "Communication Engineering", "Probability and Random Processes"],
      s5: ["Analog Communication", "Digital Communication", "Linear Integrated Circuits", "Digital Signal Processing", "Microcontroller Applications"],
      s6: ["Microwave Engineering", "VLSI Design", "Information Theory and Coding", "Computer Communication", "Elective I"],
      s7: ["Embedded System Design", "Optical Communication", "Wireless Networks", "Elective II"],
      s8: ["Project Work", "Seminar", "Comprehensive Viva", "Elective III"],
    },

    eee: {
      s1: ["Engineering Mathematics I", "Engineering Physics", "Engineering Chemistry", "Basic Electrical Engineering", "Mechanical Workshop", "Engineering Graphics"],
      s2: ["Engineering Mathematics II", "Programming in C", "Basic Electronics", "Engineering Mechanics", "Civil Workshop", "Computer Workshop"],
      s3: ["Circuit Theory", "Analog Electronics", "Electrical Machines I", "Measurements and Instrumentation", "Electromagnetic Theory"],
      s4: ["Electrical Machines II", "Digital Electronics", "Power Electronics", "Control Systems", "Power Generation and Distribution"],
      s5: ["Power Systems", "Microprocessors", "Analog Communication", "Renewable Energy Systems", "Signals & Systems"],
      s6: ["Digital Signal Processing", "Electrical Machine Design", "Embedded Systems", "Electrical Drives", "Elective I"],
      s7: ["Power System Protection", "Energy Management", "High Voltage Engineering", "Elective II"],
      s8: ["Project Work", "Seminar", "Comprehensive Viva", "Elective III"],
    },

    me: {
      s1: ["Engineering Mathematics I", "Engineering Physics", "Engineering Chemistry", "Engineering Graphics", "Basic Electrical Engineering", "Workshop Practice"],
      s2: ["Engineering Mathematics II", "Computer Programming", "Engineering Mechanics", "Thermodynamics", "Civil Workshop"],
      s3: ["Mechanics of Solids", "Fluid Mechanics", "Manufacturing Process I", "Thermal Engineering I", "Electrical Drives"],
      s4: ["Kinematics of Machinery", "Fluid Machinery", "Manufacturing Process II", "Thermal Engineering II", "Machine Drawing"],
      s5: ["Dynamics of Machinery", "Heat Transfer", "Design of Machine Elements I", "Metrology", "Refrigeration and Air Conditioning"],
      s6: ["Design of Machine Elements II", "Automobile Engineering", "Finite Element Analysis", "Computer Integrated Manufacturing", "Elective I"],
      s7: ["Industrial Engineering", "Robotics", "Advanced Manufacturing", "Elective II"],
      s8: ["Project Work", "Seminar", "Comprehensive Viva", "Elective III"],
    },

    ic: {
      s1: ["Engineering Mathematics I", "Engineering Physics", "Engineering Chemistry", "Basic Electrical Engineering", "Engineering Graphics", "Workshop Practice"],
      s2: ["Engineering Mathematics II", "Programming in C", "Basic Electronics", "Engineering Mechanics", "Civil Workshop"],
      s3: ["Electrical Circuits", "Analog Electronics", "Digital Electronics", "Sensors & Transducers", "Measurement Systems"],
      s4: ["Microprocessors & Microcontrollers", "Control Systems", "Industrial Instrumentation", "Transducer Engineering", "Signal Conditioning"],
      s5: ["Process Control", "Biomedical Instrumentation", "Analytical Instruments", "Digital Signal Processing", "Elective I"],
      s6: ["Embedded Systems", "Industrial Automation", "Data Acquisition Systems", "Elective II"],
      s7: ["Instrumentation System Design", "Power Plant Instrumentation", "Elective III"],
      s8: ["Project Work", "Seminar", "Comprehensive Viva"],
    },
  };

  const subjectsList = subjectsData[branch]?.[semester] || [];

  return (
    <div className="upload-container">
        <h2>Upload Your Notes</h2>

        <select className="sem" value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
            <option key={i} value={`s${i + 1}`}>{`S${i + 1}`}</option>
            ))}
        </select>

        <select className="branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            <option value="cs">CSE</option>
            <option value="eee">EEE</option>
            <option value="ece">ECE</option>
            <option value="ic">IC</option>
            <option value="me">ME</option>
        </select>

        <select className="notes" value={noteType} onChange={(e) => setNoteType(e.target.value)}>
            <option value="">Select Notes Type</option>
            <option value="krn">Kerala Notes</option>
            <option value="ktn">KTU Notes</option>
            <option value="hw">Handwritten Notes</option>
        </select>

        <select className="subjects" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjectsList.map((sub, i) => (
            <option key={i} value={sub.toLowerCase().replace(/\s+/g, "_")}>
                {sub}
            </option>
            ))}
        </select>

        <select value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="">Select Module</option>
          <option value="M1">Module 1</option>
          <option value="M2">Module 2</option>
          <option value="M3">Module 3</option>
          <option value="M4">Module 4</option>
          <option value="M5">Module 5</option>
        </select>

        <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                if (file.type !== "application/pdf") {
                    alert("Please select a PDF file");
                    e.target.value = null;
                }
                }
            }} 
            id="selectedFile" ref={fileSelected}/>
        <button onClick={clear}>Clear</button>
        <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
