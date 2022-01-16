function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('uId').addEventListener('input', e =>{
        fetch('http://localhost:9000/admin/users/' + document.getElementById('uId').value,
        {'Authorization': `Bearer ${token}`})
        .then( res => res.json() )
        .then( user => {
            document.getElementById('uName').value = user.name;
            document.getElementById('uEmail').value = user.email;
            document.getElementById("uPassword").value = user.password;
            document.getElementById("admin").checked = user.admin;
            document.getElementById("mod").checked = user.mod;
        });
    });

    document.getElementById('editUser').addEventListener('click', e => {
        e.preventDefault();
        let userId = document.getElementById('uId').value;
        const input = {
            name: document.getElementById('uName').value,
            email: document.getElementById('uEmail').value,
            password: document.getElementById("uPassword").value,
            admin: document.getElementById("admin").checked,
            mod: document.getElementById("mod").checked
        };

        fetch('http://localhost:9000/admin/users/' + userId,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(input)
        })
        .then( res => res.json() )
        .then( data => {
            showUsers();
        });

    });
    document.getElementById('addUser').addEventListener('click', e => {
        e.preventDefault();

        const input = {
            name: document.getElementById('uName').value,
            email: document.getElementById('uEmail').value,
            password: document.getElementById("uPassword").value,
            admin: document.getElementById("admin").checked,
            mod: document.getElementById("mod").checked
        };
        fetch('http://localhost:9000/admin/users', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(input)
        })
        .then( res => res.json() )
        .then( data => {
            showUsers();
        });
    });
    document.getElementById('deleteUser').addEventListener('click', e => {
        e.preventDefault();
        let userId = document.getElementById('uId').value;
        console.log('http://localhost:9000/admin/users/' + userId);
        fetch('http://localhost:9000/admin/users/' + userId, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        })
        .then( res => res.json() )
        .then( data => {
            showUsers();
        });
    });

    showUsers();
    
}

function showUsers(){
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    fetch('http://localhost:9000/admin/users')
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('userList');
            lst.innerHTML = "";
            lst.innerHTML += `<tr><th> ID </th> <th> Name </th> <th> Email </th> <th> Password </th> <th> Admin </th> <th> Mod </th></tr>`;
            data.forEach( el => { 
                lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.name} </td> <td> ${el.email} </td> <td> ${el.password} </td> <td> ${el.admin} </td> <td> ${el.mod} </td></tr>`;
            });
        });
}
