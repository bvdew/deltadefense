$(function(){
    var userId = GetURLParameter('userid'),             //get the author's user id
        root = 'https://jsonplaceholder.typicode.com';

    //get the user info at page load
    $.ajax({
        url: root + "/users/" + userId,
        method: "GET"
    })
    .done(function (result) {
        //once the data is loaded, show the author details
        showAuthor(result);
    })
    .fail(function(){
        alert('Failed to load author details.');
    });

    //get the author's posts
    $.ajax({
        url: root + "/posts/",
        method: "GET",
        data: {
            userId: userId
        }
    })
    .done(function (posts) {
        //show a link to each post
        $.each(posts, function(){
            showPosts(this);
        })
    })
    .fail(function(){
        alert("Failed to load author's posts.");
    });

    /**
     * Displays the author contact information
     * @param {*} author 
     */
    function showAuthor(author){
        $('.authorName').html(author.name);
        $('title').html(author.name + " | Brian VanDeWiel's Blog");

        var row = [];
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Username</div><div class="col-xs-12 col-sm-10">' + author.username + '</div></div>');        
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Email Address</div><div class="col-xs-12 col-sm-10"><a href="mailto:' + author.email + '">' + author.email + '</a></div></div>');
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Phone Number</div><div class="col-xs-12 col-sm-10">' + author.phone + '</div></div>');
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Website</div><div class="col-xs-12 col-sm-10"><a href="' + author.website + '">' + author.website + '</a></div></div>');
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Address</div><div class="col-xs-12 col-sm-10">' + author.address.street + '<br/>' + author.address.suite + '<br/>' + author.address.city + '<br/>' + author.address.zipcode + '<br/>' + author.address.geo.lat + ', ' + author.address.geo.lng + '</div></div>');        
        row.push('<div class="row"><div class="description col-xs-12 col-sm-2">Company</div><div class="col-xs-12 col-sm-10">' + author.company.name + '<br/><i>' + author.company.catchPhrase + '</i><br/>' + author.company.bs + '</div></div>');
        
        $('section#contact').append(row.join(''));
    }

    /**
     * Displays the author's posts
     * @param {*} post 
     */
    function showPosts(post){
        var row = [];
        row.push('<p><a href="post.html?postid=' + post.id + '">' + post.title + '</a></p>');

        $("section#posts").append(row.join(''));
    }

    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
});