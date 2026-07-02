// ===========================
// CRUD.JS - FACULTY MODULE
// ===========================

document.addEventListener("DOMContentLoaded", () => {

    const facultyForm = document.getElementById("facultyForm");
    const tableBody = document.querySelector("#facultyTable tbody");

    // Faculty page illa na stop
    if (!facultyForm || !tableBody) return;

    // ===========================
    // SAVE FACULTY
    // ===========================
    facultyForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const id = document.getElementById("form-id").value.trim();
        const name = document.getElementById("form-name").value.trim();
        const dept = document.getElementById("form-dept").value.trim();
        const designation = document.getElementById("form-designation").value.trim();
        const subject = document.getElementById("form-subject").value.trim();

        if (
            id === "" ||
            name === "" ||
            dept === "" ||
            designation === "" ||
            subject === ""
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${designation}</td>
            <td>${dept}</td>
            <td>${subject}</td>
            <td><span class="status active">Active</span></td>
        `;

        tableBody.appendChild(row);

        facultyForm.reset();

        document.getElementById("form-dept").value = "CSE";

        closeFacultyForm();

        alert("Faculty Added Successfully!");
    });

});