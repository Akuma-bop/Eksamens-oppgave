// Funksjon for å tegne tabellen
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
                <td>
                    <button class="btn-info">INFO</button>
                    <button class="btn-slett" onclick="slettElement(${rad.id})">SLETT</button>
                </td>
            </tr>
        `;
    });
}

// Modal funksjonalitet
const modal = document.getElementById("modal");
const leggTilBtn = document.getElementById("leggTilBtn");
const closeBtn = document.querySelector(".close");
const formLeggTil = document.getElementById("formLeggTil");

// Åpne modal
leggTilBtn.onclick = function() {
    modal.style.display = "block";
}

// Lukk modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Lukk modal hvis man klikker utenfor
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Legg til ny PC
formLeggTil.onsubmit = function(e) {
    e.preventDefault();
    
    const nyPC = {
        modell: document.getElementById("modell").value,
        status: document.getElementById("status").value,
        tilstand: document.getElementById("tilstand").value
    };
    
    console.log("Ny PC lagt til:", nyPC);
    
    // Her kan du senere sende det til serveren
    modal.style.display = "none";
    formLeggTil.reset();
}