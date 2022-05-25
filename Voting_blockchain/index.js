$(document).ready(function(){
    $.ajax("http://localhost:3000/winningCandidate",
    {   
        'type':'POST',        
        'contentType': 'application/json',
        success:function(data1,status,xhr)
        {
            console.log("Hello I reached this place")
            var participants=data1.winner;
            console.log(participants);
            console.log(participants.length);
            for(var i=0;i<participants.length;i++){
                
                var p=participants[i];
                console.log(p[0]);
                var col="<tr><td>"+p[0]+"</td>"
                var col1="<td>"+p[1]+"</td>"
                var col3="<td>"+p[2]+"</td></tr>"
                var table=col+col1+col3;
                $("#candidates").append(table);
            }      
        }
    });
});