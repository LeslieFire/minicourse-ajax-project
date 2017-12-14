
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    

    // YOUR CODE GOES HERE!
    // nytimes  api-key: 0feb6a1a10ea4aa8a0176972eef9e16a

    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ',' + city;

    var nytimeUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&api-key=0feb6a1a10ea4aa8a0176972eef9e16a&sort=newest'

    $.getJSON(
        nytimeUrl,
        function( data ) {
            $nytHeaderElem.text('New York Times Articles About ' + city);

            if (data && data.response 
                && data.response.docs 
                && data.response.docs.length > 0) {

                articles = data.response.docs;
                $nytElem.append(articles.map(article => {
                    return '<li class="article"> \
                            <a href="' + article.web_url + '">' + article.headline.main + '</a> \
                            <p>' + article.snippet + '</p>\
                    </li>';
                }).join(''))

            } else {
                $nytElem.append('<div class="article">没有找到相关文章</div>');
            }
        }
    ).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Can Not Loaded!');
    });


    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + city + '&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            success: function( response ) {
                var articleList = response[1];

                articleList.forEach(article => {
                    var url = 'http://en.wikipedia.org/wiki/' + article;
                    $wikiElem.append('<li><a href="'+ url +'">' + 
                        article + '</a></li>');
                })

                clearTimeout(wikiRequestTimeout);
            }
        });


    return false;
};

$('#form-container').submit(loadData);
