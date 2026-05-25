import { Product, ThemeItem, Differential, Testimonial } from "./types";

// Bespoke generated images
export const IMAGES = {
  hero: "/src/assets/images/hero_stationery_1779734437655.png",
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
  "Topos de Bolo",
  "Caixas Personalizadas",
  "Tubolatas",
  "Adesivos",
  "Kits Festa"
];

export const PRODUCTS: Product[] = [
  // Topos de Bolo
  {
    id: "topo-simples",
    name: "Topo de Bolo Simples",
    category: "Topos de Bolo",
    minPrice: 18,
    maxPrice: 25,
    description: "Ideal para comemorações intimistas. Produzido em papel de alta gramatura (180g) e corte preciso para dar charme especial ao seu bolo.",
    image: "https://cdn.awsli.com.br/2500x2500/409/409878/produto/240005991/20230929_162453-2-me2ds5c66a.jpg",
    badge: "Delicado",
    features: ["Camada simples", "Palitos transparentes de acrílico", "Corte eletrônico perfeito", "Até 3 elements personalizados"]
  },
  {
    id: "topo-dupla",
    name: "Topo de Bolo Dupla Camada",
    category: "Topos de Bolo",
    minPrice: 30,
    maxPrice: 45,
    description: "Efeito 3D espetacular com sobreposição de papéis especiais (lamecote, glitter ou colorplus). Dá profundidade, brilho e luxo ao bolo principal.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzIXm9ZQLVL9goJQVBAhkHCDOm2kBQS1Aeeg&s",
    badge: "Mais Vendido",
    features: ["Efeito 3D em camadas", "Detalhes em papel dourado ou prata", "Até 6 elementos temáticos", "Personalização com nome e idade"]
  },
  
  // Caixas Personalizadas
  {
    id: "caixa-milk",
    name: "Caixa Milk Especial",
    category: "Caixas Personalizadas",
    minPrice: 7,
    maxPrice: 10,
    description: "A clássica caixinha de festa em sua versão premium. Decorada com laço de cetim volumoso, strass e apliques 3D.",
    image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lsudotjf99no1c",
    badge: "Indispensável",
    features: ["Laço magnífico de cetim", "Aplique em camadas 3D", "Fundo de fácil montagem", "Impressão em alta definição"]
  },
  {
    id: "caixa-piramide",
    name: "Caixa Pirâmide (Cone)",
    category: "Caixas Personalizadas",
    minPrice: 7,
    maxPrice: 9,
    description: "Perfeita para compor as laterais da mesa, imitando pequenas árvores ou torres temáticas. Visual marcante estruturado.",
    image: "https://images.tcdn.com.br/img/img_prod/504105/caixa_cone_piramide_14_1_20170225064654.jpg",
    features: ["Formato cônico elegante", "Aplique temático frontal 3D", "Feita em papel fotográfico fosco", "Cores vibrantes e fiéis"]
  },
  {
    id: "caixa-sushi",
    name: "Caixa Sushi Chic",
    category: "Caixas Personalizadas",
    minPrice: 8,
    maxPrice: 12,
    description: "Com design oriental contemporâneo e fechamento charmoso. Ideal para doces finos, trufas ou pequenos mimos artesanais.",
    image: "https://cdn.awsli.com.br/1802/1802445/produto/88528417/67274205c6.jpg",
    features: ["Fecho diferenciado em cima", "Berço para aplique superior", "Detalhe em papel perolado", "Vincos perfeitos por compressão"]
  },
  {
    id: "caixa-canudo",
    name: "Caixa Canudo Elegante",
    category: "Caixas Personalizadas",
    minPrice: 8,
    maxPrice: 11,
    description: "Uma embalagem estilosa que acompanha um canudo decorativo de papel e um lindo pingente ou aplique temático preso a ele.",
    image: "https://nilmaraquintela.com.br/wp-content/uploads/2019/12/kit-canudo.jpg",
    badge: "Moderna",
    features: ["Canudo decorativo de papel", "Pingente com franja ou fita", "Estrutura firme e compacta", "Estampa contínua 360 graus"]
  },

  // Tubolatas
  {
    id: "tubolata-3d",
    name: "Tubolata 3D Decorada",
    category: "Tubolatas",
    minPrice: 10,
    maxPrice: 15,
    description: "Lembrança luxuosa e durável. Cofrinho ou porta-guloseimas rígido revestido com papel personalizado e apliques volumosos na tampa.",
    image: "https://acdn-us.mitiendanube.com/stores/764/570/products/00000-4-9c38edd129977bc24817500814629931-1024-1024.webp",
    badge: "Destaque",
    features: ["Corpo de papelão rígido", "Tampa dourada, branca ou colorida", "Aplique em relevo 3D de destaque", "Laço Chanel ou fita cetim inclusa"]
  },

  // Adesivos
  {
    id: "adesivos-escolares",
    name: "Kit Adesivos Escolares",
    category: "Adesivos",
    minPrice: 18,
    maxPrice: 35,
    description: "Cartelas de adesivos à prova d'água de diversos tamanhos para identificar cadernos, lápis, estojos e garrafinhas com o tema preferido.",
    image: "https://cf.shopee.com.br/file/c01f3162d9643719ea2cc0515207aa70",
    badge: "Prático",
    features: ["Material vinil impermeável", "Não desbota nem rasga na lavagem", "Vários formatos inclusos", "Letras altamente legíveis"]
  },
  {
    id: "adesivos-lembrancinhas",
    name: "Adesivos para Lembrancinhas",
    category: "Adesivos",
    minPrice: 12,
    maxPrice: 25,
    description: "Rótulos redondos ou quadrados ideais para personalizar potinhos, sacolinhas, tubetes e mini refrigerantes da sua própria festa.",
    image: "https://images.tcdn.com.br/img/img_prod/504105/adesivos_6x6_cm_363_1_c15ff3005135b7a4563541bf40b4f634.jpg",
    features: ["Meio-corte redondo ou quadrado", "Material fotográfico brilhante", "Adesivo de alta aderência", "Personalização de data e nome"]
  },

  // Kits Festa
  {
    id: "kit-festa-classico",
    name: "Kit Festa Clássico",
    category: "Kits Festa",
    minPrice: 120,
    maxPrice: 180,
    description: "Perfeito para quem quer uma comemoração encantadora e compacta. Reúne topo de bolo dupla camada e uma linda seleção das nossas caixas mais famosas.",
    image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m1bfwf33378gb3",
    badge: "Super Recomendado",
    features: ["1 Topo de Bolo Dupla Camada", "5 Caixas Milk", "5 Caixas Pirâmide", "5 Caixas Sushi", "Bandeirolas com nome (até 8 letras)"]
  },
  {
    id: "kit-luxo",
    name: "Kit Luxo Ateliê",
    category: "Kits Festa",
    minPrice: 220,
    maxPrice: 380,
    description: "A experiência máxima de encantamento e sofisticação gastronômica e estética para sua mesa. Itens repletos de gitter, acrílico espelhado e texturas ricas.",
    image: IMAGES.partyFavors,
    badge: "Premium Ostentação",
    features: ["1 Topo de Bolo Luxo Espelhado", "8 Caixas Milk Premium com Laço Isométrico", "8 Caixas Canudo Luxury", "8 Tubolatas 3D com texturas laminadas", "10 Forminhas personalizadas", "Atendimento VIP com simulação temática"]
  }
];

export const THEMES: ThemeItem[] = [
  {
    id: "stitch-rosa",
    name: "Stitch Rosa",
    image: "https://p19-common-sign.tiktokcdn-us.com/tos-maliva-p-0068/o4AkfPF2GgIWIZ21AFLASojh5EefPACQIwghID~tplv-tiktokx-origin.image?dr=9636&x-expires=1779836400&x-signature=ZVJXQ4n3ELPvvhTUI1S6uUxggb0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=55bbe6a9&idc=useast5",
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
