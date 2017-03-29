var speakers;

function deleteSpeaker(speaker_id){
    var xhr = new XMLHttpRequest();
    var url_text = "delete_speaker.php?id="+speaker_id;
    xhr.open('GET', url_text);
    xhr.onload = function() {
        if (xhr.status === 200) {
            getSpeakers();
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function getSpeakers(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_speakers.php');
    xhr.onload = function() {
        if (xhr.status === 200) {
            speakers = JSON.parse(xhr.responseText);
            var htmlText = "";
            htmlText += "<table><tr><th>teacher</th><th>room</th><th>topic</th><th>facilitators</th></tr>\n";
            for (i=0;i<parseInt(speakers.length);i++){
                htmlText += "<tr>";
                htmlText += "<td>"+ speakers[i]['teacher']+"</td>";
                htmlText += "<td>"+ speakers[i]['room']+"</td>";
                htmlText += "<td>"+ speakers[i]['topic']+"</td>";
                htmlText += "<td>"+ speakers[i]['facilitators']+"</td>";
                htmlText += "<td><button type='button' onClick='deleteSpeaker("+speakers[i]['id']+")'+>Delete</button></td>";
                htmlText += "</tr>";
            }
            htmlText += "</table>";

            // htmlText += speakers[0]['teacher'];
            document.getElementById('speakers').innerHTML = htmlText;
        }
        else {
            console.log(xhr.status);
        }
    };
    xhr.send();
}

function validateForm(){
    var teacher = $('#teacher').val();     
    var room = $('#room').val();     
    var topic = $('#topic').val();
    var facilitators = $('#facilitators').val();
    
    var alertmessage = "";
    var validated = true;
    if (teacher==""||teacher==null){
        alertmessage += "Teacher must be completed.<br>";
        validated = false;
    }
    if (room==""||room==null){
        alertmessage += "Room must be completed.<br>";
        validated = false;
    }
    if (topic==""||topic==null){
        alertmessage += "Topic must be completed.<br>";
        validated = false;
    }
    if (facilitators==""||facilitators==null){
        alertmessage += "Facilitators must be completed.<br>";
        validated = false;
    }
    if (validated==false){
        $("#status").html("<span style=\"color:red;font-weight:bold;font-size:110%\">"+alertmessage+"</span>");
        window.scrollTo(0,document.body.scrollHeight);
    }
    return validated;      
}

function ajaxInsert(){
    var teacher = $('#teacher').val();     
    var room = $('#room').val();     
    var topic = $('#topic').val();
    var facilitators = $('#facilitators').val();

    var postData = 
    'teacher='+teacher+
    '&room='+room+
    '&topic='+topic+
    '&facilitators='+facilitators;

    $.ajax({
        url : "save_speaker.php",
        type: "GET",
        data : postData,
        success: function(data,status, xhr)
        {
            $("#status").html(data);
            $('#teacher').val('');
            $('#room').val('');
            $('#topic').val('');
            $('#facilitators').val('');
            console.log("Ajax success.");
            getSpeakers();
        },
        error: function (jqXHR, status, errorThrown)
        {
            $("#status").html('there was an error ' + errorThrown + ' with status ' + status);
        }
    });//close ajax call
}

$(document).ready(function(){
    $("#submit").click(function(){
        // console.log("Button clicked");
        if (validateForm()){
            ajaxInsert();
            console.log("Form validation returned true.");
        }
        else {
            console.log("Form validation returned false.");
        }
    }


    );//close btn_submit.click
});//close document ready