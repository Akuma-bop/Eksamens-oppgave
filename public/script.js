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