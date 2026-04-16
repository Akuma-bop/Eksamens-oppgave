
// HOPPFIKS - FRONTEND (script.js)

// Dette fila kjører i nettleseren
// Den håndterer tabellen, modal og knapper


// FUNKSJON 1: Last inn alle PC-er fra databasen

async function lastInnData() {
    try {
        const response = await fetch('/api/pcs');
        const data = await response.json();
        tegnTabell(data);
    } catch (error) {
        console.error('Feil ved lasting av data:', error);
    }
}


// FUNKSJON 2: Tegn tabellen med PC-data

function tegnTabell(data) {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = ""; // Tømmer tabellen først

    data.forEach(rad => {
        tableBody.innerHTML += `
            <tr>
                <td>${rad.id}</td>
                <td>${rad.modell}</td>
                <td>${rad.status}</td>
                <td>${rad.tilstand}</td>
                <td><button class="btn-info" onclick="visInfo(${rad.id})">INFO</button></td>
                <td><button class="btn-slett" onclick="slettElement(${rad.id})">SLETT</button></td>
            </tr>
        `;
    });
}


// FUNKSJON 3: Slett en PC

async function slettElement(id) {
    if (confirm('Er du sikker på at du vil slette denne PC-en?')) {
        try {
            const response = await fetch(`/api/pcs/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                lastInnData(); // Oppdater tabellen
            } else {
                console.error('Feil ved sletting:', response.statusText);
            }
        } catch (error) {
            console.error('Feil ved sletting:', error);
        }
    }
}


// FUNKSJON 4: Vis info om en PC

function visInfo(id) {
    alert(`Info om PC med ID: ${id}`);
}


// MODAL - For å legge til ny PC


// Disse variablene refererer til HTML-elementer

const modal = document.getElementById("modal");
const leggTilBtn = document.getElementById("leggTilBtn"); 
const closeBtn = document.querySelector(".close");
const formLeggTil = document.getElementById("formLeggTil"); 


// Åpne modal når man klikker på "+ Legg til PC"
leggTilBtn.onclick = function() {
    modal.style.display = "block";
}

// Lukk modal når man klikker X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Lukk modal hvis man klikker utenfor på bakgrunnen
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Legg til ny PC når skjemaet er sendt
formLeggTil.onsubmit = async function(e) {
    e.preventDefault();
    
    const nyPC = {
        modell: document.getElementById("modell").value,
        status: document.getElementById("status").value,
        tilstand: document.getElementById("tilstand").value
    };
    
    try {
        const response = await fetch('/api/pcs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nyPC)
        });
        
        if (response.ok) {
            modal.style.display = "none";
            formLeggTil.reset();
            lastInnData(); // Oppdater tabellen
        } else {
            console.error('Feil ved lagring:', response.statusText);
        }
    } catch (error) {
        console.error('Feil ved sending:', error);
    }
}


// Når siden lastes, hent og vis alle PC-er

document.addEventListener('DOMContentLoaded', lastInnData);