import fs from 'fs/promises';
import path from 'path';



export default function ItemModelo() {
    let CodigoPin = null;
    async function carregarCodigoPin() {
        try {
            // Construir o caminho absoluto do arquivo JSON
            const filePath = path.resolve('dados', 'base_pin.json');
            
            // Ler o arquivo e fazer o parse do conteúdo
            const fileContent = await fs.readFile(filePath, 'utf8');
            CodigoPin = JSON.parse(fileContent); // Parse do JSON
            console.log('Códigos PIN carregados:', CodigoPin);
        } catch (err) {
            console.error('Erro ao carregar os códigos PIN:', err.message);
        }
    }
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }
    return{
        state,
        CodigoPin
    }
}