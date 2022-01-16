function init() {

    document.getElementById('bId').addEventListener('input', e =>{
        fetch('http://localhost:9000/admin/books/' + document.getElementById('bId').value)
        .then( res => res.json() )
        .then( book => {
            document.getElementById('bName').value = book.name;
            document.getElementById('bAuthor').value = book.author;
            document.getElementById('bDescription').value = book.description;
            document.getElementById('uname').value = book.userId;
        });
    });
    document.getElementById('editBook').addEventListener('click', e => {
        e.preventDefault();
        let bookId = document.getElementById('bId').value;
        let username = document.getElementById('uname').value;
    
        // Get userId from user name
        fetch('http://localhost:9000/admin/users/name/' + username)
        .then( res => res.json() )
        .then( data => {
            const input = {
                name: document.getElementById('bName').value,
                author: document.getElementById('bAuthor').value,
                description: document.getElementById('bDescription').value,
                userId: data.id
            };
    
            fetch('http://localhost:9000/admin/books/' + bookId,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input)
            })
            .then( res => res.json() )
            .then( data => {
                showBooks();
            });
        });
        

    });
    
    document.getElementById('addBook').addEventListener('click', e => {
        e.preventDefault();
        let username = document.getElementById('uname').value;
        if(username != ""){
            fetch('http://localhost:9000/admin/users/name/' + username)
            .then( res => res.json() )
            .then( data => {
                const input = {
                    name: document.getElementById('bName').value,
                    author: document.getElementById('bAuthor').value,
                    description: document.getElementById('bDescription').value,
                    userId: data.id
                };
                fetch('http://localhost:9000/admin/books', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input)
                })
                .then( res => res.json() )
                .then( data => {
                    showBooks();
                });
            });
        }
        else{
            const input = {
                name: document.getElementById('bName').value,
                author: document.getElementById('bAuthor').value,
                description: document.getElementById('bDescription').value,
                userId: 0
            };
            fetch('http://localhost:9000/admin/books', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input)
            })
            .then( res => res.json() )
            .then( data => {
                showBooks();
            });
        }
        
    });
    document.getElementById('deleteBook').addEventListener('click', e => {
        e.preventDefault();

        bookId = document.getElementById('bId').value;

        fetch('http://localhost:9000/admin/books/' + bookId, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then( res => res.json() )
        .then( data => {
            showBooks();
        });
    });

    
    showBooks();
}

function showBooks(){
    fetch('http://localhost:9000/admin/books')
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('bookList');
            lst.innerHTML = "";
            lst.innerHTML += `<tr><th> ID </th> <th> Name </th> <th> Author </th> <th> Description </th> <th> Belongs to </th></tr>`;
            data.forEach( el => { 
                fetch('http://localhost:9000/admin/users/' + el.userId)
                .then( res => res.json() )
                .then( user => {
                    if(user != null)
                        lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.name} </td> <td> ${el.author} </td> <td> ${el.description} </td> <td> ${user.name} </td></tr>`;
                    else if(el.userId == 0)
                        lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.name} </td> <td> ${el.author} </td> <td> ${el.description} </td> <td> Noone </td></tr>`;
                    else
                        lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.name} </td> <td> ${el.author} </td> <td> ${el.description} </td> <td> User not found / deleted </td></tr>`; 
                });
            });
        });
}