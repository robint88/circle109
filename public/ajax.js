$('#newComment').submit(function(e){
    e.preventDefault();
    const commentItem = $(this).serialize();
    const commentUrl = window.location.pathname+"/comments";
    
    $.post(commentUrl, commentItem, function(data){
        $("#comments").append(
            `
            <tr>
                <td>
                    <em>
                        ${ data.author.username }
                    </em>
                </td>
                <td>
                    ${ data.text }
                </td>
            </tr>
            `
        );
        $("#comment").val('');
    });
});