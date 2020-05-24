// POST - New Comment
$('#newComment').submit(function(e){
    e.preventDefault();
    const commentItem = $(this).serialize();
    const commentUrl = $(this).attr('action');
    
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

// PUT - Edit comment
$("#comments").on('click', ".edit-button", function(){
    $(this).siblings('.edit-comment-form').toggle();
});
$('#comments').on('submit', '.edit-comment', function(e){
    e.preventDefault();
    const commentItem = $(this).serialize();
    const actionUrl = $(this).attr('action');
    $originalComment = $(this).parent('.edit-comment-form').parent('td');

    $.ajax({
        url: actionUrl,
        data: commentItem,
        type:"PUT",
        originalComment: $originalComment,
        success: function(data){
            this.originalComment.html(
                `
                ${data.text}
                <br>
                <br>
                <button class="btn btn-sm btn-outline-info edit-button">edit</button>
                <form id="deleteForm" class="deleteForm" action="${actionUrl}" method="POST">
                    <button href="" class="btn btn-sm btn-outline-danger">delete</button>
                </form>
                <div class="form-group edit-comment-form">
                    <form action="${actionUrl}" class="edit-comment" method="POST"> 
                        <label for="comment">comment</label>
                        <textarea class="form-control" name="comment[text]" id="comment" cols="30" rows="5">${data.text}</textarea>
                        <br>
                        <button class="btn btn-outline-info" type="submit">edit comment</button>         
                    </form>
                </div>

                `
            );
        }
    });
});

// DESTROY -Comment Delete
$('#comments').on('submit', ".deleteForm", function(e){
    e.preventDefault();
    const confirmDelete = confirm('Are you sure you want to delete this comment?');

    if(confirmDelete){
        const actionUrl = $(this).attr('action');
        $commentToDelete = $(this).closest('tr');

        $.ajax({
            url: actionUrl,
            type: 'DELETE',
            commentToDelete: $commentToDelete,
            success: function(data){
                this.commentToDelete.remove();
            }
        });
    } else {
        $(this).find('button').blur();
    }
});