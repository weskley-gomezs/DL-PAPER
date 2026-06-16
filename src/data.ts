import { Product, ThemeItem, Differential, Testimonial } from "./types";

// Bespoke generated images
export const IMAGES = {
  hero: "https://i.imgur.com/MK4ydyR.jpeg",
  about: "/src/assets/images/creative_studio_1779734454290.png",
  partyFavors: "/src/assets/images/party_favors_1779734471509.png",
  logo: "https://i.imgur.com/fVtEcdv.png"
};

export const INSTAGRAM_HANDLE = "@dlmagicpaper";
export const INSTAGRAM_URL = "https://instagram.com/dlmagicpaper";
export const WHATSAPP_NUMBER = "5561998889577";
export const WHATSAPP_FORMATTED = "(61) 99888-9577";

export const CATEGORIES = [
  "Todos",
  "Caixas Avulsas",
  "Kits de Caixas",
  "Lembrancinhas",
  "Docinhos",
  "Topos de Bolo",
  "Combos e Kits"
];

export const PRODUCTS: Product[] = [
  // 📦 CAIXAS PERSONALIZADAS AVULSAS
  {
    id: "caixa-sem-laco",
    name: "Caixa sem Laço",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.40,
    description: "Item econômico e prático para presentes leves. Produzido com corte preciso eletrônico em papel offset de alta gramatura.",
    image: "https://static.welban.com.br/public/welban/imagens/produtos/caixa-para-06-doces-sem-visor-kraft-unidade-conceito-64274d7feb711.jpg",
    badge: "Econômico",
    features: ["Papel offset de 180g", "Corte eletrônico perfeito", "Encaixe inteligente simples", "Personalização com alta fidelidade"]
  },
  {
    id: "caixa-bala",
    name: "Caixa Bala",
    category: "Caixas Avulsas",
    minPrice: 2.00,
    maxPrice: 2.00,
    description: "Formato charmoso que remete a uma bala gigante de caramelo com fechamento duplo lateral por laço.",
    image: "https://cdn.awsli.com.br/800x800/817/817549/produto/141285951/cf9a663486.jpg",
    features: ["Dois fechos de fita finos", "Design elegante e divertido", "Especial para chocolates e confeitos", "Destaque horizontal único"]
  },

  // 🎁 KITS DE CAIXAS PERSONALIZADAS
  {
    id: "kit-caixas-15",
    name: "Kit 15 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 22.90,
    maxPrice: 22.90,
    description: "Kit econômico contendo 15 caixas mistas selecionadas (9 caixas sem laço + 6 caixas com laço).",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    badge: "Kit Slim",
    features: ["9 Caixas sem laço inclusas", "6 Caixas com laço inclusas", "Qualquer tema escolhido", "Dobras fáceis e seguras"]
  },
  {
    id: "kit-caixas-20",
    name: "Kit 20 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 30.90,
    maxPrice: 30.90,
    description: "Excelente custo-benefício com 20 caixas selecionadas (12 caixas sem laço + 8 caixas com laço).",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    badge: "Custo-Benefício",
    features: ["12 Caixas simples inclusas", "8 Caixas com laço inclusas", "Estampa super viva e brilhosa", "Perfeito para lembrancinhas de mesa"]
  },
  {
    id: "kit-caixas-25",
    name: "Kit 25 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 38.90,
    maxPrice: 38.90,
    description: "O segredo para uma comemoração encantadora contendo 25 caixas mistas (15 caixas sem laço + 10 caixas com laço).",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    features: ["15 Caixas sem laço inclusas", "10 Caixas com laço inclusas", "Ideal para festas de porte médio", "Acabamentos eletrônicos rigorosos"]
  },
  {
    id: "kit-caixas-30",
    name: "Kit 30 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 45.90,
    maxPrice: 45.90,
    description: "Maravilhoso conjunto com 30 caixas mistas equilibradas (18 caixas sem laço + 12 caixas com laço) para uma linda simetria na decoração.",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    badge: "Mais Vendido",
    features: ["18 Caixas simples inclusas", "12 Caixas com laço inclusas", "Encaixe sob medida robusto", "Camadas 3D integradas nas tampas"]
  },
  {
    id: "kit-caixas-35",
    name: "Kit 35 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 53.90,
    maxPrice: 53.90,
    description: "A escolha favorita para montar lindas colunas organizadas na mesa. (21 caixas sem laço + 14 caixas com laço).",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    features: ["21 Caixas sem laço inclusas", "14 Caixas com laço inclusas", "Papel reforçado de altíssima fidelidade", "Cores vibrantes que encantam as mães"]
  },
  {
    id: "kit-caixas-40",
    name: "Kit 40 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 61.90,
    maxPrice: 61.90,
    description: "Kit encorpado de 40 caixas personalizadas para aniversários de grande presença física e farta distribuição.",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    features: ["40 Caixas temáticas luxuosas", "Mix de modelos à combinar", "Artesanato impecável Danyelle Lau", "Pronto para fazer brilhar sua mesa"]
  },
  {
    id: "kit-caixas-45",
    name: "Kit 45 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 68.90,
    maxPrice: 68.90,
    description: "Excelente conjunto volumoso de 45 peças para grandes salões trazendo dobras robustas e excelente brilho expositivo.",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    features: ["45 Caixas com cortes impecáveis", "Várias opções de montagem", "Acabamentos simétricos", "Memória durável para convidados"]
  },
  {
    id: "kit-caixas-50",
    name: "Kit 50 Caixas Personalizadas",
    category: "Kits de Caixas",
    minPrice: 76.90,
    maxPrice: 76.90,
    description: "Nosso maior e mais majestoso kit de caixas. Perfeito para preencher mesas gigantes de bento-grid com visual espetacular.",
    image: "https://i.imgur.com/fxPNAXS.jpeg",
    badge: "Super Kit",
    features: ["50 Caixas personalizadas", "Mix sob consultoria no WhatsApp", "Material fotográfico premium", "Maior índice de economia por unidade"]
  },

  // 🍭 LEMBRANCINHAS PERSONALIZADAS AVULSAS
  {
    id: "lembrancinha-tubete",
    name: "Tubete Personalizado",
    category: "Lembrancinhas",
    minPrice: 1.40,
    maxPrice: 1.40,
    description: "Frasco cilíndrico acrílico transparente com adesivo super nítido de alta aderência para guloseimas coloridas.",
    image: "https://cdn.dooca.store/259/products/fgpzrwjvqnljyg0pw6ysoelmlpumwpzsbfxn_640x640+fill_ffffff.jpg?v=1582746430&webp=0",
    features: ["Acrílico rígido seguro", "Adesivo impermeável fosco/brilho", "Perfeito para mini confeitos", "Sucesso garantido entre as crianças"]
  },
  {
    id: "lembrancinha-latinha",
    name: "Latinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Patinha clássica de fechamento hermético personalizado, ideal para compor bacias e bandejas temáticas com balas de menta.",
    image: "https://imgs.pontofrio.com.br/1509697522/1xg.jpg?imwidth=500",
    features: ["Lacre de excelente aderência", "Personalização com brilho intenso", "Fácil transporte e distribuição", "Indicado para confeitos pequenos"]
  },
  {
    id: "lembrancinha-sacolinha",
    name: "Sacolinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 4.90,
    maxPrice: 4.90,
    description: "Sacola de papel com alças de cetim ou cordão elegante. O invólucro ideal para presentear doces maiores do aniversário.",
    image: "https://cdn.awsli.com.br/485/485900/arquivos/sacola-kraft-para-lembrancinhas.jpg",
    badge: "Recomendado",
    features: ["Alça de corda ou fita cetim", "Papel de excelente espessura", "Laterais reforçadas", "Destaque marcante na hora de ir embora"]
  },
  {
    id: "lembrancinha-porta-kitkat",
    name: "Porta KitKat",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Embalagem estrutural premium exclusiva de papelão fino para a amada barra de chocolate KitKat.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTViIa4NZOmZBAV7rF507EkwMsvBeJjltUwt-ozpVWzmD6qq06UwbViklkA&s=10",
    features: ["Fundo de fechamento inteligente", "Cabe 1 barra clássica KitKat", "Destaque nos apliques em relevo", "Charme adicional nos acabamentos"]
  },
  {
    id: "lembrancinha-cofrinho",
    name: "Cofrinho Personalizado",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Cofrinho cilíndrico rígido encapado com papel fotográfico premium. Estimula e decora de forma lúdica.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEw6y8NnOqJOSECtO6U6LTI5AdMDpf88k4bD8Vbh7XfQ&s=10",
    features: ["Fenda superior reforçada", "Tampa plástica removível colorida", "Impressão brilhante sem marcas", "Um excelente presente ecológico"]
  },

  // 🍬 DOCINHOS PERSONALIZADOS
  {
    id: "doce-caixa-6",
    name: "Caixa para 6 Doces",
    category: "Docinhos",
    minPrice: 8.90,
    maxPrice: 8.90,
    description: "Caixa organizadora perfeita com divisória de proteção individual para até 6 doces gourmets.",
    image: "https://images.tcdn.com.br/img/img_prod/574525/caixa_para_6_doces_kraft_119_2_20190705095514.jpg",
    features: ["6 Cavidades bem seguras", "Tampa com encaixe perfeito", "Excelente acabamento lateral", "Visor transparente largo"]
  },
  {
    id: "doce-caixa-12",
    name: "Caixa para 12 Doces",
    category: "Docinhos",
    minPrice: 15.90,
    maxPrice: 15.90,
    description: "Tamanho generoso e tampa articulável exclusiva. O presente preferido de fim de ano para professores e família.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmfWvb89rq_Mrv3Bh81x9EmZa2XTwCejL1xBzsFeMSlicPetNxHXApW7Ae&s=10",
    features: ["12 Divisórias anti-impacto", "Uso excelente nas festividades de fim de ano", "Abas protetoras exclusivas", "Impressão personalizada inclusa"]
  },

  // 🍬 VERSÃO PREMIUM COM LAÇO
  {
    id: "premium-caixa-4",
    name: "Caixa Premium 4 Doces (com Laço)",
    category: "Docinhos",
    minPrice: 8.90,
    maxPrice: 8.90,
    description: "Versão de luxo da caixa de 4 doces trazendo um refinado laço de cetim de alta fita e apliques em relevo dourado.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVmOA1MuYJ7GZlwBXmwfRoWCPVYizMCm2EIAVAQPzGfYq2ELjgmIxFVXD&s=10",
    badge: "Premium",
    features: ["Acompanha fita e giga laço", "Estereoscopia 3D frontal", "Visor trabalhado com vinco", "Acabamento aristocrático fino"]
  },
  {
    id: "premium-caixa-8",
    name: "Caixa Premium 8 Doces (com Laço)",
    category: "Docinhos",
    minPrice: 12.90,
    maxPrice: 12.90,
    description: "A joia das lembrancinhas de luxo. Laço grandioso com fita importada e apliques minuciosos de camadas peroladas.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUcbBY2Q94leD-8NWnAL7mG4Znx0Lq_RHpSdjgXyLjt9gXoGdF9j1tQTi7&s=10",
    badge: "Premium",
    features: ["Laço farto decorado", "Papel especial texturizado", "Excelente para batizados e casamentos", "Acabamento manual impecável"]
  },
  {
    id: "premium-caixa-16",
    name: "Caixa Premium 16 Doces (com Laço)",
    category: "Docinhos",
    minPrice: 22.90,
    maxPrice: 22.90,
    description: "O auge da sofisticação afetiva de doces. Caixa majestosa com giga laço decorado e pingente temático.",
    image: "https://www.finebox.com.br/1425-large_default/caixa-para-16-doces-e-bombons-branco.jpg",
    badge: "Luxo Extremo",
    features: ["Giga laço de volumetria extrema", "Pingente acrílico/papel brilhante", "O presente definitivo para anfitriões", "Corte micro-laser limpo"]
  },

  // 🎂 TOPO DE BOLO
  {
    id: "topo-com-nome",
    name: "Topo Simples com Nome em Destaque",
    category: "Topos de Bolo",
    minPrice: 15.90,
    maxPrice: 15.90,
    description: "Acrescenta realce no nome principal com corte eletrônico duplo e pequena sobreposição 3D.",
    image: "https://cdn.awsli.com.br/2500x2500/409/409878/produto/240005991/20230929_162453-2-me2ds5c66a.jpg",
    badge: "Mais Procurado",
    features: ["Nome em destaque em duas camadas", "Excelente relevo visual", "Até 5 elementos decorativos inclusos", "Encaixe firme no bolo"]
  },


  // 🎈 KITS DE LEMBRANCINHAS (MÍNIMO 5 PRODUTOS)
  {
    id: "kit-economico",
    name: "Kit Econômico de Lembrancinhas",
    category: "Combos e Kits",
    minPrice: 49.90,
    maxPrice: 49.90,
    description: "Selecione esta deliciosa opção de preenchimento inteligente contendo 25 peças (5 Tubetes, 5 Caixas Milk, 5 Caixas Pirâmide, 5 Caixas Bala, 5 Caixas Cubo).",
    image: "https://i.imgur.com/jgc3GmX.jpeg",
    badge: "Super Poupança",
    features: ["5 Tubetes inclusos", "5 Caixas Milk inclusas", "5 Caixas Pirâmide inclusas", "5 Caixas Bala inclusas", "5 Caixas Cubo inclusas", "Total de 25 itens elegantes"]
  },
  {
    id: "kit-classic",
    name: "Kit Clássico de Lembrancinhas",
    category: "Combos e Kits",
    minPrice: 59.90,
    maxPrice: 59.90,
    description: "A experiência ideal trazendo charme artesanal robusto com 25 peças de grande requinte (5 Tubetes, 5 Tubolatas, 5 Caixas Milk, 5 Caixas Pirâmide, 5 Caixas Sushi).",
    image: "https://i.imgur.com/kSVXiPa.jpeg",
    badge: "Best Seller",
    features: ["5 Tubetes inclusos", "5 Tubolatas decoradas inclusas", "5 Caixas Milk inclusas", "5 Caixas Pirâmide inclusas", "5 Caixas Sushi inclusas", "Total de 25 itens com laço"]
  },
  {
    id: "kit-encantado",
    name: "Kit Encantado de Lembrancinhas",
    category: "Combos e Kits",
    minPrice: 79.90,
    maxPrice: 79.90,
    description: "Encha os olhos dos seus familiares com 25 lembranças premium (5 Tubetes, 5 Tubolatas, 5 Sacolinhas, 5 Marmitinhas, 5 Caixas Milk).",
    image: "https://i.imgur.com/s5bo2Fr.jpeg",
    badge: "Recomendado",
    features: ["5 Tubetes", "5 Tubolatas", "5 Sacolinhas imponentes", "5 Marmitinhas", "5 Caixas Milk volumosas", "Visual farto e impactante"]
  },
  {
    id: "kit-premium",
    name: "Kit Premium de Lembrancinhas",
    category: "Combos e Kits",
    minPrice: 99.90,
    maxPrice: 99.90,
    description: "Perfeito para lembranças inesquecíveis contendo 25 luxuosos mimos (5 Tubetes, 5 Tubolatas, 5 Sacolinhas, 5 Marmitinhas, 5 Cofrinhos).",
    image: "https://i.imgur.com/Ff2IkJn.jpeg",
    badge: "Luxo Supremo",
    features: ["5 Tubetes", "5 Tubolatas", "5 Sacolinhas", "5 Marmitinhas", "5 Cofrinhos", "Nossa melhor combinação para close-ups lucrativos"]
  },

  // 🎉 COMBOS COMPLETOS PARA FESTA
  {
    id: "combo-basico",
    name: "Combo Básico de Festa",
    category: "Combos e Kits",
    minPrice: 34.90,
    maxPrice: 34.90,
    description: "A facilidade encantadora para o bolinho de casa contendo um Kit de 15 caixas completas e um Topo de bolo simples coordenados.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI-8U0kZHidcrgDJxHaPnEAy461Mt5HBAr6nKmHAe5KSmX-tQxtG2lrY&s=10",
    badge: "Pocket Party",
    features: ["Kit 15 Caixas (9 simples + 6 laço)", "1 Topo de Bolo Simples", "Tudo com design impecável Danyelle Lau", "Indicado para reuniões até 10 pessoas"]
  },
  {
    id: "combo-classic",
    name: "Combo Clássico de Festa",
    category: "Combos e Kits",
    minPrice: 99.90,
    maxPrice: 99.90,
    description: "Completa a sua festa de forma brilhante contendo um Kit de 20 caixas selecionadas, um Topo de bolo dupla camada 3D e um Kit Econômico completo (25 lembranças).",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI-8U0kZHidcrgDJxHaPnEAy461Mt5HBAr6nKmHAe5KSmX-tQxtG2lrY&s=10",
    badge: "Sucesso Absoluto",
    features: ["Kit 20 Caixas mistas", "1 Topo de Bolo Dupla Camada 3D", "Kit Econômico de 25 peças", "Total de 46 itens na mesa", "Praticidade e economia majestosa"]
  },
  {
    id: "combo-premium",
    name: "Combo Premium do Ateliê",
    category: "Combos e Kits",
    minPrice: 169.90,
    maxPrice: 169.90,
    description: "Nossa experiência de maior sucesso e abundância estética. Contém Kit de 30 caixas mistas de luxo, um Topo de bolo dupla camada premium e o Kit de Lembrancinhas Premium completo (25 mimos).",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI-8U0kZHidcrgDJxHaPnEAy461Mt5HBAr6nKmHAe5KSmX-tQxtG2lrY&s=10",
    badge: "Festa de Cinema",
    features: ["Kit 30 Caixas completas", "1 Topo de Bolo Dupla Camada Premium", "Kit Premium de 25 mimos com cofrinhos", "Total de 56 recordações inesquecíveis", "Atendimento exclusivo com simulação prévia"]
  }
];

export const THEMES: ThemeItem[] = [
  {
    id: "stitch-rosa",
    name: "Stitch Rosa",
    image: "https://dicasdedecoracao.com.br/wp-content/uploads/2025/06/decoracao-stitch05fada90b5c56dd3801c38cce437de27.jpg",
    colors: ["#FF6699", "#D3C2FF", "#E0F7FA"],
    vibe: "TROPICAL, ALEGRE E SUPER FOFO"
  },
  {
    id: "barbie",
    name: "Barbie Chic",
    image: "https://todadecorada.com.br/wp-content/uploads/2025/03/decoracao-da-barbie-01.jpg",
    colors: ["#FF1493", "#FF6699", "#FFFFFF"],
    vibe: "FASHION, BRILHOSO E ICÔNICO"
  },
  {
    id: "hot-wheels",
    name: "Hot Wheels",
    image: "https://curitifestas.com.br/wp-content/uploads/2023/12/Tema-Hot-Wheels-4.jpeg?v=1703378187",
    colors: ["#FF4500", "#1E90FF", "#000000"],
    vibe: "ADRENALÍNICO, VELOZ E DESTEMIDO"
  },
  {
    id: "sonic",
    name: "Sonic",
    image: "https://i.pinimg.com/originals/13/7a/fd/137afd34c87d35012f7ccaf6f1216a14.jpg",
    colors: ["#0055FF", "#FFE600", "#FFFFFF"],
    vibe: "AVENTUROSO, DINÂMICO E VIBRANTE"
  },
  {
    id: "fazendinha",
    name: "Fazendinha Linda",
    image: "https://www.blog.fiestapartyfesta.com.br/wp-content/uploads/2024/02/decoracao-fazendinha-2.jpg",
    colors: ["#FFF68F", "#8B4513", "#C2F0C2"],
    vibe: "RÚSTICO, ACOLHEDOR E CAMPESTRE"
  },
  {
    id: "safari",
    name: "Safari Pastel",
    image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mbi5fghi1hwif6",
    colors: ["#A3E4D7", "#FFF68F", "#E5D8B3"],
    vibe: "SELVAGEM, SUAVE E MUITO AMIGÁVEL"
  },
  {
    id: "unicornio",
    name: "Unicórnio Mágico",
    image: "https://delicartefesta.com.br/wp-content/uploads/2023/06/IMG_20250308_1056434662-scaled.jpg",
    colors: ["#FFD1DC", "#D3C2FF", "#E0F7FA"],
    vibe: "ONÍRICO, HOLOGRÁFICO E ENCANTADOR"
  },
  {
    id: "homem-aranha",
    name: "Homem-Aranha",
    image: "https://todadecorada.com.br/wp-content/uploads/2025/04/decoracao-do-homem-aranha-01.jpg",
    colors: ["#E74C3C", "#2E86C1", "#2C3E50"],
    vibe: "HERÓICO, URBANO E RADIANTE"
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRd_wvUUTfC56vr9Oqa8iJ61xv2diJ3FmqEw&s",
    colors: ["#52BE80", "#85929E", "#5D4037"],
    vibe: "PIXELADO, CRIATIVO E GEOMÉTRICO"
  },
  {
    id: "wandinha",
    name: "Wandinha Addams",
    image: "https://m.media-amazon.com/images/I/81RPlrLdWhL._AC_UF894,1000_QL80_.jpg",
    colors: ["#2C3E50", "#D3C2FF", "#111111"],
    vibe: "GÓTICO CHIC, ENIGMÁTICO E ELEGANTE"
  }
];

export const DIFFERENTIALS: Differential[] = [
  {
    id: "exclusividade",
    title: "Personalização Exclusiva",
    description: "Cada projeto é desenhado do zero, considerando o temperamento do aniversariante e a paleta exata da decoração da festa.",
    icon: "Sparkles"
  },
  {
    id: "artesanal",
    title: "Produção Artesanal",
    description: "Montagem minuciosa feita à mão, com colagens delicadas, fitas sob medida e controle absoluto de qualidade.",
    icon: "Heart"
  },
  {
    id: "acolhimento",
    title: "Atendimento Acolhedor",
    description: "Conversamos de mãe para mãe, entendendo cada expectativa e transformando sua ideia em realidade sem estresse.",
    icon: "Smile"
  },
  {
    id: "alta-qualidade",
    title: "Papéis de Alta Gramatura",
    description: "Utilizamos papéis offset, fotográficos e perolados de alta densidade (180g a 240g), garantindo estrutura rígida.",
    icon: "Award"
  },
  {
    id: "entrega-brasil",
    title: "Envio Seguro Todo Brasil",
    description: "Embalagens ultra-protegidas contra amassados com frete inteligente para todo o país. Seus produtos chegam intactos.",
    icon: "Truck"
  },
  {
    id: "feito-com-proposito",
    title: "Criado com Propósito",
    description: "Mais do que caixas, entregamos suportes físicos para memórias afetivas que serão guardadas nos álbuns da família e no coração.",
    icon: "CheckCircle"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ana-luiza",
    name: "Ana Luíza Martins",
    role: "Mãe do Theo (4 anos)",
    event: "Aniversário Stitch Rosa",
    content: "Estou simplesmente apaixonada pelo capricho do Kit Luxo! Cada caixa veio perfeita, com o Stitch em relevo e detalhes metalizados maravilhosos. O atendimento no Whatsapp foi muito acolhedor, tirando todas as dúvidas. Com certeza indico pra todo mundo de Brasília!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150"
  },
  {
    id: "carla-souza",
    name: "Carla Souza de Oliveira",
    role: "Mãe das gêmeas Mel e Sophia",
    event: "Festa Unicórnio Mágico",
    content: "Os topos de bolo dupla camada mudaram completamente a cara dos bolinhos que comprei. Virou uma verdadeira obra de arte! Fiquei admirada com a rapidez da produção e as cores tão vibrantes dos adesivos. DL Magic Paper salvou minha festa em tempo recorde!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
  },
  {
    id: "bruna-porto",
    name: "Bruna Porto",
    role: "Decoradora Profissional",
    event: "Sessões e Festas Premium",
    content: "Como decoradora, exijo extrema qualidade nas caixinhas que vão à mesa. A DL Magic Paper entrega acabamento impecável, vincos firmes e laços simétricos perfeitos que elevam o valor percebido das minhas produções. Uma parceira fantástica e super pontual.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
  },
  {
    id: "renata-vasco",
    name: "Renata Vasconcellos",
    role: "Mãe do Arthur",
    event: "Kit Escolar Personalizado",
    content: "Comprei os adesivos escolares à prova d'água e estou chocada de como resistem à lavagem das garrafinhas e potinho de lanche todos os dias. O tema do Sonic que ele escolheu ficou perfeito. Lindos e duráveis, custo-benefício incrível!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150"
  }
];
