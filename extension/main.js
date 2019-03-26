// Initialize calendar
var cal=ics();

// Grab all tables on page
var tables = [].slice.call(document.getElementsByTagName("tbody"));
// Grab all table rows of tables
var table_trs = tables.map(x => [].slice.call(x["children"]));

// Find table with exam information
var table = table_trs.find(el =>  el[0]["children"][0]["innerHTML"] == "Course");
// Remove header row from exam table
table.shift()

// Find header bar
var header = table_trs.find(el =>  el[0]["children"][0]["innerHTML"] == "Exam Schedule");

// Add download button to header bar and set to disabled until all exams have been processed
var header_row = header[0]
var btn = document.createElement("button")
btn.id = "download-button";
btn.disabled = true;
btn.innerHTML = "Download iCal file"
btn.addEventListener("click", function() {
    cal.download('exam');
}, false);
header_row.appendChild(btn)

// Idk why this isnt a default function but whatever
Date.prototype.addHours = function(h) {
    this.setHours(this.getHours()+h);
    return this;
}

// Apparently for loop is faster than forEach
for(var i=0, len=table.length; i< len; i++) {
    el = table[i]
    cols = el["children"]
    course = cols[0].innerHTML
    date = cols[1].innerHTML
    day = cols[2].innerHTML
    time = cols[3].innerHTML
    loc = cols[4]["children"][0].innerHTML
    alpha = cols[5].innerHTML
    instructor = cols[6]
    instructor_text = instructor.innerText
    instructor_email = instructor["children"][0].href.split(":")[1]


    exam_name = `EXAM: ${course}`
    exam_description = `${instructor_text}\n${instructor_email}`
    exam_begin = `${date} ${time}`
    // Assume 2 hour long exam
    exam_end = new Date(exam_begin).addHours(2).toString()
    exam_location = loc

    cal.addEvent(exam_name, exam_description, exam_location, exam_begin, exam_end)

    // Enable button if last item
    if(i >= table.length - 1) {
        btn.disabled = false;
    }
}
