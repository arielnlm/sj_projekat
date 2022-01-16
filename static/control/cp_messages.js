function init() {

    document.getElementById('mId').addEventListener('input', e =>{
        fetch('http://localhost:9000/admin/messages/' + document.getElementById('mId').value)
        .then( res => res.json() )
        .then( mssg => {
            fetch('http://localhost:9000/admin/users/' + mssg.userId)
            .then( res => res.json() )
            .then( user => {
                document.getElementById('mBody').value = mssg.body;
                if(user != null)
                    document.getElementById('mBelongsTo').value = user.name;
                else
                    document.getElementById('mBelongsTo').value = "User not found / deleted"
            });
        });
    });

    document.getElementById('editMssg').addEventListener('click', e => {
        e.preventDefault();
        let mssgId = document.getElementById('mId').value;
        let username = document.getElementById("mBelongsTo").value;
        if(username != ""){
            fetch('http://localhost:9000/admin/users/name/' + username)
            .then( res => res.json() )
            .then( user => {
                const input = {
                    body: document.getElementById('mBody').value,
                    userId: user.id
                };
                
                fetch('http://localhost:9000/admin/messages/' + mssgId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input)
                })
                .then( res => res.json() )
                .then( data => {
                   
                    showMessages();
                });
            });
        }
    });
    
    document.getElementById('addMssg').addEventListener('click', e => {
        e.preventDefault();
        let username = document.getElementById("mBelongsTo").value;
        if(username != ""){
            fetch('http://localhost:9000/admin/users/name/' + username)
            .then( res => res.json() )
            .then( user => {
                const input = {
                    body: document.getElementById('mBody').value,
                    userId: user.id
                };
                fetch('http://localhost:9000/admin/messages', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input)
                })
                .then( res => res.json() )
                .then( data => {
                    showMessages();
                });
            });
        }
        
    });
    document.getElementById('deleteMssg').addEventListener('click', e => {
        e.preventDefault();

        mssgId = document.getElementById('mId').value;

        fetch('http://localhost:9000/admin/messages/' + mssgId, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then( res => res.json() )
        .then( data => {
            showMessages();
        });
    });

    
    showMessages();
}

function showMessages(){
    fetch('http://127.0.0.1:9000/admin/messages')
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('mssgList');
            lst.innerHTML = "";
            lst.innerHTML += `<tr><th> ID </th> <th> Belongs to </th> <th> Body </th> </tr>`;
            data.forEach( el => { 
                fetch('http://localhost:9000/admin/users/' + el.userId)
                .then( res => res.json() )
                .then( user => {
                    if(user != null)
                        lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${user.name} </td> <td> ${el.body} </td> </tr>`;
                    else
                        lst.innerHTML += `<tr> <td> ${el.id} </td> <td> User not found / deleted </td> <td> ${el.body} </td> </tr>`;
                });
            });
        });
}