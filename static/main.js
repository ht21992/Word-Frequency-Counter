Dropzone.autoDiscover = false;
var currentFile = null;
var timeOutId= null;


const myDropzone = new Dropzone("#MyDropZone", {
  url : 'upload/',
  maxFiles: 1,
  maxFilesize:2,
  acceptedFiles: '.docx',
  addRemoveLinks: true,


  init: function() {
    this.on("addedfile", function(file,response) {

    if (currentFile) {
        this.removeFile(currentFile);
      }
      currentFile = file;
    document.getElementById('loading').innerHTML='<img style="width:100px !important;margin-right:10px" src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif" >Processing..'
     timeOutId = setTimeout(ShowLargeFileMessage, 5000)

     });

     this.on('error', function (files, response) {
        document.getElementById('loading').innerHTML= response

     })

    this.on('success', function (files, response) {
     clearTimeout(timeOutId)
     document.getElementById('loading').innerHTML=''
     document.getElementById('Total_Number').innerHTML=response['total_words']
     document.getElementById('table_title').innerHTML= 'Frequent Words'
     document.getElementById('word_type_table_title').innerHTML= 'Frequent Word Types'
     $('.WordsTable').empty();
     $(".WordsTable").css({"visibility":"visible"});
     $('.TagTable').empty();
     $(".TagTable").css({"visibility":"visible"});
     $('.WordsTable').append(`<tr><th style="text-align: center;">Word</th><th style="text-align: center;">Count</th></tr>`);
     for (const [key, value] of Object.entries(response['words_dict'])) {
          $('.WordsTable').append(`<tr><td style="text-align: center;">${key}</td><td style="text-align: center;">${value}</td></tr>`);
        }
     //console.log(Object.values(response['tag_dict']))
     $('.TagTable').append(`<tr><th style="text-align: center;">Word Type</th><th style="text-align: center;">Name</th><th style="text-align: center;">Count</th></tr>`);
     for (const [key, value] of Object.entries(response['tag_dict'])) {
          $('.TagTable').append(`<tr><td style="text-align: center;">${key}</td><td style="text-align: center;">${value.name}</td><td style="text-align: center;">${value.count}</td></tr>`);
        }


        var barColors = [];

        for(var i = 0; i < Object.keys(response['words_dict']).length; i++)
            barColors.push('#' + (Math.random().toString(16) + '0000000').slice(2, 8));



        // Bar Chart Starts

        new Chart("WordChart", {
          type: "bar",
          data: {
            labels: Object.keys(response['words_dict']),
            datasets: [{
              backgroundColor: barColors,
              data: Object.values(response['words_dict'])
            }]
          },
          options: {
            legend: {display: false},
            title: {
              display: true,
              text: "Word Frequency"
            }
          }
    });

    // Bar Chart Ends

    // Pie Chart Starts


    new Chart("PieChart", {
      type: "pie",
      data: {
        labels: Object.keys(response['words_dict']),
        datasets: [{
          backgroundColor: barColors,
          data: Object.values(response['words_dict'])
        }]
      },
      options: {
        title: {
          display: true,
          text: "Word Frequency - Pie Chart"
        }
      }
    });

    // Pie Chart Ends




});

    this.on("removedfile", function (file) {
    // clear screen
    document.getElementById('loading').innerHTML=''
    document.getElementById('Total_Number').innerHTML= ''
    document.getElementById('table_title').innerHTML= ''
    document.getElementById('word_type_table_title').innerHTML= ''
    $(".WordsTable").css({"visibility":"hidden"});
    $('.WordsTable').empty();
    $(".TagTable").css({"visibility":"hidden"});
    $('.TagTable').empty();
    // remove previous word chart and prepare it for next document
    document.getElementById("WordChart").remove();
    div = document.querySelector("#bar-chart-container");
    div.insertAdjacentHTML("afterbegin", '<canvas id="WordChart" style="width:100%;max-width:600px"></canvas>'); //adding the canvas again
    // remove previous pie chart and prepare it for next document
    document.getElementById("PieChart").remove();
    div = document.querySelector("#pie-chart-container");
    div.insertAdjacentHTML("afterbegin", '<canvas id="PieChart" style="width:100%;max-width:600px"></canvas>'); //adding the canvas again

    });
  },
});


function ShowLargeFileMessage() {
  document.getElementById('loading').innerHTML='<img style="width:100px !important;margin-right:10px" src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif" >oh this is a big file, still Processing...'
}

