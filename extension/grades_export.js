function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function initGradesDownloader(ctx) {

    console.log(ctx);

    // Search for navigation tabs
    var uls = ctx.getElementsByClassName("ui-tabs-nav")
    console.log(uls);
    var nav = uls[0];
    console.log(nav);

    // Search for Print button
    var divs = [].slice.call(ctx.getElementsByTagName("div"));
    console.log(divs);
    var print_div = divs.find(el => el["id"] == "printer")
    console.log(print_div)

    // Add download button
    var btn = ctx.createElement("button")
    btn.id = "download-button";
    btn.innerHTML = "Download CSV file"
    btn.addEventListener("click", function() {
        console.log("Downloading CSV file");
        var nav_items = [...nav["children"]];
        active_nav = nav_items.find(el => el.classList.contains("ui-state-active"));
        active_tab = active_nav.getAttribute("aria-controls")
        console.log("Active tab is " + active_tab);

        var active_div = divs.find(el => el["id"] == active_tab)
        console.log(active_div);

        // Grab all tables on page
        var tables = [].slice.call(active_div.getElementsByTagName("tbody"))
        console.log(tables);

        // Grab all table rows of tables
        var table_trs = tables.map(x => [].slice.call(x["children"]))[0];
        console.log(table_trs);

        // Look for table header
        var header_idx = 0;
        for(var i=0, len=table_trs.length; i< len; i++) {
            tr = table_trs[i];
            td = tr.children[0]
            console.log(i);
            console.log(tr);
            console.log(td);
            if(td.classList.contains("listHeader")) {
                console.log("Header is on row " + i)
                header_idx = i;
                break;
            }
        }

        out_str = "";
        for(var i=header_idx, len=table_trs.length; i< len; i++) {
            tr = table_trs[i];
            row = [];
            for(var j=0, td_len = tr.children.length; j<td_len; j++) {
                td = tr.children[j]
                contents = td.innerText;

                // Remove non-breaking spaces
                contents = contents.replaceAll("\xa0", " ");

                // Remove newlines
                contents = contents.replace(/(\r\n|\n|\r)/gm, " ");

                row.push(contents);
            }
            out_str += row.join(",") + "\n";
        }

        console.log(out_str);
        download("grades-" + active_tab + ".csv", out_str);

    }, false);
    print_div.parentNode.insertBefore(btn, print_div.nextSibling);
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
                    initGradesDownloader(f.contentWindow.document);
                }
            }
        } else {
            initGradesDownloader(document);
        }
    })