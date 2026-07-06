const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addPlacementBtn");
const modal = document.getElementById("placementModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const packageInput = document.getElementById("package");
const cgpaInput = document.getElementById("cgpa");
const dateInput = document.getElementById("date");

const tableBody = document.querySelector("#placementTable tbody");

if (!tableBody || !modal || !addBtn || !cancelBtn || !saveBtn) {
    console.warn('Placement page elements are not ready yet.');
} else {

addBtn.onclick = function () {

    modal.style.display = "flex";

};

cancelBtn.onclick = function () {

    modal.style.display = "none";

    clearFields();

};

window.onclick = function (e) {

    if (e.target == modal) {

        modal.style.display = "none";

        clearFields();

    }

};

function clearFields() {

    companyInput.value = "";
    roleInput.value = "";
    packageInput.value = "";
    cgpaInput.value = "";
    dateInput.value = "";

}

if (searchInput) {
    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const rows = tableBody.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {

            const text = rows[i].innerText.toLowerCase();

            if (text.indexOf(value) > -1) {

                rows[i].style.display = "";

            } else {

                rows[i].style.display = "none";

            }

        }

    });
}
saveBtn.onclick = function () {

    if (
        companyInput.value.trim() == "" ||
        roleInput.value.trim() == "" ||
        packageInput.value.trim() == "" ||
        cgpaInput.value.trim() == "" ||
        dateInput.value == ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    const row = tableBody.insertRow();

    row.innerHTML = `

        <td style="padding:15px;">${companyInput.value}</td>

        <td>${roleInput.value}</td>

        <td>${packageInput.value}</td>

        <td>${cgpaInput.value}</td>

        <td>${dateInput.value}</td>

        <td style="color:green;font-weight:bold;">Open</td>

        <td>

            <button class="editBtn"
            style="background:#16a34a;
            color:white;
            border:none;
            padding:7px 12px;
            border-radius:5px;
            cursor:pointer;">

            Edit

            </button>

            <button class="deleteBtn"
            style="background:#dc2626;
            color:white;
            border:none;
            padding:7px 12px;
            border-radius:5px;
            cursor:pointer;">

            Delete

            </button>

        </td>

    `;

    modal.style.display = "none";

    clearFields();

    attachEvents();

};

function attachEvents() {

    const deleteButtons = document.querySelectorAll(".deleteBtn");

    deleteButtons.forEach(function(btn){

        btn.onclick = function(){

            if(confirm("Delete this placement?")){

                this.closest("tr").remove();

            }

        };

    });

    const editButtons = document.querySelectorAll(".editBtn");

    editButtons.forEach(function(btn){

        btn.onclick = function(){

            const row = this.closest("tr");

            companyInput.value = row.cells[0].innerText;
            roleInput.value = row.cells[1].innerText;
            packageInput.value = row.cells[2].innerText;
            cgpaInput.value = row.cells[3].innerText;
            dateInput.value = row.cells[4].innerText;

            modal.style.display = "flex";

            row.remove();

        };

    });

}

attachEvents();
}
