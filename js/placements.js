// ======================================
// Placement Management System
// ======================================

let placementData = [];

let editIndex = -1;

const STORAGE_KEY = "placement_students";
// ======================================
// Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadPlacements();

    displayPlacements();

    updateSummaryCards();

    document
        .getElementById("placementForm")
        .addEventListener("submit", savePlacement);

});
// ======================================
// Load Placement Data
// ======================================

function loadPlacements() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {

        placementData = JSON.parse(savedData);

    } else {

        placementData = [];

    }

}
// ======================================
// Save Data to LocalStorage
// ======================================

function saveToLocalStorage() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(placementData)

    );

}
// ======================================
// Display Placement Data
// ======================================

function displayPlacements() {

    const table = document.getElementById("students-table");

    const rows = table.querySelectorAll("tr");

    rows.forEach((row, index) => {

        if (index !== 0) {

            row.remove();

        }

    });

    placementData.forEach((student, index) => {

        const row = table.insertRow();

        row.innerHTML = `

            <td>${student.regNo}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>${student.status}</td>

            <td>

                <button class="edit-btn"
                onclick="editPlacement(${index})">

                ✏ Edit

                </button>

                <button class="delete-btn"
                onclick="deletePlacement(${index})">

                🗑 Delete

                </button>

            </td>

        `;

    });

}
// ======================================
// Update Summary Cards
// ======================================

function updateSummaryCards() {

    const total = placementData.length;

    const placed = placementData.filter(student =>
        student.status === "Placed"
    ).length;

    const registered = placementData.filter(student =>
        student.status !== "Not Registered"
    ).length;

    document.getElementById("total-students").innerText = total;

    document.getElementById("registered-students").innerText = registered;

    document.getElementById("placed-students").innerText = placed;

    document.getElementById("placement-status").innerText =
        placed > 0 ? "Ongoing" : "Preparation Phase";

}
// ======================================
// Save Placement
// ======================================

function savePlacement(event) {

    event.preventDefault();

    const student = {

        regNo: document.getElementById("reg-no").value,

        name: document.getElementById("student-name").value,

        department: document.getElementById("department").value,

        year: document.getElementById("year").value,

        status: document.getElementById("status").value

    };

    if (editIndex === -1) {

        placementData.push(student);

    } else {

        placementData[editIndex] = student;

        editIndex = -1;

    }

    saveToLocalStorage();

    displayPlacements();

    updateSummaryCards();

    closePlacementForm();

    document.getElementById("placementForm").reset();

}
// ======================================
// Edit Placement
// ======================================

function editPlacement(index) {

    editIndex = index;

    const student = placementData[index];

    document.getElementById("reg-no").value = student.regNo;

    document.getElementById("student-name").value = student.name;

    document.getElementById("department").value = student.department;

    document.getElementById("year").value = student.year;

    document.getElementById("status").value = student.status;

    document.getElementById("placementFormTitle").innerText =
        "Edit Placement";

    openPlacementForm();

}
// ======================================
// Delete Placement
// ======================================

function deletePlacement(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    placementData.splice(index, 1);

    saveToLocalStorage();

    displayPlacements();

    updateSummaryCards();

}
// ======================================
// Open / Close Modal
// ======================================

function openPlacementForm() {

    document
        .getElementById("placementFormModal")
        .classList.add("active");

}

function closePlacementForm() {

    document
        .getElementById("placementFormModal")
        .classList.remove("active");

    document
        .getElementById("placementForm")
        .reset();

    document
        .getElementById("placementFormTitle")
        .innerText = "Add Placement";

    editIndex = -1;

}
    
<div class="modal-overlay" id="companyModal">

    <div class="modal-card">

        <div class="modal-header">

            <h2>Add Company</h2>

            <button
                class="modal-close"
                onclick="closeCompanyModal()">

                &times;

            </button>

        </div>

        <div class="modal-body">

            <form id="companyForm" class="student-form">

                <label>

                    Company Name

                    <input
                        type="text"
                        id="companyName"
                        required>

                </label>

                <label>

                    Job Role

                    <input
                        type="text"
                        id="jobRole"
                        required>

                </label>

                <label>

                    Package (LPA)

                    <input
                        type="number"
                        id="package"
                        step="0.1"
                        required>

                </label>

                <label>

                    Drive Date

                    <input
                        type="date"
                        id="driveDate"
                        required>

                </label>

                <label class="full-width">

                    Eligibility

                    <input
                        type="text"
                        id="eligibility"
                        placeholder="Eg: CGPA 7.0+">

                </label>

                <div class="form-actions full-width">

                    <button
                        type="button"
                        class="cancel-btn"
                        onclick="closeCompanyModal()">

                        Cancel

                    </button>

                    <button
                        type="submit"
                        class="save-btn">

                        Save Company

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>
