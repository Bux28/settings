// ==UserScript==
// @name         Carrefour Adriens
// @namespace    Hey Bio
// @version      0.1
// @description  Hackeur vaillant rien d'impossible
// @author       AdrienS
// @match        https://www.carrefour.fr/r/bio-et-ecologie
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var articles = new Array();
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);

    }
    function main() {
        setTimeout( function() { $('body').css('overflow','auto'); },1000);
    }
    addJQuery(main);

    function recup() {
         $.ajax({
        url: window.location.href,
        type: 'GET',
    })
        .done(function( msg ) {
        //console.log(encodeURI(JSON.stringify(msg)));
          for (var dat in msg.data) {
              articles.push(msg.data[dat]);
          }
          console.log(articles);
        //window.open('http://api.adriens.fr/cbio/index.php?bio=' + encodeURI(JSON.stringify(msg)));
          $("html, body").animate({scrollTop: $('html, body').get(0).scrollHeight - 1200}, 10);
          setTimeout(function() {  check(); }, 2000);
    });
    }

    function check() {
        if ($('.pagination__loader').prev('.a-button').length > 0)  {
            $("html, body").animate({scrollTop: $('html, body').get(0).scrollHeight - 1200}, 10);
            setTimeout(function() { $('.pagination__loader').prev('.a-button').click(); }, 200);
            setTimeout(function() { recup(); }, 250);
        }
        if ($('.pagination__loader').prev('.a-button').length == 0) {
            download_file("jsonfile.json", JSON.stringify(articles));
            console.log('GENERATION');

         }
    }

    function download_file(name, contents, mime_type) {
        mime_type = mime_type || "application/json";

        var blob = new Blob([contents], {type: mime_type});

        var dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }

    recup();
    check();



})();

