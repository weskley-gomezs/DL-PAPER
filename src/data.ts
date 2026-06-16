import { Product, ThemeItem, Differential, Testimonial } from "./types";

// Bespoke generated images
export const IMAGES = {
  hero: "https://i.imgur.com/Es3OQW6.jpeg",
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
  "Kits de Caixas",
  "Caixas Avulsas",
  "Lembrancinhas",
  "Topos de Bolo",
  "Forminhas",
  "Toppers"
];

export const PRODUCTS: Product[] = [
  // 📦 CAIXAS PERSONALIZADAS AVULSAS (MILK, BALA, PIRÂMIDE, SUSHI, MALA)
  // Pode ser com laço (R$ 1,72) ou sem laço (R$ 1,40)
  {
    id: "caixa-milk",
    name: "Caixa Milk",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "A queridinha das festas no formato Milk clássico. Design fofo, recortado com precisão em papel de alta gramatura de 180g. Pode ser encomendada com ou sem laço de cetim luxuoso.",
    image: "https://i.imgur.com/mYMClJY.jpeg",
    badge: "Mais Pedida",
    features: ["Papel offset premium de 180g", "Corte eletrônico perfeito", "Laço de cetim luxuoso opcional", "Fácil de montar"]
  },
  {
    id: "caixa-bala",
    name: "Caixa Bala",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Lindo formato horizontal que remete a uma bala gigante de caramelo com fechamento charmoso. Opção com ou sem laço de cetim.",
    image: "https://i.imgur.com/Ai1fV66.jpeg",
    badge: "Destaque da Mesa",
    features: ["Formato bala divertido", "Fechamento simétrico elegante", "Laço de cetim lateral opcional", "Impecável no tema escolhido"]
  },
  {
    id: "caixa-piramide",
    name: "Caixa Pirâmide",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Caixa em formato triangular de cone que confere altura e elegância imediata à mesa do bolo. Escolha com ou sem laço de cetim de alta qualidade no topo.",
    image: "https://i.imgur.com/boQBgeb.jpeg",
    badge: "Sofisticada",
    features: ["Formato cone tridimensional", "Nome e personagem em destaque", "Laço de cetim no topo opcional", "Acabamento profissional"]
  },
  {
    id: "caixa-sushi",
    name: "Caixa Sushi",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Formato trapézio charmoso com encaixes perfeitos de segurança. Pode ser decorada com um elegante laço de cetim ou na versão simples e limpa.",
    image: "https://i.imgur.com/NVSCT1a.jpeg",
    badge: "Clássica",
    features: ["Base trapézio firme", "Encaixe inteligente de fundo", "Fita de cetim decorativa opcional", "Fácil preenchimento de doces"]
  },
  {
    id: "caixa-mala",
    name: "Caixa Mala",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Maletinha lúdica com alça integrada. Perfeita para encantar as crianças como lembrancinha de doces. Opções com laço colado na alça ou sem.",
    image: "https://i.imgur.com/XyHjuCE.jpeg",
    badge: "Lúdica",
    features: ["Alça de papel estruturado", "Belo espaço para guloseimas", "Laço de cetim premium opcional", "Recorte eletrônico de alta definição"]
  },

  // 🎁 KITS FESTAS CLÁSSICO (CADA KIT VEM COM 5 CAIXAS DE CADA TIPO PARA COMBINAÇÃO!)
  {
    id: "kit-caixas-custom",
    name: "Kit Festas Clássico (Misto)",
    category: "Kits de Caixas",
    minPrice: 22.90,
    maxPrice: 76.90,
    description: "Kits sob medida contendo as 5 caixas clássicas (Milk, Bala, Pirâmide, Sushi e Mala). Escolha a quantidade de caixas desejada e veja a repartição ideal entre caixas com e sem laço.",
    image: "https://i.imgur.com/MIGyVNh.jpeg",
    badge: "Configurável",
    features: ["Cinco modelos clássicos inclusos", "Escolha de 15 a 50 caixas", "Proporção balanceada de laços", "Design impecável com e sem laço"]
  },

  // 🍭 LEMBRANCINHAS PÓS FESTA (Pedido mínimo: 10 unidades de cada)
  {
    id: "lembrancinha-adesivo",
    name: "Adesivo Personalizado",
    category: "Lembrancinhas",
    minPrice: 0.80,
    maxPrice: 0.80,
    description: "Adesivos fotográficos de alta aderência com contorno eletrônico personalizado em qualquer tema.",
    image: "https://cdn.awsli.com.br/600x1000/707/707917/produto/325920975/embalagem-4-cfvrfz9t28.jpeg",
    badge: "Mín. 10 unid.",
    features: ["Brilho fotográfico vivo", "Cortado sob medida", "Design coordenado com o tema", "Ideal para tubetes, latas e sacolas"]
  },
  {
    id: "lembrancinha-tubete",
    name: "Tubete Personalizado",
    category: "Lembrancinhas",
    minPrice: 1.40,
    maxPrice: 1.40,
    description: "Frasco cilíndrico acrílico transparente com tampa plástica colorida e lindo aplique em destaque.",
    image: "https://cdn.awsli.com.br/2500x2500/71/71166/produto/20977701/bf54f55a98.jpg",
    badge: "Mín. 10 unid.",
    features: ["Acrílico rígido transparente", "Aplique de personagem recortado", "Tampa rosqueável firme", "Excelente para confeitos"]
  },
  {
    id: "lembrancinha-tubolata-5x6",
    name: "Tubolata Personalizada (5X6cm)",
    category: "Lembrancinhas",
    minPrice: 3.20,
    maxPrice: 3.90,
    description: "Cilindro de papelão micro-ondulado premium tamanho 5x6 com tampa metálica luxuosa e embalagem adesivada. Opções com laço de cetim exuberante ou sem laço.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YsULBmgfd9LZDwjZ9iEeoiKQjhPIcwaJUO-KiJwCwSstX1H3YMkvhnJ1&s=10",
    badge: "Refinada",
    features: ["Formato vintage refinado", "Papelão ultra estruturado", "Laço de cetim premium opcional", "Excelente lembrança durável", "Pedido mínimo de 10 unidades"]
  },
  {
    id: "lembrancinha-latinha",
    name: "Latinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Latinha acrílica ou plástica com adesivo redondo de alto brilho no topo. Uma lembrancinha tradicional e amada.",
    image: "https://cdn.awsli.com.br/2500x2500/71/71166/produto/20733798/3b8522cc02.jpg",
    badge: "Mín. 10 unid.",
    features: ["Compacto e fácil de carregar", "Personalização inteiramente brilhosa", "Perfeito para pastilhas ou guloseimas"]
  },
  {
    id: "lembrancinha-cofrinho",
    name: "Cofrinho Personalizado",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Cofrinho rígido encapado com rótulo fotográfico alto-brilho e tampas plásticas removíveis coloridas.",
    image: "https://images.tcdn.com.br/img/img_prod/660758/10_cofrinhos_personalizados_lembrancinhas_temas_a_1_20250915163439_5185e920e077.jpg",
    badge: "Mín. 10 unid.",
    features: ["Papel fotográfico brilhante", "Lembrança útil e ecológica", "Tampas coloridas de acordo com a paleta"]
  },
  {
    id: "lembrancinha-sacolinha",
    name: "Sacolinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 4.90,
    maxPrice: 4.90,
    description: "Sacola de papel com reforço lateral e lindas abas com cordões em fita de cetim. A embalagem final perfeita.",
    image: "https://i.imgur.com/QLJ0hjg.png",
    badge: "Mín. 10 unid.",
    features: ["Fita de cetim luxuosa", "Papel reforçado durável", "Tema ilustrado completo nas laterais"]
  },
  {
    id: "lembrancinha-marmitinha",
    name: "Marmitinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Marmitinha clássica de alumínio com tampa fotográfica personalizada. Um sucesso tradicional de festas.",
    image: "https://http2.mlstatic.com/D_NQ_NP_799263-MLB83907410878_042025-O.webp",
    badge: "Mín. 10 unid.",
    features: ["Alumínio resistente", "Tampa impermeável brilhosa", "Ideal para fatias de bolo e docinhos"]
  },
  {
    id: "lembrancinha-porta-bis",
    name: "Porta Bis Duplo",
    category: "Lembrancinhas",
    minPrice: 1.80,
    maxPrice: 1.80,
    description: "Embalagem suporte divertida projetada sob medida para abrigar dois chocolates Bis com aplique 3D.",
    image: "https://images.tcdn.com.br/img/img_prod/504105/caixa_bis_duplo_28_1_20200329081915.jpg",
    badge: "Mín. 10 unid.",
    features: ["Serve 2 chocolates Bis", "Elemento 3D saliente", "Enche a mesa com pequenos charmes"]
  },
  {
    id: "lembrancinha-porta-kitkat",
    name: "Porta KitKat",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Embalagem estrutural premium para vestir a amada barra de chocolate KitKat, com detalhes em relevo no tema.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTViIa4NZOmZBAV7rF507EkwMsvBeJjltUwt-ozpVWzmD6qq06UwbViklkA&s=10",
    badge: "Mín. 10 unid.",
    features: ["Encaixe sob medida perfeito", "Excelente acabamento protetivo", "Brilho e sofisticação no papel"]
  },
  {
    id: "lembrancinha-caixa-4-doces",
    name: "Caixa 4 Doces",
    category: "Lembrancinhas",
    minPrice: 2.80,
    maxPrice: 2.80,
    description: "Caixinha fina com divisórias internas para abrigar perfeitamente 4 doces finos ou brigadeiros.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVmOA1MuYJ7GZlwBXmwfRoWCPVYizMCm2EIAVAQPzGfYq2ELjgmIxFVXD&s=10",
    badge: "Mín. 10 unid.",
    features: ["4 divisórias internas", "Excelente para brigadeiro gourmet", "Visual carinhoso para lembrancinha"]
  },
  {
    id: "lembrancinha-caixa-6-doces",
    name: "Caixa 6 Doces",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Caixinha refinada com visor ou tampa decorada contendo divisórias internas para 6 deliciosos brigadeiros.",
    image: "https://images.tcdn.com.br/img/img_prod/574525/caixa_para_6_doces_kraft_119_2_20190705095514.jpg",
    badge: "Mín. 10 unid.",
    features: ["6 Berços individuais", "Papel de alta qualidade", "Corte visual delicado e firme"]
  },

  // 🎂 TOPO DE BOLO (Simples, com Destaque ou Dupla Camada)
  {
    id: "topo-bolo-simples",
    name: "Topo de Bolo Simples",
    category: "Topos de Bolo",
    minPrice: 12.90,
    maxPrice: 12.90,
    description: "Conjunto de tags decorativas com corte eletrônico para enfeitar o bolo com haste acrílica invisível.",
    image: "https://cdn.awsli.com.br/2500x2500/409/409878/produto/240005991/20230929_162453-2-me2ds5c66a.jpg",
    badge: "Tradicional",
    features: ["Palitos invisíveis acrílicos", "Imagens nítidas cortadas eletronicamente", "Fácil posicionamento no bolo"]
  },
  {
    id: "topo-bolo-destaque",
    name: "Topo Simples com Nome em Destaque",
    category: "Topos de Bolo",
    minPrice: 15.90,
    maxPrice: 15.90,
    description: "Combina as tags clássicas com o nome do aniversariante em relevo de camadas destacadas.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjYMqC9SJrw06ZLacechZlMWaXh6jvaRBHfSPChqh715AJdb9Q9yn7Azw&s=10",
    badge: "Recomendado",
    features: ["Nome em destaque 3D", "Sobreposição elegante", "Aproximadamente 6 peças decorativas"]
  },
  {
    id: "topo-bolo-dupla-camada",
    name: "Topo de Bolo Dupla Camada",
    category: "Topos de Bolo",
    minPrice: 22.90,
    maxPrice: 22.90,
    description: "O topo definitivo de luxo com todas as tags montadas em dupla camada de papéis coloridos especiais.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGNaeJcooQwA6VPnfakKehv9ink0s_Xy0t8yfAUs7-XZ0PKsUMB5fVe-8S&s=10",
    badge: "Premium 3D",
    features: ["Efeito real 3D no bolo", "Papéis especiais metalizados/texturas", "Várias camadas coladas à mão"]
  },

  // 🧁 KITS DE FORMINHAS
  {
    id: "forminhas-custom",
    name: "Forminhas Personalizadas",
    category: "Forminhas",
    minPrice: 6.90,
    maxPrice: 44.90,
    description: "Kits de forminhas personalizadas para doces. Escolha a quantidade (20, 30, 50 ou 100 unidades) e o modelo (Simples ou Premium) desejados.",
    image: "https://cdn.awsli.com.br/2500x2500/71/71166/produto/30506403/877af77799.jpg",
    badge: "Configurável",
    features: ["Várias quantidades (20, 30, 50, 100)", "Linhas Simples e Premium 3D", "Papelaria afetiva fotográfica premium", "Pedido mínimo de 20 forminhas"]
  },

  // 🍡 TOPPERS PARA DOCINHOS
  {
    id: "toppers-custom",
    name: "Toppers para Docinhos",
    category: "Toppers",
    minPrice: 7.90,
    maxPrice: 54.90,
    description: "Mini toppers de alta resolução fixados em palito de acrílico higiênico. Escolha a quantidade (20, 30, 50 ou 100 unidades) e o modelo (Simples ou Dupla Camada).",
    image: "https://ciadafesta.cdn.magazord.com.br/img/2024/06/produto/8953/topper.png?ims=600x600",
    badge: "Configurável",
    features: ["Várias quantidades (20, 30, 50, 100)", "Opções Simples e Dupla Camada 3D", "Hastes acrílicas de alta qualidade", "Pedido mínimo de 20 toppers"]
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
