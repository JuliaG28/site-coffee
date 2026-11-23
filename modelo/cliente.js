/* ============================================================
   CONFIGURAÇÃO DO CLIENTE — é o ÚNICO arquivo que muda por cliente.
   Troque os textos, cores, produtos e contatos abaixo e o site inteiro
   (animação, catálogo, ficha, rodapé) se ajusta sozinho.

   A marca abaixo ("Café Aurora") é FICTÍCIA, só para demonstração.
   ============================================================ */
window.CLIENTE = {
  nome: 'Café Aurora',
  slogan: 'Café especial torrado em pequenos lotes',
  descricao: 'Café 100% arábica da Serra da Mantiqueira, torrado em pequenos lotes e entregue fresco na sua casa.',
  demonstracao: true, // true = mostra o aviso "marca fictícia" (tirar no site de cliente real)

  // Logo: caminho de uma imagem (PNG/SVG). Vazio = escreve o nome da marca.
  logo: '',

  // Cores da marca
  cores: {
    principal: '#1d3a5f', // botões, títulos, faixas
    escura: '#0f2238',    // fundos escuros, rodapé
    destaque: '#e8893a',  // detalhes, etiquetas de desconto, chamada final
    fundo: '#f3ece1',     // fundo das páginas
    papel: '#fbf8f2',     // fundo dos cartões
    parede: ['#dce8ef', '#c3d9e3'], // parede atrás da cafeteira (topo, base)
    bancada: ['#eadcc1', '#e0cfae'],
  },
  // Filtro aplicado na cafeteira do desenho (ela é azul). '' = mantém azul.
  // Ex.: verde = 'hue-rotate(-58deg) saturate(.85) brightness(.84)'
  filtroCafeteira: '',

  // Palavras grandes da animação (curtas! até ~8 letras cada)
  hero: { palavra1: 'aroma', palavra2: 'da serra', final1: '100%', final2: 'arábica' },

  // Pacote da animação. Vazio = desenha um pacote com o nome e as cores da marca.
  // Cliente real: PNG com fundo transparente do pacote em pé (proporção 530x1200)
  // e do pacote de cabeça pra baixo derramando grãos (proporção 760x2002).
  pacote: { emPe: '', aberto: '', deitado: '' },

  ticker: ['Frete grátis acima de R$150', 'Até 6x no cartão', '100% arábica', 'Torrado na semana do envio'],

  // Linhas de café (filtros do catálogo e abas da ficha de degustação)
  linhas: [
    { id: 'classico', nome: 'Clássico', cor: '#1d3a5f',
      ficha: { Sabor: 'Caramelo e castanhas', Aroma: 'Doce e acolhedor', Corpo: 'Médio, acidez suave', Torra: 2 } },
    { id: 'intenso', nome: 'Intenso', cor: '#3b2416',
      ficha: { Sabor: 'Chocolate amargo', Aroma: 'Marcante', Corpo: 'Encorpado, acidez baixa', Torra: 3 } },
    { id: 'especial', nome: 'Especial', cor: '#b5542b',
      ficha: { Sabor: 'Frutas amarelas e mel', Aroma: 'Floral e delicado', Corpo: 'Leve, acidez cítrica', Torra: 1 } },
  ],

  // Produtos do catálogo. img vazio = desenha o pacote na cor da linha.
  // link vazio = botão abre o WhatsApp já com o nome do produto.
  produtos: [
    { linha: 'classico', nome: 'Clássico em Grãos', peso: '500g', notas: ['Caramelo', 'Torra média'], preco: '49,90', de: '59,90', parcelas: '3x de R$16,63', img: '', link: '' },
    { linha: 'classico', nome: 'Clássico Moído', peso: '500g', notas: ['Caramelo', 'Torra média'], preco: '47,90', de: '', parcelas: '3x de R$15,97', img: '', link: '' },
    { linha: 'intenso', nome: 'Intenso Moído', peso: '500g', notas: ['Chocolate amargo', 'Torra escura'], preco: '45,90', de: '52,90', parcelas: '3x de R$15,30', img: '', link: '' },
    { linha: 'intenso', nome: 'Intenso em Grãos', peso: '1kg', notas: ['Chocolate amargo', 'Torra escura'], preco: '84,90', de: '', parcelas: '6x de R$14,15', img: '', link: '' },
    { linha: 'especial', nome: 'Especial Microlote', peso: '250g', notas: ['Frutas amarelas', 'Mel', 'Floral'], preco: '39,90', de: '', parcelas: '2x de R$19,95', img: '', link: '' },
    { linha: 'especial', nome: 'Kit Degustação', peso: '3 x 250g', notas: ['As três linhas', 'Presente'], preco: '99,90', de: '119,70', parcelas: '6x de R$16,65', img: '', link: '' },
  ],

  origem: {
    etiqueta: 'Serra da Mantiqueira · MG',
    titulo: 'Da montanha para a sua xícara, sem pressa',
    texto: 'Os grãos vêm de pequenos produtores da Mantiqueira, são colhidos maduros e torrados em lotes pequenos toda semana. Assim o café chega com o aroma de quem acabou de sair do torrador.',
    fatos: [['100%', 'arábica, em todas as linhas'], ['1.200m', 'de altitude média das lavouras'], ['7 dias', 'entre a torra e o envio'], ['3 linhas', 'clássico, intenso e especial']],
    frase: '',
    local: 'Serra da Mantiqueira, Minas Gerais',
  },

  vantagens: [
    ['frete', 'Frete grátis', 'Para todo o Brasil em compras acima de R$150.'],
    ['cartao', 'Até 6x', 'Parcele no cartão sem complicação.'],
    ['seguro', 'Compra segura', 'Pagamento protegido do pedido até a entrega.'],
    ['troca', 'Garantia de sabor', 'Não gostou? A gente troca o pacote.'],
  ],

  contato: {
    whatsapp: '', // só números, com DDI 55 + DDD (ex.: '5519912345678'). Vazio só na demonstração
    whatsappTexto: '(19) 0000-0000',
    instagram: 'cafeaurora',
    loja: '', // link da loja online, se tiver. Vazio = vendas pelo WhatsApp
    chamada: 'Pedidos para empresas, cafeterias e presentes: o atendimento é pelo WhatsApp.',
  },
};
