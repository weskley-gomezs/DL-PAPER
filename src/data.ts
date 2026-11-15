import { Product, ThemeItem, Differential, Testimonial } from "./types";

// Bespoke generated images
export const IMAGES = {
  hero: "/src/assets/images/dl_magic_paper_hero_1791899151681.jpg",
  about: "/src/assets/images/creative_studio_1779734454290.png",
  partyFavors: "/src/assets/images/party_favors_1779734471509.png",
  logo: "https://i.imgur.com/LiPwTKg.png"
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
  {
    id: "caixa-milk",
    name: "Caixa Milk",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "A queridinha das festas no formato Milk clássico. Design elegante, recortado com precisão em papel de alta gramatura de 180g. Pode ser encomendada com ou sem laço de cetim luxuoso.",
    image: "/src/assets/images/caixa_milk_laco_1794613744008.jpg",
    badge: "Mais Pedida",
    features: ["Papel offset premium de 180g", "Corte eletrônico perfeito", "Laço de cetim luxuoso opcional", "Fácil de montar"],
    segment: "pessoal"
  },
  {
    id: "caixa-bala",
    name: "Caixa Bala",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Lindo formato que remete a uma bala gigante com fechamento charmoso em papel de alta gramatura. Opção com ou sem laço de cetim.",
    image: "/src/assets/images/caixa_piramide_sushi_1794613744791.jpg",
    badge: "Destaque da Mesa",
    features: ["Formato bala divertido", "Fechamento simétrico elegante", "Laço de cetim lateral opcional", "Impecável no tema escolhido"],
    segment: "pessoal"
  },
  {
    id: "caixa-piramide",
    name: "Caixa Pirâmide",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Caixa em formato triangular de cone que confere altura e elegância imediata à mesa do bolo. Escolha com ou sem laço de cetim de alta qualidade no topo.",
    image: "/src/assets/images/caixa_piramide_sushi_1794613744791.jpg",
    badge: "Sofisticada",
    features: ["Formato cone tridimensional", "Nome e tema em destaque", "Laço de cetim no topo opcional", "Acabamento profissional"],
    segment: "pessoal"
  },
  {
    id: "caixa-sushi",
    name: "Caixa Sushi",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Formato trapézio charmoso com encaixes perfeitos de segurança. Pode ser decorada com um elegante laço de cetim ou na versão simples e limpa.",
    image: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
    badge: "Clássica",
    features: ["Base trapézio firme", "Encaixe inteligente de fundo", "Fita de cetim decorativa opcional", "Fácil preenchimento de doces"],
    segment: "pessoal"
  },
  {
    id: "caixa-mala",
    name: "Caixa Mala",
    category: "Caixas Avulsas",
    minPrice: 1.40,
    maxPrice: 1.72,
    description: "Maletinha lúdica com alça integrada. Perfeita para encantar os convidados como lembrancinha de doces. Opções com laço colado na alça ou sem.",
    image: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
    badge: "Lúdica",
    features: ["Alça de papel estruturado", "Belo espaço para guloseimas", "Laço de cetim premium opcional", "Recorte eletrônico de alta definição"],
    segment: "pessoal"
  },

  // 🎁 KITS FESTAS CLÁSSICO
  {
    id: "kit-caixas-custom",
    name: "Kit Festas Clássico (Misto)",
    category: "Kits de Caixas",
    minPrice: 22.90,
    maxPrice: 76.90,
    description: "Kits sob medida contendo as 5 caixas clássicas (Milk, Bala, Pirâmide, Sushi e Mala). Escolha a quantidade de caixas desejada e veja a repartição ideal entre caixas com e sem laço.",
    image: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
    badge: "Configurável",
    features: ["Cinco modelos clássicos inclusos", "Escolha de 15 a 50 caixas", "Proporção balanceada de laços", "Design impecável com e sem laço"],
    segment: "pessoal"
  },

  // 🏢 PRODUTOS CORPORATIVOS E BRINDES INSTITUCIONAIS
  {
    id: "brinde-kit-onboarding",
    name: "Kit Mimos & Boas-Vindas Corporativo",
    category: "Kits de Caixas",
    minPrice: 18.90,
    maxPrice: 28.50,
    description: "Kit premium para eventos corporativos, onboarding de novos colaboradores e brindes de fim de ano. Contém caixa personalizada com a identidade da empresa, adesivos e sacolinha com fita de cetim.",
    image: "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
    badge: "Corporativo VIP",
    features: ["Identidade visual da sua empresa", "Embalagem com logo e acabamento nobre", "Excelente para acolher equipe e clientes", "Pedido sob medida"],
    segment: "corporativo"
  },
  {
    id: "brinde-caixa-mimo-empresa",
    name: "Caixa Corporativa com Logo da Empresa",
    category: "Caixas Avulsas",
    minPrice: 5.50,
    maxPrice: 7.90,
    description: "Caixa nobre de papelaria estruturada com aplicação do logotipo e paleta institucional. Ideal para presentear clientes e parceiros em congressos, datas comemorativas e workshops.",
    image: "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
    badge: "Brinde Corporativo",
    features: ["Cores institucionais e logo da empresa", "Acabamento nobre de luxo", "Ideal para bombons, brindes ou mimos", "Apresentação de alto impacto"],
    segment: "corporativo"
  },
  {
    id: "brinde-tubolata-corporativa",
    name: "Tubolata Corporativa com Logotipo",
    category: "Lembrancinhas",
    minPrice: 4.50,
    maxPrice: 6.90,
    description: "Tubolata de papelão rígido com tampa metálica dourada/prata e rótulo personalizado com a identidade da empresa. Perfeita para biscoitos finos, doces ou pequenos brindes B2B.",
    image: "/src/assets/images/dl_magic_paper_hero_1791899151681.jpg",
    badge: "Mais Pedido B2B",
    features: ["Rótulo com logotipo em alta resolução", "Tampa metálica dourada, prata ou branca", "Laço de cetim opcional na cor da empresa", "Pedido mínimo de 10 unidades"],
    segment: "corporativo"
  },
  {
    id: "brinde-sacola-corporativa",
    name: "Sacola Institucional com Fita de Cetim e Tag",
    category: "Lembrancinhas",
    minPrice: 5.20,
    maxPrice: 6.80,
    description: "Sacola de papel de alta gramatura personalizada com o logotipo da sua marca e alças luxuosas em fita de cetim. A apresentação ideal para presentear clientes e parceiros.",
    image: "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
    badge: "Luxo Institucional",
    features: ["Papel resistente de alta gramatura", "Alças em fita de cetim personalizada", "Tag de agradecimento com sua mensagem", "Design sofisticado"],
    segment: "corporativo"
  },
  {
    id: "brinde-caixa-doces-corporativa",
    name: "Caixa Corporativa para Doces Gourmet",
    category: "Lembrancinhas",
    minPrice: 3.90,
    maxPrice: 5.50,
    description: "Caixa fina com berço para 4 a 6 brigadeiros gourmet, personalizada com as cores da empresa e logotipo no visor. Um mimo carinhoso e inesquecível.",
    image: "/src/assets/images/caixas_doces_mimos_1794613748044.jpg",
    badge: "Mimo Executivo",
    features: ["Divisórias para doces finos", "Aplicação do logotipo na tampa", "Ideal para workshops e datas comemorativas"],
    segment: "corporativo"
  },

  // 🍭 LEMBRANCINHAS & BRINDES
  {
    id: "lembrancinha-adesivo",
    name: "Adesivo Personalizado com Logo / Tema",
    category: "Lembrancinhas",
    minPrice: 0.80,
    maxPrice: 0.80,
    description: "Adesivos fotográficos de alta aderência com contorno eletrônico personalizado. Perfeitos para rotular embalagens de festas ou produtos e brindes corporativos.",
    image: "/src/assets/images/hero_stationery_1779734437655.png",
    badge: "Mín. 10 unid.",
    features: ["Brilho fotográfico vivo", "Cortado sob medida", "Design coordenado com o tema ou logo", "Ideal para tubetes, latas e sacolas"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-tubete",
    name: "Tubete Personalizado",
    category: "Lembrancinhas",
    minPrice: 1.40,
    maxPrice: 1.40,
    description: "Frasco cilíndrico acrílico transparente com tampa colorida e lindo aplique em destaque.",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    badge: "Mín. 10 unid.",
    features: ["Acrílico rígido transparente", "Aplique recortado em papel nobre", "Tampa rosqueável firme", "Excelente para confeitos"],
    segment: "pessoal"
  },
  {
    id: "lembrancinha-tubolata-5x6",
    name: "Tubolata Personalizada (5X6cm)",
    category: "Lembrancinhas",
    minPrice: 3.20,
    maxPrice: 3.90,
    description: "Cilindro de papelão micro-ondulado premium tamanho 5x6 com tampa metálica luxuosa e embalagem adesivada. Uma das lembrancinhas mais versáteis tanto para festas quanto para mimos corporativos com logotipo.",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    badge: "Refinada",
    features: ["Formato vintage refinado", "Papelão ultra estruturado", "Laço de cetim premium opcional", "Excelente lembrança durável", "Pedido mínimo de 10 unidades"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-latinha",
    name: "Latinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Latinha acrílica ou metálica com adesivo de alto brilho no topo. Uma lembrancinha tradicional para festas ou feiras e eventos corporativos.",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    badge: "Mín. 10 unid.",
    features: ["Compacto e fácil de carregar", "Personalização inteiramente brilhosa", "Perfeito para pastilhas ou guloseimas"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-cofrinho",
    name: "Cofrinho Personalizado",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Cofrinho rígido encapado com rótulo fotográfico alto-brilho e tampas removíveis coloridas. Muito pedido para temas de festas e campanhas corporativas de metas/SIPAT.",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    badge: "Mín. 10 unid.",
    features: ["Papel fotográfico brilhante", "Lembrança útil e ecológica", "Tampas coloridas de acordo com a paleta"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-sacolinha",
    name: "Sacolinha Personalizada com Fita de Cetim",
    category: "Lembrancinhas",
    minPrice: 4.90,
    maxPrice: 4.90,
    description: "Sacola de papel com reforço lateral e lindas abas com cordões em fita de cetim. A embalagem final perfeita para festas ou presentes corporativos.",
    image: "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
    badge: "Mín. 10 unid.",
    features: ["Fita de cetim luxuosa", "Papel reforçado durável", "Tema ou logotipo impresso com nitidez"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-marmitinha",
    name: "Marmitinha Personalizada",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Marmitinha clássica com tampa fotográfica personalizada no tema e paleta escolhidos. Um sucesso tradicional de festas.",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    badge: "Mín. 10 unid.",
    features: ["Estrutura resistente", "Tampa impermeável brilhosa", "Ideal para fatias de bolo e docinhos"],
    segment: "pessoal"
  },
  {
    id: "lembrancinha-porta-bis",
    name: "Porta Chocolate Duplo",
    category: "Lembrancinhas",
    minPrice: 1.80,
    maxPrice: 1.80,
    description: "Embalagem suporte charmosa projetada sob medida para abrigar dois chocolates individuais com aplique especial. Excelente para festas ou pequenos mimos para colaboradores.",
    image: "/src/assets/images/caixas_doces_mimos_1794613748044.jpg",
    badge: "Mín. 10 unid.",
    features: ["Serve 2 chocolates individuais", "Elemento em relevo saliente", "Enche a mesa com pequenos charmes"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-porta-kitkat",
    name: "Porta Barra de Chocolate",
    category: "Lembrancinhas",
    minPrice: 2.20,
    maxPrice: 2.20,
    description: "Embalagem estrutural premium para vestir barras de chocolate, com detalhes em relevo no tema da festa ou mensagem motivacional da empresa.",
    image: "/src/assets/images/caixas_doces_mimos_1794613748044.jpg",
    badge: "Mín. 10 unid.",
    features: ["Encaixe sob medida perfeito", "Excelente acabamento protetivo", "Brilho e sofisticação no papel"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-caixa-4-doces",
    name: "Caixa 4 Doces / Brigadeiros Gourmet",
    category: "Lembrancinhas",
    minPrice: 2.80,
    maxPrice: 2.80,
    description: "Caixinha fina com divisórias internas para abrigar perfeitamente 4 doces finos ou brigadeiros. Amada em aniversários e para mimos executivos.",
    image: "/src/assets/images/caixas_doces_mimos_1794613748044.jpg",
    badge: "Mín. 10 unid.",
    features: ["4 divisórias internas", "Excelente para brigadeiro gourmet", "Visual carinhoso para lembrancinha ou mimo"],
    segment: "ambos"
  },
  {
    id: "lembrancinha-caixa-6-doces",
    name: "Caixa 6 Doces Finos",
    category: "Lembrancinhas",
    minPrice: 3.50,
    maxPrice: 3.50,
    description: "Caixinha refinada com visor ou tampa decorada contendo divisórias internas para 6 deliciosos brigadeiros. Muito requisitada para clientes VIP e celebrações.",
    image: "/src/assets/images/caixas_doces_mimos_1794613748044.jpg",
    badge: "Mín. 10 unid.",
    features: ["6 Berços individuais", "Papel de alta qualidade", "Corte visual delicado e firme"],
    segment: "ambos"
  },

  // 🎂 TOPO DE BOLO
  {
    id: "topo-bolo-simples",
    name: "Topo de Bolo Simples",
    category: "Topos de Bolo",
    minPrice: 12.90,
    maxPrice: 12.90,
    description: "Conjunto de tags decorativas com corte eletrônico para enfeitar o bolo com haste acrílica invisível.",
    image: "/src/assets/images/topo_bolo_camadas_1794613747094.jpg",
    badge: "Tradicional",
    features: ["Palitos invisíveis acrílicos", "Imagens nítidas cortadas eletronicamente", "Fácil posicionamento no bolo"],
    segment: "pessoal"
  },
  {
    id: "topo-bolo-destaque",
    name: "Topo Simples com Nome em Destaque",
    category: "Topos de Bolo",
    minPrice: 15.90,
    maxPrice: 15.90,
    description: "Combina as tags clássicas com o nome do aniversariante em relevo de camadas destacadas.",
    image: "/src/assets/images/topo_bolo_camadas_1794613747094.jpg",
    badge: "Recomendado",
    features: ["Nome em destaque", "Sobreposição elegante", "Aproximadamente 6 peças decorativas"],
    segment: "pessoal"
  },
  {
    id: "topo-bolo-dupla-camada",
    name: "Topo de Bolo Dupla Camada",
    category: "Topos de Bolo",
    minPrice: 22.90,
    maxPrice: 22.90,
    description: "O topo definitivo de luxo com todas as tags montadas em dupla camada de papéis coloridos especiais.",
    image: "/src/assets/images/topo_bolo_camadas_1794613747094.jpg",
    badge: "Premium Especial",
    features: ["Efeito nobre no bolo", "Papéis especiais metalizados/texturas", "Várias camadas coladas à mão"],
    segment: "pessoal"
  },

  // 🧁 KITS DE FORMINHAS
  {
    id: "forminhas-custom",
    name: "Forminhas Personalizadas",
    category: "Forminhas",
    minPrice: 6.90,
    maxPrice: 44.90,
    description: "Kits de forminhas personalizadas para doces. Escolha a quantidade (20, 30, 50 ou 100 unidades) e o modelo (Simples ou Premium) desejados.",
    image: "/src/assets/images/forminhas_toppers_doces_1794613748286.jpg",
    badge: "Configurável",
    features: ["Várias quantidades (20, 30, 50, 100)", "Linhas Simples e Premium", "Papelaria afetiva fotográfica premium", "Pedido mínimo de 20 forminhas"],
    segment: "pessoal"
  },

  // 🍡 TOPPERS PARA DOCINHOS
  {
    id: "toppers-custom",
    name: "Toppers para Docinhos",
    category: "Toppers",
    minPrice: 7.90,
    maxPrice: 54.90,
    description: "Mini toppers de alta resolução fixados em palito de acrílico higiênico. Escolha a quantidade (20, 30, 50 ou 100 unidades) e o modelo (Simples ou Dupla Camada).",
    image: "/src/assets/images/forminhas_toppers_doces_1794613748286.jpg",
    badge: "Configurável",
    features: ["Várias quantidades (20, 30, 50, 100)", "Opções Simples e Dupla Camada", "Hastes acrílicas de alta qualidade", "Pedido mínimo de 20 toppers"],
    segment: "pessoal"
  }
];

export const THEMES: ThemeItem[] = [
  {
    id: "jardim-encantado",
    name: "Jardim Encantado & Borboletas",
    image: "/src/assets/images/topo_bolo_camadas_1794613747094.jpg",
    colors: ["#E8527A", "#FFF6F0", "#FFC947"],
    vibe: "DELICADO, FLORAL E ATEMPORAL"
  },
  {
    id: "rosa-dourado-classico",
    name: "Rosa Pastel & Dourado",
    image: "/src/assets/images/caixa_milk_laco_1794613744008.jpg",
    colors: ["#F4C2C2", "#D4AF37", "#FFFFFF"],
    vibe: "SOFISTICADO, CLEAN E ELEGANTE"
  },
  {
    id: "botanico-chic",
    name: "Botânico & Folhagens",
    image: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
    colors: ["#A3E4D7", "#F4C2C2", "#FAF8F5"],
    vibe: "ORGÂNICO, SUAVE E ACOLHEDOR"
  },
  {
    id: "geometrico-lilas",
    name: "Lavanda & Geometria",
    image: "/src/assets/images/caixa_piramide_sushi_1794613744791.jpg",
    colors: ["#D3C2FF", "#F5E1FD", "#D4AF37"],
    vibe: "MODERNO, ARTESANAL E EXCLUSIVO"
  },
  {
    id: "corporativo-executivo",
    name: "Corporativo Ameixa & Ouro",
    image: "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
    colors: ["#3A2439", "#E8527A", "#FFC947"],
    vibe: "INSTITUCIONAL, PREMIUM E MARCANTE"
  },
  {
    id: "aquarela-festa",
    name: "Aquarela & Menta Festivo",
    image: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
    colors: ["#A3E4D7", "#FFD1DC", "#FFF6F0"],
    vibe: "ALEGRE, LÚDICO E HARMONIOSO"
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
