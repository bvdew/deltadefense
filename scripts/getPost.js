$(function () {
    var postId = GetURLParameter('postid'),             //get the post id
        root = 'https://jsonplaceholder.typicode.com';

    //load the post at page load
    $.ajax({
        url: root + "/posts/" + postId,
        method: "GET"
    })
    .done(function (post) {
        //once we have the post, get the author
        $.ajax({
            url: root + "/users/" + post.userId,
            method: "GET"
        })
        .done(function (user) {
            post.user = user;
            //show the post
            showPost(post);
        })
        .fail(function(){
            alert('Failed to retrieve author details.');
        });;
    });

    //load the post comments at page load
    $.ajax({
        url: root + "/posts/" + postId + "/comments",
        method: "GET"
    })
    .done(function (comments) {
        $.each(comments, function(){
            showComments(this);
        });
    }).fail(function(){
        alert('Failed to retrieve post comments.');
    });

    /**
     * Show the post body and author
     * @param {*} post 
     */
    function showPost(post){
        $('article').html(post.body);

        $('h1#title').html(post.title);
        $('p#author').html('<a href="author.html?userid=' + post.userId + '">by ' + post.user.name + '</a>');
        $('title').html(post.title + " | Brian VanDeWiel's Blog");
    }

    /**
     * List the post's comments
     * @param {*} comment 
     */
    function showComments(comment){
        var row = [];
        row.push('<div class="col-xs-12"><div class="author-block"><span class="icon-author"></span><a href="mailto:' + comment.email + '">' + comment.name + '</a></div>');
        row.push('<p>' + comment.body + '</p>');
        row.push('</div>');

        $('#commentSection').append(row.join(''));
    }

    /**
     * Get the user's latest comment and add it to the comment section
     */
    $(document).on('click', 'button#addComment', function(){
        var comment = $('input#newComment').val(),
            email = $('input#email').val(),
            name = $('input#name').val();

        //VALIDATION
        if($.trim(comment).length < 1){
            $('input#newComment').closest('.form-group').addClass('has-error');
            return false;
        }
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( !emailRegex.test(email.toLowerCase())){
            $('input#email').closest('.form-group').addClass('has-error');
            return false;
        }
        if($.trim(name).length < 1){
            $('input#name').closest('.form-group').addClass('has-error');
            return false;
        }

        //data to post
        var data = {
            body: comment,
            email: email,
            name: name,
            postId: postId
        };
            
        $.ajax({
            url: root + "/posts/" + postId + "/comments",
            method: "POST",
            data: JSON.stringify(data)
        })
        .done(function (result) {
            //clear out the form so that the user can add another comment
            $('#commentForm input').val('');
            //append the latest comment
            showComments(data);
        })
        .fail(function(){
            alert('Comment failed to post.');
        });
    });

    /**
     * Clear any errors on the field when the user starts typing
     */
    $(document).on('keyup', '#commentForm input', function(){
        $(this).closest('.form-group').removeClass('has-error');
    });

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