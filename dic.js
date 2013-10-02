var url = 'http://localhost/wiki/api.php?action=';

$(document).ready(function ()
{

    $('#preview').show();
    populateLst('#template', url, 'query&list=allpages&apnamespace=10&apfrom=Dict_Meta&aplimit=5');
    GetOpts('#relatedterms', 'http://localhost/wiki/dic/terms/NDSCorpDicWikiTerms.php?TERM=');
    GetOpts('#categories', 'http://localhost/wiki/dic/terms/NDSCorpDicWikiCategories.php?CAT=');
    $('#btnShow').hide();

    $('#btnUpload').click(function ()
    {
        $('#terminfo').hide();
        $('#preview').show();
        $('#btnShow').show();
        getToken(url, 'query&prop=info%7Crevisions&intoken=edit&titles=Main_Page');
    });

    $('#btnAdd').click(function ()
    {
        var val = $('#relatedterms').val();
        $('#relateditemslst').append('<option value="' + val + '">' + val + '</option>');
    });

    $('#btnRemove').click(function ()
    {
        RemoveItem();
    });




});
function GetOpts (lst, url){

  $(lst).html('');
  $.get(url, function(data) { 
    $(lst).append(data); 
  });
 
}

function RemoveItem()
{
   var lstval = $("#relateditemslst").val();
   var opts;
   $('#relateditemslst').multiSelect('select_all');
     var lstvals = $("#relateditemslst").val()||[];
     for (i=0; i < lstvals.length; i++) { 
        if(lstvals[i]!=lstval)
        {
            opts += '<option value="' + lstvals[i] + '">' +
                lstvals[i] + '</option>'; 
        }
     }
     $('#relateditemslst').multiSelect('deselect_all');
     $('#relateditemslst').html('');
     $('#relateditemslst').html(opts);    
}

function populateLst(lst, url,qry){

    $(lst).html('');
    
    $.getJSON(url + qry+ '&format=json', function(data) { 
      
      for (i=0; i < data.query.allpages.length; i++) { 
         $(lst).append('<option value="' + 
            data.query.allpages[i].title + '">' + 
            data.query.allpages[i].title +'</option>');
      }
  }); 
  
}

function getToken(url, qry){

    $.getJSON(url + qry + '&format=json', function (data)
    {
        $.each(data.query.pages, function (key, val)
        {
            var token = data.query.pages[key].edittoken.slice(0, data.query.pages[key].edittoken.length - 2) + '%2B%5C';

            //var template = $('#template').val();
            var title = 'TERM:' + $('#term').val();
            var acronym = $('#acronym').val();
            var txt = $('#definition').val();
            title = getTitle(title, acronym);

            wiki_Post(url, title, '<!--placeholder-->', token);
            
            txt = '&section=new&summary=Description&text=' + txt; //'{{subst:' + template + '}}';
            wiki_Post(url, title, txt, token);

            //txt = '&section=new&summary=Acronym&text=' + getAcronym(acronym);
            //wiki_Post(url, title, txt, token);

            txt = '&section=new&summary=Related Terms&text=' + getRelated();
            wiki_Post(url, title, txt, token);


        });
    });
}

function getAcronym(acronym)
{
    if (acronym.length < 1)
    {
         acronym = 'N/A';
    }

}

function getTitle(title, acronym)
{
    if (acronym.length > 1)
    {
        title = title + ' (' + acronym + ')';
    }

    return title;

}

function getRelated()
{
   var lstval = $("#relateditemslst").val();
   var opts='';
   $('#relateditemslst').multiSelect('select_all');
     var lstvals = $("#relateditemslst").val()||[];
     for (i=0; i < lstvals.length; i++) { 
         opts += '[[TERM:' + lstvals[i] + '|' + lstvals[i] + ']], ';
     }
     $('#relateditemslst').multiSelect('deselect_all');
     return opts.slice(0, opts.length -2);  

}


function wiki_Post(url, title, txt, token){

  $('#contents').html('');
      
   var qry = 'edit&title=' +  title +  
      txt + '&token='+ token+'&format=json';
       
  $.post(url+qry, function(data) { 
      if (data.edit.result == 'Success' ) {
        //$("#contents").append(title + ' success');
        $("#txt").html('<iframe src="http://localhost/wiki/index.php?title='
          + title+'&useskin=chick" style="height: 100%; width: 100%;"></iframe>');
      }
  }); 
    
}


