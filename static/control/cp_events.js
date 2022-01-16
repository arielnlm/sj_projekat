function init() {

    document.getElementById('eId').addEventListener('input', e =>{
        fetch('http://localhost:9000/admin/events/' + document.getElementById('eId').value)
        .then( res => res.json() )
        .then( event => {
            document.getElementById('eName').value = event.name;
            document.getElementById('eDescription').value = event.description;
            let date = new Date(event.date);
            let newDate = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();
            console.log(Date(date.getDate(), date.getMonth() + 1, date.getFullYear()));
            
            document.getElementById('eDate').value = new Date(newDate);
            document.getElementById('eTime').value = event.time;
            document.getElementById('eHost').value = event.host;
            document.getElementById('eGuests').value = event.guests;
        });
    });
    document.getElementById('editEvent').addEventListener('click', e => {
        e.preventDefault();
        let eventId = document.getElementById('eId').value;
        const input = {
            name: document.getElementById('eName').value,
            description: document.getElementById('eDescription').value,
            date: document.getElementById('eDate').value,
            time: document.getElementById('eTime').value,
            host: document.getElementById('eHost').value,
            guests: document.getElementById('eGuests').value
        };

        fetch('http://localhost:9000/admin/events/' + eventId,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        })
        .then( res => res.json() )
        .then( data => {
            showEvents();
        });

    });
    document.getElementById('addEvent').addEventListener('click', e => {
        e.preventDefault();

        const input = {
            name: document.getElementById('eName').value,
            description: document.getElementById('eDescription').value,
            date: document.getElementById('eDate').value,
            time: document.getElementById('eTime').value,
            host: document.getElementById('eHost').value,
            guests: document.getElementById('eGuests').value
        };
        fetch('http://localhost:9000/admin/events', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        })
        .then( res => res.json() )
        .then( data => {
            showEvents();
        });
    });
    document.getElementById('deleteEvent').addEventListener('click', e => {
        e.preventDefault();
        let eventId = document.getElementById('eId').value;
        
        fetch('http://localhost:9000/admin/events/' + eventId, 
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then( res => res.json() )
        .then( data => {
            showEvents();
        });
    });

    showEvents();
    
}

function showEvents(){
    fetch('http://localhost:9000/admin/events')
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('eventList');
            lst.innerHTML = "";
            lst.innerHTML += `<tr><th> ID </th> <th> Name </th> <th> Description </th> <th> Date </th> <th> Time </th> <th> Host </th> <th> Guests </th> </tr>`;
            data.forEach( el => { 
                lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.name} </td> <td> ${el.description} </td> <td> ${el.date} </td> <td> ${el.time} </td> <td> ${el.host} </td> <td> ${el.guests} </td> </tr>`;
            });
        });
}
