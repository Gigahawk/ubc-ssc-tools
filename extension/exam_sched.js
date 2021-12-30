// Idk why this isnt a default function but whatever
Date.prototype.addHours = function(h) {
    this.setHours(this.getHours()+h);
    return this;
}

function initIcalDownloader(ctx) {

    // Initialize calendar
    var cal=ics();

    console.log(ctx);

    // Search for Print button
    var divs = [].slice.call(ctx.getElementsByTagName("div"));
    console.log(divs);
    var print_div = divs.find(el => el["id"] == "printer")
    console.log(print_div)

    // Add download button
    var btn = ctx.createElement("button")
    btn.id = "download-button";
    btn.disabled = true;
    btn.innerHTML = "Download iCal file"
    btn.addEventListener("click", function() {
        cal.download('exam');
    }, false);
    print_div.parentNode.insertBefore(btn, print_div.nextSibling);


    // Grab all tables on page
    var tables = [].slice.call(ctx.getElementsByTagName("tbody"));
    console.log(tables);
    // Grab all table rows of tables
    var table_trs = tables.map(x => [].slice.call(x["children"]));
    console.log(table_trs);

    // Find table with exam information
    var exam_table = table_trs.find(el =>  el[0]["children"][0]["innerHTML"] == "Course");
    if(exam_table) {
        console.log(exam_table);
        // Remove header row from exam table
        exam_table.shift()

        // Apparently for loop is faster than forEach
        for(var i=0, len=table.length; i< len; i++) {
            el = table[i]
            cols = el["children"]
            course = cols[0].innerHTML
            date = cols[1].innerHTML
            day = cols[2].innerHTML
            time = cols[3].innerHTML
            loc = cols[4]["children"][0]
            if(loc) {
                loc = loc.innerHTML;
            } else {
                loc = "";
            }
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
    } else {
        console.log("Exam table not found");
    }
}

window.addEventListener("load",
    (w, ev) => {
        var url = window.location.href;
        console.log(url);

        // Look for the iframe containing the actual exam table
        if(url.includes("SSCMain.jsp")) {
            var iframes = [].slice.call(document.getElementsByTagName("iframe"));
            console.log(iframes)
            for(var i=0, len=iframes.length; i < len; i++) {
                f = iframes[i];
                if(f["id"] == "iframe-main") {
                    initIcalDownloader(f.contentWindow.document);
                }
            }
        } else {
            initIcalDownloader(document);
        }
    })