// Cria uma instância de conexão com o servidor usando o socket.io.
const socket = io()

//variavel principal 
var Itens
var ItemAtual
var ItensMP
var CodigoPin
var ItensModelo
var SetModelo

// Define um evento que é executado quando o cliente se conecta com sucesso ao servidor.
socket.on('connect', () => {
    // Obtém o identificador único do cliente gerado pelo servidor (ID do socket).
    const playerId = socket.id

    // Exibe no console uma mensagem indicando que o jogador foi conectado, junto com seu ID.
    console.log(`Player connected on Client with id: ${playerId}`)

})
socket.on('setup',(registroConexao) =>{
    console.log(registroConexao)
})
// Evento para receber os dados principais
socket.on('dados', (data) => {
    Itens = data.itens;
    ItensMP = data.itensMP;
    CodigoPin = data.codigoPin;
    carregaModelo(); // Inicia o carregamento dos modelos na interface
});

// Envia pedido de dados ao servidor ao carregar a página
window.onload = function () {
    socket.emit('requestDados');
};

// Carrega os modelos na lista de opções
function carregaModelo() {
    const btmodelo = document.getElementById('btModelo');
    const vet = Itens.map((it) => it.Modelo);
    ItensModelo = Array.from(new Set(vet)); // Remove duplicados

    ItensModelo.forEach((item) => {
        const model = document.createElement('option');
        model.value = item;
        model.innerText = item;
        btmodelo.appendChild(model);
    });
}

// Função para filtrar a tabela
function filterTable() {
    const mod = document.getElementById('input-btModelo');
    const filter = mod.value.toLowerCase();
    const table = document.getElementById('galeria');
    const rows = table.getElementsByTagName('tr');

    // Lógica de filtro
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerHTML.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }
        row.style.display = match ? '' : 'none';
    }
}

// Evento para carregar os dados de PIN por modelo
function carregaPin(modelo) {
    socket.emit('requestPin', { modelo });

    socket.on('responsePin', (data) => {
        const lbPin = document.getElementById('lbPin');
        lbPin.innerText = data.pin || 'Verificar se tem PIN';
    });
}

// Carrega os itens correspondentes ao modelo selecionado
function modeloSelecionado() {
    const inp = document.getElementById('input-btModelo');
    const rdPecas = document.getElementById('radio_Pecas');
    const rdMP = document.getElementById('radio_MP');
    const gal = document.getElementById('exibicao');
    let vetAux = [];

    if (rdPecas.checked) vetAux = Itens;
    if (rdMP.checked) vetAux = ItensMP;

    ItemAtual = vetAux.filter((it) => it.Modelo === inp.value);

    gal.innerHTML = ''; // Limpa a tabela antes de preencher
    ItemAtual.forEach((element) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');

        td1.innerText = element.Modelo;
        td2.innerText = element.Descrição;
        td3.innerText = element.CÓDIGO;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        gal.appendChild(tr);
    });
}
