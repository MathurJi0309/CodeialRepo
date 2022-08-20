{
    
        //we use the two funcation one is get data from from and other shows the post
        // method to submit the form data for new post using AJAX 
        let createPost =function(){
            let newPostForm=$('#new-post-form');
            //e for event
            console.log('new  ',newPostForm);
            newPostForm.submit(function(e){
                e.preventDefault();
                $.ajax({
                    type:'post',
                    url:'/posts/create',
                    //convert data in json
                    data:newPostForm.serialize(),
                    success:function(data){
                        let newPost=newPostDom(data.data.post);
                        // use prepend for to add comment first 
                        console.log('y  ',data);
                        $('#post-list-container>ul').prepend(newPost);
                        deletePost($('.delete-post-button',newPost));
                    },error: function(error){
                        console.log(error.responseText);
                    }
                })
            })
          }

          //method to create a post in DOM
          let newPostDom=function(post){
            //copy frm the post.ejs
            return $(`<li id="post-${post._id}">

            <p>
            
             <small>
        
                     <a class="delete-post-button" href="/posts/destroy/${post._id}">cross</a>
             </small>
        
            
        
             ${post.content}
             <br>
        <small>
        ${post.user.name}
        </small>
            </p>
            <div class="post-comment">
            
                <form action="/comments/create" method="POST">
                     <input type="text" name="content" placeholder="type here toadd comment...">
                     <input type="hidden" name="post" value="${post._id}">
                     <input type="submit" value="Add comment">
                </form>     
            
                     <div class="post-comments-list">
                             <ul id="post-comments-${post._id}">
                
                             </ul>
        
                     </div>
            </div>
        </li>`)
          }

// method to delete the post from DOM
let deletePost=function(deleteLink){
    console.log('n  ',deleteLink);
    $(deleteLink).click(function(e){
        e.preventDefault();


        $.ajax({
            type:'get',
            //hoe to get the value fo the href
            url:$(deleteLink).prop('href'),
            success: function(data){
                console.log('j  ',data);
                $(`#post-${data.data.post_id}`).remove();
            },error:function(error){
                console.log(error.responseText);
            }

        })
    })
}





          createPost();
}