// Classe para representar um produto
$(document).ready(function () {
    // Classe Produtos

    class Produtos {

        constructor(plu, nome, precoAnterior, precoAlterado, unidade, fatorEtq) {
            this.plu = plu;
            this.nome = nome;
            this.precoAnterior = precoAnterior;
            this.precoAlterado = precoAlterado;
            this.unidade = unidade;
            this.fatorEtq = fatorEtq;
            this.fatorEtq2 = this.calcularPrecoPorKgL(); // Corrigindo a chamada do método
        }

        calcularPrecoPorKgL() {
            if (this.unidade === "KG" || this.unidade === "LITRO") {
                return (this.precoAlterado / this.fatorEtq * 1000).toFixed(2); // Preço por Kg
            } else {
                return "N/A"; // Unidade não suportada (por exemplo, "unidade")
            }
        }
    }

    // Função para ler o arquivo XLSX
    function lerArquivoXLSX(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const produtos = [];
            XLSX.utils.sheet_to_json(sheet, { header: 1 }).forEach(row => {
                if (row.length >= 5) { // Verifica se a linha contém pelo menos 5 elementos
                    const [plu, nome, precoAnterior, precoAlterado, unidade] = row;
                    // Extrair números do campo nome
                    const numerosNome = nome.match(/\d+\s*/g);
                    // Converter a matriz de números em uma única string separada por espaços
                    const fatorEtq = numerosNome ? numerosNome.join(' ') : '1000';
                    produtos.push(new Produtos(plu, nome, precoAnterior, precoAlterado, unidade, fatorEtq));
                } else {
                    console.log("Erro: a linha não possui a quantidade esperada de elementos");
                }
            });
            renderizarTabela(produtos);
            console.log(produtos);
        };
        reader.readAsArrayBuffer(file);
    }

    // Função para renderizar a tabela HTML
    function renderizarTabela(produtos) {

        const tabela = $('#corpoTabela');
    
        tabela.empty();
    
        produtos.forEach((produto, index) => {
    
            const li = $('<li></li>');
    
            // Cria uma string para todos os elementos <p> dentro do <li>
            let liContent = `<p class="NomeProd">${produto.nome}</p>`;
    
            if (parseFloat(produto.precoAnterior) > parseFloat(produto.precoAlterado)) {
                liContent += `<p class="preco anterior"> De R$ ${parseFloat(produto.precoAnterior).toFixed(2)}</p>`;
                liContent += `<p class="preco alterado">Por ${parseFloat(produto.precoAlterado).toFixed(2)}</p>`;
            } else {
                liContent += `<p class="preco alterado">R$ ${parseFloat(produto.precoAlterado).toFixed(2)}</p>`;
                liContent += `<p class="preco unidade">Preço ${produto.unidade} R$ ${produto.fatorEtq2}</p>`;
            }
    
            // Adiciona a string com os elementos <p> ao <li>
            li.append(liContent);
    
            tabela.append(li);
    
            // Adiciona a classe 'fim-da-pagina' ao nono <li>, a partir do segundo
            const itemsPerPage = 9;
            if (index >= 1 && (index + 1) % itemsPerPage === 1) {
                li.addClass('fim-da-pagina');
            }

            // Adiciona a classe 'paginaPeq' ao 14º <li>, a partir do segundo
            const itemsPorPag = 14;
            if (index >= 1 && (index + 1) % itemsPorPag === 1) {
                li.addClass('.paginaPeq');
            }


    
        });
    }
    




    // Evento de carregamento do arquivo
    $('#arquivo-input').on('change', function (e) {
        const file = e.target.files[0];
        lerArquivoXLSX(file);
    });
});

document.getElementById('btn-imprimir').addEventListener('click', function () {
    window.print();
});
