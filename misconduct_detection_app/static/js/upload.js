// Set name and other global variables, Django variables for this page
pageName = "Upload";

let uploadFileFinish = false;
let uploadFolderFinish = false;

function setFileDetectionPackage() {
    $.ajax({
        url: '/select/autoDetect/',
        type: "GET",
        dataType: "json",
        success: function (autoDetectResults) {
            let autoDetectionLibSelection = autoDetectResults[0];
            let autoDetectionLanguage = autoDetectResults[1];
            if (autoDetectResults === "FILE_TYPE_NOT_SUPPORTED") {
                $("#languageSelectionModal").modal("show");
                autoDetectionLibSelection = "JPlag";
                autoDetectionLanguage = "text";
            }

            let programmingConfigs = new FormData();
            programmingConfigs.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
            programmingConfigs.append("detectionLibSelection", autoDetectionLibSelection);
            programmingConfigs.append("detectionLanguage", autoDetectionLanguage);
            $.ajax({
                url: "/configs/savingConfigs/",
                type: 'POST',
                cache: false,
                data: programmingConfigs,
                processData: false,
                contentType: false,
                dataType: "json",
                beforeSend: function () {
                    uploading = true;
                },
                success: function (data) {
                    uploading = false;
                }
            });
            let $detectionLibSelection = $("#detectionLibSelection");
            $detectionLibSelection.empty();
            $detectionLibSelection.append($("<div></div>").attr({
                "class": "btn btn-outline-primary",
                "role": "button",
            }).text(autoDetectionLibSelection + " : " + autoDetectionLanguage));

        }
    });
}

$("#changeDetectionLib").on("click", function () {
    $("#languageSelectionModal").modal("hide");
    $("#programmingLanguageChoosingModal").modal("show");
});

function modifyDOMAfterUploadingFile() {
    uploadFileFinish = true;
    openNextButton();
    $("#uploadFileLabel").text("Reupload");
}

function modifyDOMAfterUploadingFolder() {
    uploadFolderFinish = true;
    openNextButton();
    $("#uploadFolderLabel").text("Reupload");
}

var isFileIncluded;

function checkFileIncluded() {
    // Check if the uploaded file is included in the uploaded folder
    $.ajax({
        url: "checkIncluded/",
        type: 'GET',
        cache: false,
        success: function (data) {
            isFileIncluded = data;
            updateSubmissionsCount();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.warn("Error checking if file included in folder");
        }
    });
}

function updateSubmissionsCount() {
    if (isFileIncluded === "Yes") {
        $("#fileIncludedCheck").html("(Uploaded file <i>included</i> in the folder)")
    } else if (isFileIncluded === "No") {
        $("#fileIncludedCheck").html("(Uploaded file <i>not included</i> in the folder)")
    }
}

function fileUploaded() {
    modifyDOMAfterUploadingFile();
    $("#uploadFileCheck").empty();
    $("#uploadFileCheck").append("<i class='material-icons'>check</i> File uploaded.");
    checkFileIncluded();
}

function folderUploaded() {
    modifyDOMAfterUploadingFolder();
    $("#uploadFolderCheck").empty();
    $("#uploadFolderCheck").append("<i class='material-icons'>check</i> Folder uploaded. <i>" + numberOfSubmissions + " submissions</i>");
    checkFileIncluded();
}

function uploadFile() {
    let singleFile = new FormData($('#uploadFileForm')[0]);
    $("#uploadFileCheck").html("<i class='fa fa-spinner fa-spin'></i> Please wait while uploading...");

    $.ajax({
        url: "uploadFile/",
        type: 'POST',
        cache: false,
        data: singleFile,
        processData: false,
        contentType: false,
        beforeSend: function(){
            uploading = true;
        },
        success: function (data) {
            uploading = false;
            setFileDetectionPackage();
            fileUploaded();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.warn("Error sending the file");
            alert("Error: file not uploaded");
            //alert(xhr.status);
            //alert(thrownError);
            $("#uploadFileCheck").html('<i class="material-icons">block</i>There was an error while uploading the file');
        }
    });

}

function uploadFolder() {
    let folderFile = new FormData($('#uploadFolderForm')[0]);
    $("#fileIncludedCheck").empty();
    $("#uploadFolderCheck").html("<i class='fa fa-spinner fa-spin'></i> Please wait while uploading...");

    $.ajax({
        url: "uploadFolder/",
        type: 'POST',
        cache: false,
        data: folderFile,
        processData: false,
        contentType: false,
        dataType:"json",
        beforeSend: function(){
            uploading = true;
        },
        success : function(data) {
            uploading = false;
            numberOfSubmissions = data;
            folderUploaded();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.warn("Error sending the file");
            alert("Error: folder not uploaded");
            $("#uploadFolderCheck").html('<i class="material-icons">block</i>There was an error while uploading the folder');
        }
    });

}

function openNextButton() {
    if (uploadFileFinish && uploadFolderFinish) {
        document.getElementById("nextButton").removeAttribute("disabled");
        document.getElementById("nextButton").removeAttribute("title");
    }
}

$("#uploadFileForm").change(function (){
    uploadFile();
 });

$("#uploadFolderForm").change(function (){
    uploadFolder();
});

$(document).ready(function () {
    if (fileToComparePathList != "NOFOLDEREXISTS") {
        modifyDOMAfterUploadingFile();
        fileUploaded();
    }

    if (folderPathList[0] != "NOFOLDEREXISTS") {
        modifyDOMAfterUploadingFolder();
        folderUploaded();
    }
    openNextButton();
    console.log('document.ready()')
});
