// ================================
// PROJECT MANAGEMENT ERP
// Part 1
// ================================

const tableBody = document.querySelector("#projectTable tbody");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const addProjectBtn = document.getElementById("addProjectBtn");
const projectModal = document.getElementById("projectModal");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const projectName = document.getElementById("projectName");
const guideName = document.getElementById("guideName");
const technology = document.getElementById("technology");
const status = document.getElementById("status");
const progress = document.getElementById("progress");
const dueDate = document.getElementById("dueDate");

let editIndex = null;

let projects =
JSON.parse(localStorage.getItem("projects")) || [

{
project:"AI Chatbot for College",
guide:"Dr. Kumar",
technology:"Python, Flask",
status:"Ongoing",
progress:75,
date:"2026-12-15"
},

{
project:"Smart Attendance System",
guide:"Dr. Priya",
technology:"HTML, CSS, JavaScript",
status:"Completed",
progress:100,
date:"2026-10-10"
},

{
project:"Library Management System",
guide:"Dr. Rajesh",
technology:"Java, MySQL",
status:"Ongoing",
progress:65,
date:"2026-11-25"
},

{
project:"IoT Smart Irrigation",
guide:"Dr. Vinoth",
technology:"IoT, ESP32",
status:"Pending",
progress:40,
date:"2027-01-05"
}

];

function saveProjects(){

localStorage.setItem(
"projects",
JSON.stringify(projects)
);

}

function getStatusColor(status){

if(status=="Completed")
return "#2563eb";

if(status=="Pending")
return "#ea580c";

return "#16a34a";

}

addProjectBtn.onclick=function(){

editIndex=null;

clearForm();

projectModal.style.display="flex";

};

cancelBtn.onclick=function(){

projectModal.style.display="none";

clearForm();

};

window.onclick=function(e){

if(e.target==projectModal){

projectModal.style.display="none";

clearForm();

}

};

function clearForm(){

projectName.value="";
guideName.value="";
technology.value="";
status.value="Ongoing";
progress.value="";
dueDate.value="";

}
function renderProjects(list = projects){

tableBody.innerHTML="";

list.forEach((item,index)=>{

const color=getStatusColor(item.status);

tableBody.innerHTML+=`

<tr>

<td style="padding:15px;">
${item.project}
</td>

<td>
${item.guide}
</td>

<td>
${item.technology}
</td>

<td>

<span
style="color:${color};
font-weight:bold;">

${item.status}

</span>

</td>

<td>

<div
style="width:120px;
height:8px;
background:#ddd;
border-radius:20px;">

<div
style="width:${item.progress}%;
height:100%;
background:${color};
border-radius:20px;">

</div>

</div>

${item.progress}%

</td>

<td>

${item.date}

</td>

<td>

<button
class="editBtn"
onclick="editProject(${index})"
style="background:#16a34a;
color:white;
border:none;
padding:7px 12px;
border-radius:5px;
cursor:pointer;">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteProject(${index})"
style="background:#dc2626;
color:white;
border:none;
padding:7px 12px;
border-radius:5px;
cursor:pointer;">

Delete

</button>

</td>

</tr>

`;

});

updateCards();

}

function updateCards(){

document.getElementById("totalProjects").innerText =
projects.length;

document.getElementById("ongoingProjects").innerText =
projects.filter(x=>x.status=="Ongoing").length;

document.getElementById("completedProjects").innerText =
projects.filter(x=>x.status=="Completed").length;

document.getElementById("teamCount").innerText =
projects.length;

}

searchInput.addEventListener("keyup",function(){

const keyword=this.value.toLowerCase();

const filtered=projects.filter(item=>

item.project.toLowerCase().includes(keyword) ||

item.guide.toLowerCase().includes(keyword) ||

item.technology.toLowerCase().includes(keyword)

);

renderProjects(filtered);

});

statusFilter.addEventListener("change",function(){

if(this.value=="All"){

renderProjects();

return;

}

const filtered=projects.filter(item=>

item.status==this.value

);

renderProjects(filtered);

});
saveBtn.onclick = function () {

    if (
        projectName.value.trim() == "" ||
        guideName.value.trim() == "" ||
        technology.value.trim() == "" ||
        progress.value.trim() == "" ||
        dueDate.value == ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    const projectData = {

        project: projectName.value.trim(),
        guide: guideName.value.trim(),
        technology: technology.value.trim(),
        status: status.value,
        progress: Number(progress.value),
        date: dueDate.value

    };

    if (editIndex === null) {

        projects.push(projectData);

    } else {

        projects[editIndex] = projectData;

    }

    saveProjects();

    renderProjects();

    projectModal.style.display = "none";

    clearForm();

};

function editProject(index){

    editIndex = index;

    const item = projects[index];

    projectName.value = item.project;
    guideName.value = item.guide;
    technology.value = item.technology;
    status.value = item.status;
    progress.value = item.progress;
    dueDate.value = item.date;

    projectModal.style.display = "flex";

}

function deleteProject(index){

    if(confirm("Delete this project?")){

        projects.splice(index,1);

        saveProjects();

        renderProjects();

    }

}

renderProjects();
