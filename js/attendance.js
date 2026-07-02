// ================================
// ATTENDANCE MANAGEMENT
// ================================

let editIndex = -1;

// Open Popup
function openAttendanceForm() {
    document.getElementById("attendanceFormModal").classList.add("active");
}

// Close Popup
function closeAttendanceForm() {

    document.getElementById("attendanceFormModal").classList.remove("active");

    document.getElementById("attendanceForm").reset();

    editIndex = -1;
}

// Page Load
document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("attendanceList")) {

        const students = [

            {
                regno: "240310101001",
                name: "Hari Prakash",
                dept: "CSE",
                year: "III Year",
                percent: 75,
                status: "Present"
            },

            {
                regno: "240310101002",
                name: "Lokeshwaran",
                dept: "CSE",
                year: "III Year",
                percent: 55,
                status: "Absent"
            },

            {
                regno: "240310101003",
                name: "Lorin Tedros",
                dept: "CSE",
                year: "III Year",
                percent: 82,
                status: "Present"
            },

            {
                regno: "240310101004",
                name: "Meenakshi",
                dept: "CSE",
                year: "III Year",
                percent: 65,
                status: "Present"
            },

            {
                regno: "240310101005",
                name: "Satish Kumar",
                dept: "CSE",
                year: "III Year",
                percent: 75,
                status: "Present"
            },

            {
                regno: "240310101006",
                name: "Subiksha",
                dept: "CSE",
                year: "III Year",
                percent: 90,
                status: "Present"
            },

            {
                regno: "240310101007",
                name: "Varalakshmi",
                dept: "CSE",
                year: "III Year",
                percent: 88,
                status: "Present"
            }

        ];

        localStorage.setItem(
            "attendanceList",
            JSON.stringify(students)
        );
    }

    document
        .getElementById("attendanceForm")
        .addEventListener("submit", saveAttendance);

    document
        .getElementById("searchInput")
        .addEventListener("keyup", searchAttendance);

    refreshTable();

});
// Save Attendance
function saveAttendance(e) {

    e.preventDefault();

    let attendanceList =
        JSON.parse(localStorage.getItem("attendanceList")) || [];

    let student = {

        regno: document.getElementById("form-regno").value,
        name: document.getElementById("form-name").value,
        dept: document.getElementById("form-dept").value,
        year: document.getElementById("form-year").value,
        percent: document.getElementById("form-percent").value,
        status: document.getElementById("form-status").value

    };

    if (editIndex === -1) {

        attendanceList.push(student);

    } else {

        attendanceList[editIndex] = student;

    }

    localStorage.setItem(
        "attendanceList",
        JSON.stringify(attendanceList)
    );

    refreshTable();

    closeAttendanceForm();

    alert("Attendance Saved Successfully!");

}

function refreshTable() {

    const tbody = document.querySelector("#attendanceTable tbody");

    tbody.innerHTML = "";

    let attendanceList =
        JSON.parse(localStorage.getItem("attendanceList")) || [];

    attendanceList.forEach(function(student, index){

        tbody.innerHTML += `

        <tr>

            <td>${student.regno}</td>

            <td>${student.name}</td>

            <td>${student.dept}</td>

            <td>${student.year}</td>

            <td>${student.percent}%</td>

            <td>
                <span class="status ${student.status.toLowerCase()}">
                    ${student.status}
                </span>
            </td>

            <td>

                <button class="edit-btn"
                    onclick="editAttendance(${index})">
                    ✏ Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteAttendance(${index})">
                    🗑 Delete
                </button>

            </td>

        </tr>

        `;

    });

    // Summary Cards
    const totalStudents = document.getElementById("totalStudents");
    const presentStudents = document.getElementById("presentStudents");
    const absentStudents = document.getElementById("absentStudents");
    const averageAttendance = document.getElementById("averageAttendance");

    if(totalStudents){

        totalStudents.innerText = attendanceList.length;

        let present =
            attendanceList.filter(s => s.status === "Present").length;

        let absent =
            attendanceList.filter(s => s.status === "Absent").length;

        presentStudents.innerText = present;
        absentStudents.innerText = absent;

        let total = 0;

        attendanceList.forEach(function(s){
            total += Number(s.percent);
        });

        averageAttendance.innerText =
            attendanceList.length > 0
            ? Math.round(total / attendanceList.length) + "%"
            : "0%";

    }

}
// Edit Attendance
function editAttendance(index) {

    let attendanceList =
        JSON.parse(localStorage.getItem("attendanceList")) || [];

    let student = attendanceList[index];

    editIndex = index;

    document.getElementById("form-regno").value = student.regno;
    document.getElementById("form-name").value = student.name;
    document.getElementById("form-dept").value = student.dept;
    document.getElementById("form-year").value = student.year;
    document.getElementById("form-percent").value = student.percent;
    document.getElementById("form-status").value = student.status;

    openAttendanceForm();

}

// Delete Attendance
function deleteAttendance(index) {

    if (!confirm("Delete this record?")) return;

    let attendanceList =
        JSON.parse(localStorage.getItem("attendanceList")) || [];

    attendanceList.splice(index, 1);

    localStorage.setItem(
        "attendanceList",
        JSON.stringify(attendanceList)
    );

    refreshTable();

}

// Search Attendance
function searchAttendance() {

    let value =
        document.getElementById("searchInput").value.toLowerCase();

    let rows =
        document.querySelectorAll("#attendanceTable tbody tr");

    rows.forEach(function(row) {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    });

}

