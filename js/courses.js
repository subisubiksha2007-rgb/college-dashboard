// ======================================
// CSE ERP - Courses Management
// ======================================

const STORAGE_KEY = "erp_courses";

let courses = [];

let editIndex = -1;

// ======================================
// Default Data
// ======================================

const defaultCourses = [

{
code:"CS501",
name:"Design and Analysis of Algorithms",
faculty:"Dr. Mageshwari",
credits:4,
semester:"Semester V",
type:"Theory",
status:"Active"
},

{
code:"CS502",
name:"General Quantitative Techniques",
faculty:"Dr. Revathi",
credits:4,
semester:"Semester V",
type:"Theory",
status:"Active"
},

{
code:"CS503",
name:"Open Elective - I",
faculty:"Dr. Jeyanthi",
credits:3,
semester:"Semester V",
type:"Elective",
status:"Active"
},

{
code:"CS504",
name:"Database Management System",
faculty:"Dr. Govindaraj",
credits:3,
semester:"Semester V",
type:"Theory",
status:"Active"
},

{
code:"CS505",
name:"Artificial Intelligence & Machine Learning",
faculty:"Mrs. Jeya Geetha",
credits:3,
semester:"Semester V",
type:"Theory",
status:"Active"
},

{
code:"CS506",
name:"Operating Systems Lab",
faculty:"Mrs. Swathi",
credits:2,
semester:"Semester V",
type:"Lab",
status:"Active"
}

];

// ======================================
// Page Load
// ======================================

window.onload = function(){

loadCourses();

renderCourses();

updateSummary();

};
// ======================================
// Load Courses
// ======================================

function loadCourses(){

const saved = localStorage.getItem(STORAGE_KEY);

if(saved){

courses = JSON.parse(saved);

}else{

courses = [...defaultCourses];

saveCourses();

}

}

// ======================================
// Save Courses
// ======================================

function saveCourses(){

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(courses)

);

}

// ======================================
// Render Table
// ======================================

function renderCourses(){

const tbody = document.querySelector("#courseTable tbody");

tbody.innerHTML = "";

courses.forEach((course,index)=>{

tbody.innerHTML += `

<tr>

<td>${course.code}</td>

<td>${course.name}</td>

<td>${course.faculty}</td>

<td>${course.credits}</td>

<td>${course.semester}</td>

<td>${course.type}</td>

<td>

<span class="status ${course.status.toLowerCase()}">

${course.status}

</span>

</td>

<td>

<button class="action-btn view-btn"

onclick="viewCourse(${index})">

View

</button>

<button class="action-btn edit-btn"

onclick="editCourse(${index})">

Edit

</button>

<button class="action-btn delete-btn"

onclick="deleteCourse(${index})">

Delete

</button>

</td>

</tr>

`;

});

}
// ======================================
// Update Summary Cards
// ======================================

function updateSummary(){

document.getElementById("totalCourses").innerText = courses.length;

let totalCredits = 0;
let theory = 0;
let labs = 0;

courses.forEach(course=>{

totalCredits += Number(course.credits);

if(course.type==="Theory"){

theory++;

}

if(course.type==="Lab"){

labs++;

}

});

document.getElementById("totalCredits").innerText = totalCredits;

document.getElementById("theoryCourses").innerText = theory;

document.getElementById("labCourses").innerText = labs;

}

// ======================================
// Search Course
// ======================================

document.getElementById("searchInput").addEventListener("keyup",searchCourse);

function searchCourse(){

const value=document.getElementById("searchInput").value.toLowerCase();

const rows=document.querySelectorAll("#courseTable tbody tr");

rows.forEach(row=>{

const text=row.innerText.toLowerCase();

if(text.includes(value)){

row.style.display="";

}else{

row.style.display="none";

}

});

}

// ======================================
// Semester Filter
// ======================================

document.getElementById("semesterFilter").addEventListener("change",filterSemester);

function filterSemester(){

const semester=document.getElementById("semesterFilter").value;

const rows=document.querySelectorAll("#courseTable tbody tr");

rows.forEach(row=>{

if(semester===""){

row.style.display="";

return;

}

const rowSemester=row.cells[4].innerText;

if(rowSemester===semester){

row.style.display="";

}else{

row.style.display="none";

}

});

}
// ======================================
// Open Course Form
// ======================================

function openCourseForm(){

editIndex = -1;

document.getElementById("courseFormTitle").innerText = "Add Course";

document.getElementById("courseForm").reset();

document.getElementById("courseFormModal").classList.add("active");

}

// ======================================
// Close Course Form
// ======================================

function closeCourseForm(event){

if(event && event.target!==event.currentTarget){

return;

}

document.getElementById("courseFormModal").classList.remove("active");

}

// ======================================
// Save Course
// ======================================

document.getElementById("courseForm").addEventListener("submit",saveCourse);

function saveCourse(e){

e.preventDefault();

const course={

code:document.getElementById("course-code").value.trim(),

name:document.getElementById("course-name").value.trim(),

faculty:document.getElementById("course-faculty").value.trim(),

credits:Number(document.getElementById("course-credit").value),

semester:document.getElementById("course-semester").value,

type:document.getElementById("course-type").value,

status:document.getElementById("course-status").value

};

// Validation

if(

course.code===""

|| course.name===""

|| course.faculty===""

){

alert("Please fill all required fields.");

return;

}

// Duplicate Course Code

if(editIndex===-1){

const exists=courses.some(c=>c.code===course.code);

if(exists){

alert("Course Code already exists.");

return;

}

}

// Add

if(editIndex===-1){

courses.push(course);

}

// Update

else{

courses[editIndex]=course;

}

saveCourses();

renderCourses();

updateSummary();

closeCourseForm();

}
// ======================================
// Edit Course
// ======================================

function editCourse(index){

editIndex = index;

const course = courses[index];

document.getElementById("courseFormTitle").innerText = "Edit Course";

document.getElementById("course-code").value = course.code;
document.getElementById("course-name").value = course.name;
document.getElementById("course-faculty").value = course.faculty;
document.getElementById("course-credit").value = course.credits;
document.getElementById("course-semester").value = course.semester;
document.getElementById("course-type").value = course.type;
document.getElementById("course-status").value = course.status;

document.getElementById("courseFormModal").classList.add("active");

}

// ======================================
// Delete Course
// ======================================

function deleteCourse(index){

if(!confirm("Are you sure you want to delete this course?")){

return;

}

courses.splice(index,1);

saveCourses();

renderCourses();

updateSummary();

}

// ======================================
// View Course Details
// ======================================

function viewCourse(index){

const course = courses[index];

document.getElementById("detail-code").value = course.code;
document.getElementById("detail-name").value = course.name;
document.getElementById("detail-faculty").value = course.faculty;
document.getElementById("detail-credit").value = course.credits;
document.getElementById("detail-semester").value = course.semester;
document.getElementById("detail-type").value = course.type;
document.getElementById("detail-status").value = course.status;

document.getElementById("courseDetailsModal").classList.add("active");

}

function closeCourseDetails(event){

if(event && event.target!==event.currentTarget){

return;

}

document.getElementById("courseDetailsModal").classList.remove("active");

}
// ======================================
// Export CSV
// ======================================

function exportCSV(){

let csv = "Course Code,Course Name,Faculty,Credits,Semester,Type,Status\n";

courses.forEach(course=>{

csv += `${course.code},${course.name},${course.faculty},${course.credits},${course.semester},${course.type},${course.status}\n`;

});

const blob = new Blob([csv], {type:"text/csv"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = "Courses.csv";

a.click();

URL.revokeObjectURL(url);

}

// ======================================
// ESC Key Close Modal
// ======================================

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

closeCourseForm();

closeCourseDetails();

}

});

// ======================================
// Auto Update Summary
// ======================================

function refreshPage(){

renderCourses();

updateSummary();

saveCourses();

}

// ======================================
// Refresh after CRUD
// ======================================

const oldRender = renderCourses;

renderCourses = function(){

oldRender();

updateSummary();

saveCourses();

};