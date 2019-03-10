//Loaded in layout.html (every page)

// Make the slider update the threshold text
$(document).on('input', '#thresholdSlider', function() {
    $('#detectionThreshold').html( $(this).val() );
});

// Creates a bottom bar button formatted correctly with it's icon
function createButtonWithIcon(iconName, text, disabled, link = "", newTab = false) {
    let topLevel;
    if (disabled) {
        topLevel = $("<div></div>").attr({ // Kept original div from Xin
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        });
    } else {
        topLevel = $("<a></a>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
        });
        if (link !== "") {
            topLevel.attr("href", link);
        }
        if (newTab) {
            topLevel.attr("target", "_blank");
        }
    }
    topLevel.append(
        $("<div class='row'></div>").append(
            $("<div class='col-2'></div>").append(
                $("<i class='material-icons'></i>").text(iconName)
            )
        ).append(
            $("<div class='col-8'></div>").text(text)
        )
    );
    return topLevel;
}

// NOTE: This patchy implementation from Xin is recommended to be refactored
function loadUploadedComparingFile() {
    // Format data
    fileToComparePathList = fileToComparePathList[0];

    if ($("#fileToComparePathList").length) {
        // Reset if existing
        $("#fileToComparePathList").empty();
    } else {
        // Add the File section to add the button
        // NOTE: this method was implemented by Xin
        // I suggest refactoring it to the HTML and being a consistent element
        $("#bottomBar").append("<div id='fileToComparePathList'></div>");
    }


    // If file exists, show the file. If not, show hint
    const icon = "description";
    if (fileToComparePathList === "NOFOLDEREXISTS") {
        let button = createButtonWithIcon(icon, "No uploaded file", true);
        $("#fileToComparePathList").append(button);
    } else {
        let link = "/examine/singlefiles/" + fileToComparePathList;
        let button = createButtonWithIcon(icon, fileToComparePathList, false, link, true);
        $("#fileToComparePathList").append(button);
    }
}

function loadUploadedFolder() {
    if ($("#folderPathList").length) {
        // Reset if existing
        $("#folderPathList").empty();
    } else {
        // Add the File section to add the button
        // NOTE: this method was implemented by Xin
        // I suggest refactoring it to the HTML and being a consistent element
        $("#bottomBar").append("<div id='folderPathList'></div>");
    }

    // If folder exists, show the folder. If not, show hint
    const icon = "folder";
    if (folderPathList[0] === "NOFOLDEREXISTS") {
        let button = createButtonWithIcon(icon, "No uploaded folder", true);
        $("#folderPathList").append(button);
    } else {
        let link = "/upload/uploadedFolder/";
        let button = createButtonWithIcon(icon, "Uploaded Folder", false, link, true);
        $("#folderPathList").append(button);

        /* // Xin's implementation as a popup
        $("#folderPathList").append($("<a></a>").attr({
            "tabindex": "0",
            "class": "btn btn-outline-primary",
            "role": "button",
            "data-toggle": "popover",
            "data-trigger": "focus",
            "data-placement": "top",
            "id": "folderPathListPopOver",
        }));
        // Create the up arrow
        $("#folderPathListPopOver").append("Uploaded Folder<i class='material-icons' style='position: relative;top: 4px;left: 0px;font-size: 18px;'>arrow_drop_up</i>");

        $("#hiddenContentsDiv").empty();
        folderPathList.forEach(filePath => {
            $("#hiddenContentsDiv").append($("<a></a>").attr({
                "href": "/examine/folders/" + filePath.substring(filePath.indexOf("folder") + 8),
                "target": "_blank",
            }).text(filePath.substring(filePath.indexOf("folder") + 8)));
            $("#hiddenContentsDiv").append("<br>");
        });
        // These popover functions must be put after above part since our DOMs
        // are built dynamically.
        $(function () {
            $("#folderPathListPopOver").popover({
                html: true,
                content: function() {
                    return $("#hiddenContentsDiv").html();
                },
            });
        });

        $(".popover-dismiss").popover({
            trigger: "focus"
        });
        */
    }
}

function loadSelectedSegments() {
    // Format data
    segmentsPathList = segmentsPathList[0]
    $("#bottomBar").append("<div id='segmentsPathList'></div>");

    // If segment selections exist, show the link to result page. If not, show hint
    const icon = "view_list";
    if (segmentsPathList === "NOFOLDEREXISTS") {
        let button = createButtonWithIcon(icon, "No segments selected", true);
        $("#segmentsPathList").append(button);
    } else {
        let link = "/select/";
        let button = createButtonWithIcon(icon, "Selected segments", false, link, false);
        $("#segmentsPathList").append(button);
    }
}

function loadResults() {
    // Format data
    resultsPathList = resultsPathList[0];
    $("#bottomBar").append("<div id='resultsPathList'></div>");

    // If results exist, show the link to result page. If not, show hint
    const icon = "assignment";
    if (resultsPathList === "NOFOLDEREXISTS") {
        let button = createButtonWithIcon(icon, "No results to show", true);
        $("#resultsPathList").append(button);
    } else if (resultsPathList === "RESULTSEXISTS"){
        let link = "/results/";
        let button = createButtonWithIcon(icon, "Last detection results", false, link, false);
        $("#resultsPathList").append(button);
    }
}

function loadDetectionLib() {
    // No need for formating
    $("#bottomBar").append("<div id='detectionLibSelection'></div>");

    // If detection lib selected, show the lib name. If not, show hint
    const icon = "settings";
    if (configsList === "NOFOLDEREXISTS") {
        /*
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("Detection library not selected"));
        */
        let button = createButtonWithIcon(icon, "Detection library not selected", true);
        $("#detectionLibSelection").append(button);
    } else {
        let button = createButtonWithIcon(icon, detectionLibSelection + " : " + detectionLanguage, false);
        button.addClass("text-primary"); // Add the link colour to match the other buttons
        $("#detectionLibSelection").append(button);
    }

    // Construct the modal dynamically
    let detectionLibListKeys = Object.keys(detectionLibList).filter(key => detectionLibList.hasOwnProperty(key) === true);

    detectionLibListKeys.forEach(detectionLib => {
        $("#programmingLanguageChoosingDetectionLibForm").append(
            $("<input>").attr({
                "type": "radio",
                "name": "detectionLib",
                "id": "programmingLanguageChoosingDetectionLibForm" + detectionLib,
            }).val(detectionLib),
            $("<h7></h7>").text(" " + detectionLib),
            $("<br>"),
        );

        let detectionLibSupportedLanguages = Object.keys(detectionLibList[detectionLib]).filter(key => detectionLibList[detectionLib].hasOwnProperty(key) === true);

        // Adding supported languages for the detection lib. Hide them at first.
        $("#programmingLanguageChoosingLanguageFormDiv").append(
            $("<from></from>").attr({
                "id": "programmingLanguageChoosingLanguageFormDiv" + detectionLib,
                "class": "programmingLanguageChoosingLanguageFormDivs",
                "style": "display: none" ,
            })
        );

        detectionLibSupportedLanguages.forEach(detectionLibSupportedLanguage => {
            $("#programmingLanguageChoosingLanguageFormDiv" + detectionLib).append(
                $("<input>").attr({
                    "type": "radio",
                    "name": detectionLib,
                    "id": "programmingLanguageChoosingDetectionLibLanguageForm" + detectionLibSupportedLanguage,
                }).val(detectionLibList[detectionLib][detectionLibSupportedLanguage]),
                $("<h7></h7>").text(" " + detectionLibList[detectionLib][detectionLibSupportedLanguage]),
                $("<br>"),
            );
        });

        $("#programmingLanguageChoosingDetectionLibForm" + detectionLib).on("click", function(){
            $("#programmingLanguageChoosingLanguageFormGuide").empty();
            $(".programmingLanguageChoosingLanguageFormDivs").css("display", "none");
            $("#programmingLanguageChoosingLanguageFormDiv" + detectionLib).toggle();
        });
    });

    $("#programmingLanguageChoosingModalSave").on("click", function(){
        // Please notice here. Although we made all input radio button in a form,
        // we don't want to send it to the back-end directly. We will let something
        // else send the variables set here later.
        detectionLanguage = $("input[type='radio']:checked", ".programmingLanguageChoosingLanguageFormDivs").val()
        detectionLibSelection = $("input[name=detectionLib]:checked").val();
        detectionThreshold = $("#detectionThreshold").text();
        if (detectionLanguage === undefined || detectionLibSelection === undefined) {
            console.error("Detection Library not properly selected")
            return;
        }

        $("#detectionLibSelection").empty();
        let button = createButtonWithIcon(icon, detectionLibSelection + " : " + detectionLanguage, false);
        button.addClass("text-primary"); // Add the link colour to match the other buttons
        $("#detectionLibSelection").append(button);

        let programmingConfigs = new FormData();
        programmingConfigs.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
        programmingConfigs.append("detectionLibSelection", detectionLibSelection);
        programmingConfigs.append("detectionLanguage", detectionLanguage);
        programmingConfigs.append("detectionThreshold", detectionThreshold);
        $.ajax({
            url: "/configs/savingConfigs/",
            type: 'POST',
            cache: false,
            data: programmingConfigs,
            processData: false,
            contentType: false,
            dataType:"json",
            beforeSend: function() {
                uploading = true;
            },
            success : function(data) {
                uploading = false;
            }
        });

        $(document).ajaxStop(function() {
            $("#programmingLanguageChoosingModal").modal('hide');
        });
        
    });

    // Let the button listen click event
    $("#detectionLibSelection").on("click", function() {
        $("#programmingLanguageChoosingModal").modal();
    });
}

function loadDetectionPackageSettings(){
    // Auto selects the configured radio buttons for the detection lib
    if(detectionLibSelection){
        let formId = "#programmingLanguageChoosingDetectionLibForm" + detectionLibSelection;
        $(formId).click();
        $("input[value='" + detectionLanguage + "']").click();
        $("#thresholdSlider").val(parseInt(detectionThreshold));
        $("#detectionThreshold").text(detectionThreshold);
    }

}

$(document).ready(function (){
    // Load the elements in order
    loadUploadedComparingFile();
    loadUploadedFolder();
    loadSelectedSegments();
    loadResults();
    loadDetectionLib();
    loadDetectionPackageSettings();
});
