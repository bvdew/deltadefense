$(function () {
    var userNames = {}, //stores the user names of those that have written posts
        limit = 10;     //how many posts should we get at a time

    /**
     * GET ARTICLES
     * This function calls jsonplaceholder for 'limit' posts starting at the value of start
     * The start value is passed in
     * Once data is loaded, createTeaser is called which creates the template
     */
    function getArticles(start) {
        var root = 'https://jsonplaceholder.typicode.com';
        
        $.ajax({
            url: root + "/posts",
            method: "GET",
            data: {
                _start: start,
                _limit: limit
            }
        })
        .done(function (result) {
            $.each(result, function (i, post) {
                //get the author of the post
                //if no author, get it from jsonplaceholder
                if (userNames[this.userId] == undefined) {
                    $.ajax({
                        url: root + "/users/" + this.userId,
                        method: "GET"
                    })
                    .done(function (user) {
                        userNames[user.id] = user;
                        createTeaser(post);
                    })
                    .fail(function(){
                        alert('Failed to load author details.');
                    });
                } else {
                    createTeaser(post);
                }
            });
        })
        .fail(function(){
            alert('Failed to load posts.');
        });
    }
    //call get articles on page load
    getArticles(1);

    /**
     * Create Teaser
     * This function creates the template for the article teaser
     * @param {*} data 
     */
    function createTeaser(data) {
        //create the template
        var row = [];
        row.push('<div class="col-xs-12 col-sm-6"><article>');
        row.push('<header>' + data.title + '</header>');
        row.push('<p><span>' + data.body + '</span><a href="post.html?postid=' + data.id + '">READ MORE</a></p>');
        row.push('<footer>');
        row.push('<h2>by ' + userNames[data.userId].name + '</h2>');
        row.push('<span>');
        row.push('<a href="post.html?postid=' + data.id + '#comments" title="Read comments"><span class="icon-comments"></span></a>');
        row.push('<a href="author.html?userid=' + data.userId + '" title="Read more by ' + userNames[data.userId].name + '"><span class="icon-author"></span></a>');        
        row.push('</span>');
        row.push('</footer></article></figure>');

        //add the article to the page
        $('#grid').append(row.join(''));
    }

    /**
     * Click the load more button at the end of the page will call get articles
     * And then increase the start position by 'limit'
     */
    $(document).on('click', 'button#loadMore', function(){
        var start = parseInt($(this).attr("data-start"));
        getArticles(start);
        $(this).attr('data-start', start+limit);
    })

});