// ================================
// FACULTY MANAGEMENT
// ================================

// Open Popup
function openFacultyForm() {
    document.getElementById("facultyFormModal").classList.add("active");
}

// Close Popup
function closeFacultyForm() {
    document.getElementById("facultyFormModal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {

    // Load saved faculty
    loadFaculty();

    // Form Submit
    document.getElementById("facultyForm").addEventListener("submit", saveFaculty);

    // Search
    document.getElementById("searchInput").addEventListener("keyup", searchFaculty);

});


// ================================
// SAVE FACULTY
// ================================

function saveFaculty(e) {

    e.preventDefault();

    const faculty = {
        id: document.getElementById("form-id").value,
        name: document.getElementById("form-name").value,
        designation: document.getElementById("form-designation").value,
        department: document.getElementById("form-dept").value,
        subject: document.getElementById("form-subject").value
    };

    let facultyList = JSON.parse(localStorage.getItem("facultyList")) || [];

    facultyList.push(faculty);

    localStorage.setItem("facultyList", JSON.stringify(facultyList));

    addFacultyRow(faculty, facultyList.length - 1);

    document.getElementById("facultyForm").reset();

    closeFacultyForm();

    alert("Faculty Added Successfully!");

}


// ================================
// ADD ROW
// ================================

function addFacultyRow(faculty, index) {

    const tbody = document.querySelector("#facultyTable tbody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${faculty.id}</td>
        <td>${faculty.name}</td>
        <td>${faculty.designation}</td>
        <td>${faculty.department}</td>
        <td>${faculty.subject}</td>
        <td><span class="status active">Active</span></td>
        <td>
            <button class="delete-btn" onclick="deleteFaculty(${index}, this)">
                🗑 Delete
            </button>
        </td>
    `;

    tbody.appendChild(row);

}


// ================================
// LOAD SAVED FACULTY
// ================================

function loadFaculty() {

    let facultyList = JSON.parse(localStorage.getItem("facultyList")) || [];

    facultyList.forEach((faculty, index) => {

        addFacultyRow(faculty, index);

    });

}


// ================================
// DELETE FACULTY
// ================================

function deleteFaculty(index, btn) {

    if (!confirm("Delete this Faculty?")) return;

    let facultyList = JSON.parse(localStorage.getItem("facultyList")) || [];

    facultyList.splice(index, 1);

    localStorage.setItem("facultyList", JSON.stringify(facultyList));

    btn.closest("tr").remove();

}


// ================================
// SEARCH
// ================================

function searchFaculty() {

    let value = document.getElementById("searchInput").value.toLowerCase();

    let rows = document.querySelectorAll("#facultyTable tbody tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}