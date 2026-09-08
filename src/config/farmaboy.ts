/**
 * CONFIGURACIÓN CENTRAL DE FARMABOY
 * 
 * Farmacia / Droguería Moderna de Boyacá, Colombia.
 * Fuente única de verdad para productos, categorías comerciales, 
 * datos de contacto y servicios complementarios.
 */

export interface PharmacyCategoryItem {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  description: string;
  slug: string;
  badge?: string;
  bgGradient: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  shortInfo: string;
  badge?: string;
  price: number; // Precio en COP para carrito y Wompi
  priceDisplay: string;
  imageUrl: string;
  inStock: boolean;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  currentStock?: number;
  requiresPrescription?: boolean;
}

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  badgeColor: string;
  linkHref: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  slug: string;
  ctaText: string;
  audience: 'particulares' | 'empresas' | 'ambos';
  icon: string;
  highlights: string[];
  featured?: boolean;
}

export const farmaboyConfig = {
  name: "FARMABOY",
  storeType: "Droguería & Farmacia Moderna",
  legalName: "FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.",
  nit: "902.054.200-0",
  matriculaMercantil: "0000124781",
  representanteLegal: "Registrada ante Cámara de Comercio",
  seccionalDian: "Sogamoso, Boyacá",
  tagline: "Tu farmacia y aliado integral de salud en Boyacá",
  subtagline: "Comercialización y distribución de insumos médicos hospitalarios, productos farmacéuticos y servicios de salud para familias e instituciones.",
  department: "Boyacá",
  country: "Colombia",
  
  // Canales de contacto directo oficiales
  contact: {
    phone: "+57 313 427 9559",
    phoneClean: "573134279559",
    phoneDisplay: "+57 313 427 9559 / 321 265 1303",
    secondaryPhone: "+57 321 265 1303",
    secondaryPhoneClean: "573212651303",
    secondaryPhoneDisplay: "+57 321 265 1303",
    whatsapp: "+57 313 427 9559",
    whatsappClean: "573134279559",
    whatsappDisplay: "+57 313 427 9559",
    whatsappSecondary: "+57 321 265 1303",
    whatsappSecondaryClean: "573212651303",
    whatsappSecondaryDisplay: "+57 321 265 1303",
    emailGeneral: "info@farmaboy.com",
    emailB2B: "info@farmaboy.com",
    address: "Transversal 29 # 10-63, Duitama, Boyacá, Colombia",
    addressShort: "Transversal 29 # 10-63, Duitama",
    city: "Duitama, Boyacá",
    operatingHours: "Lunes a Sábado: 7:00 a.m. – 8:30 p.m. | Domingos y Festivos: 8:00 a.m. – 5:00 p.m.",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.218556635817!2d-73.0360!3d5.8268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a39281!2sDuitama%2C%20Boyac%C3%A1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco",
  },

  // Misión y Visión Oficiales de FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
  mision: "Suministrar soluciones integrales de alta calidad a través de la comercialización y distribución de insumos médicos hospitalarios, productos farmacéuticos y servicios de salud, satisfaciendo de manera oportuna, eficiente y segura las necesidades de nuestros clientes y usuarios, contribuyendo al bienestar y mejoramiento de la calidad de vida de la comunidad, respaldados por un equipo humano calificado, ético y comprometido.",
  vision: "Ser reconocidos a nivel departamental y nacional como una empresa líder en la comercialización y distribución de insumos médicos hospitalarios, productos farmacéuticos y servicios integrales de salud, distinguiéndonos por nuestra excelencia operativa, innovación constante, compromiso social y calidad humana, consolidándonos como el aliado estratégico preferido por el sector salud.",

  // Portafolio Oficial de Servicios
  serviciosOficiales: [
    "Venta y distribución de insumos médicos y hospitalarios",
    "Comercialización de productos farmacéuticos y material médico-quirúrgico",
    "Suministro de equipos y dispositivos médicos para el cuidado de la salud",
    "Distribución de productos de bioseguridad, curación y protección personal",
    "Atención y suministro para clínicas, hospitales, consultorios y particulares",
    "Asesoría personalizada en la adquisición de productos de salud",
    "Gestión eficiente de pedidos y cotizaciones ágiles",
    "Garantía de calidad, oportunidad y cumplimiento en cada entrega",
    "Abastecimiento integral para el sector salud con cobertura departamental",
  ],

  // Información Tributaria y Legal DIAN (RUT Oficial Formulario 001)
  rutFiscal: {
    razonSocial: "FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.",
    nit: "902.054.200-0",
    dv: "0",
    tipoOrganizacion: "Sociedad por Acciones Simplificada (S.A.S.)",
    matriculaMercantil: "0000124781",
    representanteLegal: "Registrada ante Cámara de Comercio",
    cedulaRepresentante: "",
    direccionPrincipal: "Transversal 29 # 10-63 (TV 29 10 63)",
    ciudad: "Duitama",
    departamento: "Boyacá",
    codigoMunicipioDian: "15238",
    correoElectronico: "info@farmaboy.com",
    telefonoContacto: "+57 313 427 9559 / 321 265 1303",
    seccionalDian: "Sogamoso (Boyacá)",
    actividadesCIIU: [
      {
        codigo: "4645",
        tipo: "Actividad Principal",
        descripcion: "Comercio al por mayor de productos farmacéuticos, medicinales, cosméticos y de tocador",
      },
      {
        codigo: "4773",
        tipo: "Actividad Secundaria",
        descripcion: "Comercio al por menor de productos farmacéuticos y medicinales, cosméticos y artículos de tocador en establecimientos especializados",
      },
      {
        codigo: "4923",
        tipo: "Otras Actividades",
        descripcion: "Transporte de carga por carretera",
      },
      {
        codigo: "8699",
        tipo: "Otras Actividades",
        descripcion: "Otras actividades de atención de la salud humana",
      },
    ],
    responsabilidadesTributarias: [
      { codigo: "05", nombre: "Impuesto sobre la renta y complementarios régimen ordinario" },
      { codigo: "07", nombre: "Retención en la fuente a título de renta" },
      { codigo: "48", nombre: "Impuesto sobre las ventas - IVA" },
      { codigo: "55", nombre: "Informante de Beneficiarios Finales" },
    ],
  },

  // Municipios de cobertura en Boyacá
  coverageAreas: [
    "Tunja",
    "Duitama",
    "Sogamoso",
    "Chiquinquirá",
    "Paipa",
    "Moniquirá",
    "Cómbita",
    "Samacá",
    "Nobsa",
    "Ventaquemada"
  ],

  // Mensajes predeterminados para WhatsApp
  whatsappMessages: {
    general: "Hola Farmaboy, deseo consultar la disponibilidad de un producto en su farmacia de Boyacá.",
    pedido: "Hola Farmaboy, quiero hacer un pedido de farmacia para entrega o retiro en Boyacá.",
    formula: "Hola Farmaboy, adjunto la fotografía de mi fórmula médica para consultar disponibilidad y cotización.",
    medicamentos: "Hola Farmaboy, necesito orientación sobre la disponibilidad de un medicamento específico.",
    cotizacionB2B: "Hola Farmaboy, represento a una empresa/institución y requiero cotización formal de suministros médicos.",
    transporte: "Hola Farmaboy, deseo solicitar información sobre el servicio de transporte asistencial.",
    tension: "Hola Farmaboy, deseo consultar horarios y disponibilidad para toma de tensión arterial.",
    particulares: "Hola Farmaboy, necesito atención particular para adquisición de productos de farmacia.",
  },

  // 8 Categorías de Farmacia Comerciales
  pharmacyCategories: [
    {
      id: "medicamentos",
      name: "Medicamentos",
      emoji: "💊",
      iconName: "Pill",
      description: "Éticos, genéricos, de venta libre y tratamientos continuos.",
      slug: "/categoria/medicamentos",
      badge: "Esencial",
      bgGradient: "from-emerald-50 to-teal-50 border-emerald-200",
    },
    {
      id: "primeros-auxilios",
      name: "Primeros auxilios",
      emoji: "🩹",
      iconName: "Bandage",
      description: "Gasas, vendas, alcohol antiséptico, curas y botiquines.",
      slug: "/categoria/higiene",
      badge: "Botiquín",
      bgGradient: "from-amber-50 to-orange-50 border-amber-200",
    },
    {
      id: "cuidado-personal",
      name: "Cuidado personal",
      emoji: "🧴",
      iconName: "Sparkles",
      description: "Cremas hidratantes, protección solar, cuidado de la piel y dermocosmética.",
      slug: "/categoria/cuidado-personal",
      badge: "Bienestar",
      bgGradient: "from-sky-50 to-cyan-50 border-sky-200",
    },
    {
      id: "higiene",
      name: "Higiene",
      emoji: "🧼",
      iconName: "Bath",
      description: "Jabones antibacteriales, geles desinfectantes y cuidado corporal.",
      slug: "/categoria/higiene",
      badge: "Diario",
      bgGradient: "from-blue-50 to-indigo-50 border-blue-200",
    },
    {
      id: "mama-y-bebe",
      name: "Mamá y bebé",
      emoji: "👶",
      iconName: "Baby",
      description: "Pañales, toallitas húmedas, fórmulas infantiles y cuidado materno.",
      slug: "/categoria/bebes",
      badge: "Familia",
      bgGradient: "from-pink-50 to-rose-50 border-pink-200",
    },
    {
      id: "cuidado-oral",
      name: "Cuidado oral",
      emoji: "🦷",
      iconName: "Smile",
      description: "Cepillos, cremas dentales especializadas, sedas y enjuagues bucales.",
      slug: "/categoria/higiene",
      badge: "Salud Oral",
      bgGradient: "from-purple-50 to-violet-50 border-purple-200",
    },
    {
      id: "bienestar",
      name: "Bienestar",
      emoji: "❤️",
      iconName: "HeartPulse",
      description: "Vitaminas, suplementos alimenticios, electrolitos y defensas.",
      slug: "/categoria/vitaminas-y-suplementos",
      badge: "Vitalidad",
      bgGradient: "from-red-50 to-emerald-50 border-red-200",
    },
    {
      id: "insumos-hospitalarios",
      name: "Insumos hospitalarios",
      emoji: "🏥",
      iconName: "PackageCheck",
      description: "Material descartable, suturas, jeringas y suministros para clínicas e IPS.",
      slug: "/insumos-hospitalarios",
      badge: "Institucional",
      bgGradient: "from-slate-50 to-teal-50 border-slate-200",
    },
  ] as PharmacyCategoryItem[],

  // Productos Destacados con precios en COP
  featuredProducts: [
    {
      id: "prod-1",
      name: "Electrolitos Orales Suero Rehidratante 500ml",
      category: "Bienestar & Hidratación",
      categoryId: "bienestar",
      shortInfo: "Solución de rehidratación balanceada con zinc y electrolitos esenciales.",
      badge: "Más buscado",
      price: 12500,
      priceDisplay: "$12.500 COP",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-2",
      name: "Tensiómetro Digital Automático de Brazo",
      category: "Dispositivos & Monitoreo",
      categoryId: "medicamentos",
      shortInfo: "Medición rápida y precisa de presión arterial y pulso para control en el hogar.",
      badge: "Hogar & Control",
      price: 115000,
      priceDisplay: "$115.000 COP",
      imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-3",
      name: "Alcohol Antiséptico 70% 700ml",
      category: "Primeros Auxilios",
      categoryId: "primeros-auxilios",
      shortInfo: "Desinfección tópica y limpieza de superficies con grado antiséptico garantizado.",
      badge: "Indispensable",
      price: 8900,
      priceDisplay: "$8.900 COP",
      imageUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-4",
      name: "Crema Hidratante Reparadora Dermocosmética",
      category: "Cuidado Personal",
      categoryId: "cuidado-personal",
      shortInfo: "Fórmula hipoalergénica con ceramidas para piel seca o sensible.",
      badge: "Cuidado Piel",
      price: 46000,
      priceDisplay: "$46.000 COP",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-5",
      name: "Kit de Gasas Estériles y Vendas Elásticas",
      category: "Primeros Auxilios",
      categoryId: "primeros-auxilios",
      shortInfo: "Paquete esencial para curaciones menores, apósitos y protección de heridas.",
      badge: "Botiquín",
      price: 14000,
      priceDisplay: "$14.000 COP",
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-6",
      name: "Multivitamínico Familiar con Vitamina C y Zinc",
      category: "Bienestar",
      categoryId: "bienestar",
      shortInfo: "Suplemento alimenticio diario de apoyo al sistema inmunológico.",
      badge: "Defensas",
      price: 38500,
      priceDisplay: "$38.500 COP",
      imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-7",
      name: "Pañitos Húmedos Hipoalergénicos con Aloe",
      category: "Mamá y Bebé",
      categoryId: "mama-y-bebe",
      shortInfo: "Libres de alcohol y parabenos, ultra suaves para la delicada piel del bebé.",
      badge: "Cuidado Bebé",
      price: 9800,
      priceDisplay: "$9.800 COP",
      imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: "prod-8",
      name: "Enjuague Bucal Protección Total Sin Alcohol",
      category: "Cuidado Oral",
      categoryId: "cuidado-oral",
      shortInfo: "Protección antibacteriana prolongada, frescura y cuidado de encías.",
      badge: "Salud Oral",
      price: 18500,
      priceDisplay: "$18.500 COP",
      imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600&auto=format&fit=crop",
      inStock: true,
    },
  ] as ProductItem[],

  // Banners Promocionales Estilo Farmacia
  dealsBanners: [
    {
      id: "deal-1",
      tag: "BENEFICIOS DE LA SEMANA",
      title: "Cuidado de la salud familiar",
      subtitle: "Pregunta por las líneas de autocuidado, hidratación y botiquín en nuestra farmacia.",
      ctaText: "Preguntar por WhatsApp",
      badgeColor: "bg-emerald-100 text-emerald-800",
      linkHref: "https://wa.me/573100000000?text=Hola%20Farmaboy,%20deseo%20consultar%20las%20promociones%20y%20beneficios%20de%20la%20semana.",
    },
    {
      id: "deal-2",
      tag: "FÓRMULAS MÉDICAS",
      title: "¿Tienes una receta médica prescrita?",
      subtitle: "Envíanos una fotografía legible y validamos la disponibilidad y entrega de tu tratamiento.",
      ctaText: "Enviar fórmula por WhatsApp",
      badgeColor: "bg-amber-100 text-amber-900",
      linkHref: "https://wa.me/573100000000?text=Hola%20Farmaboy,%20env%C3%ADo%20mi%20f%C3%B3rmula%20m%C3%A9dica%20para%20cotizaci%C3%B3n%20y%20disponibilidad.",
    },
  ] as PromoBanner[],

  // Servicios de Farmacia Cotidiana
  pharmacyDailyServices: [
    {
      title: "Toma de tensión arterial",
      desc: "Servicio preventivo de medición rutinaria con tensiómetros calibrados.",
      icon: "Activity",
      badge: "Preventivo",
      link: "/servicios-asistenciales#toma-tension",
    },
    {
      title: "Orientación farmacéutica",
      desc: "Aclaramos dudas sobre almacenamiento, horarios y uso responsable de medicamentos.",
      icon: "Pill",
      badge: "Cercanía",
      link: "/medicamentos",
    },
    {
      title: "Despacho ágil en Boyacá",
      desc: "Canal rápido por WhatsApp para entrega coordinada o retiro en punto.",
      icon: "Truck",
      badge: "Comodidad",
      link: "/contacto",
    },
  ],

  // Mucho Más que una Farmacia (Diferenciales)
  muchMoreServices: [
    {
      id: "insumos-hospitalarios",
      title: "Insumos Hospitalarios",
      desc: "Suministro de material descartable, curación y bioseguridad para profesionales, clínicas e IPS de Boyacá.",
      slug: "/insumos-hospitalarios",
      badge: "B2B / IPS",
      cta: "Solicitar cotización",
      icon: "PackageCheck",
    },
    {
      id: "transporte-asistencial",
      title: "Transporte Asistencial",
      desc: "Traslados asistidos y seguros para pacientes a citas médicas, controles o altas hospitalarias.",
      slug: "/transporte-asistencial",
      badge: "Movilización",
      cta: "Conocer servicio",
      icon: "Ambulance",
    },
    {
      id: "servicios-asistenciales",
      title: "Servicios Asistenciales",
      desc: "Apoyo básico y cuidados primarios para acompañar el bienestar de pacientes y familias.",
      slug: "/servicios-asistenciales",
      badge: "Cuidado",
      cta: "Ver servicios",
      icon: "HeartHandshake",
    },
    {
      id: "empresas",
      title: "Soluciones para Empresas",
      desc: "Abastecimiento programado, convenios comerciales y atención institucional personalizada.",
      slug: "/empresas",
      badge: "Corporativo",
      cta: "Soy una empresa",
      icon: "Building2",
    },
  ],

  // Servicios generales estructurados para /servicios
  services: [
    {
      id: "medicamentos",
      title: "Medicamentos y Farmacia",
      shortDesc: "Venta y orientación para la adquisición responsable de medicamentos para particulares e instituciones.",
      fullDesc: "Dispensación y suministro farmacéutico con estricto control de calidad, almacenamiento y orientación profesional al paciente y familias.",
      badge: "Esencial",
      slug: "/medicamentos",
      ctaText: "Ver medicamentos",
      audience: "ambos" as const,
      icon: "Pill",
      featured: true,
      highlights: [
        "Medicamentos de formulación médica",
        "Línea de venta libre y autocuidado",
        "Orientación farmacéutica al usuario",
        "Disponibilidad para consulta ágil vía WhatsApp"
      ],
    },
    {
      id: "insumos-hospitalarios",
      title: "Insumos Hospitalarios y Médicos",
      shortDesc: "Suministro integral de insumos clínicos, material médico-quirúrgico y descartables para profesionales e IPS.",
      fullDesc: "Abastecimiento continuo y programado para clínicas, hospitales, consultorios y brigadas de salud en todo Boyacá con estándares de bioseguridad.",
      badge: "Institucional B2B",
      slug: "/insumos-hospitalarios",
      ctaText: "Solicitar cotización",
      audience: "empresas" as const,
      icon: "PackageCheck",
      featured: true,
      highlights: [
        "Material descartable y bioseguridad",
        "Suturas, gasas, apósitos y curación",
        "Dispositivos médicos de diagnóstico y control",
        "Cotizaciones formales y despachos institucionales"
      ],
    },
    {
      id: "transporte-asistencial",
      title: "Transporte Asistencial",
      shortDesc: "Servicio de traslado y transporte asistencial de pacientes con personal capacitado y protocolos de seguridad.",
      fullDesc: "Acompañamiento y movilización de pacientes que requieren traslado asistido hacia citas médicas, procedimientos, egresos hospitalarios o atención prioritaria.",
      badge: "Asistencial",
      slug: "/transporte-asistencial",
      ctaText: "Conocer servicio",
      audience: "ambos" as const,
      icon: "Ambulance",
      featured: true,
      highlights: [
        "Traslado asistido y seguro en Boyacá",
        "Personal con enfoque humano y profesional",
        "Coordinación ágil para familias e instituciones",
        "Enfoque en confort y bienestar del paciente"
      ],
    },
    {
      id: "servicios-asistenciales",
      title: "Servicios Asistenciales en Salud",
      shortDesc: "Servicios orientados a apoyar las necesidades básicas de atención primaria, apoyo y acompañamiento en salud.",
      fullDesc: "Servicios complementarios de salud básica para el bienestar de la comunidad boyacense, facilitando el acceso a cuidados primarios oportunos.",
      badge: "Apoyo en Salud",
      slug: "/servicios-asistenciales",
      ctaText: "Conocer servicios",
      audience: "particulares" as const,
      icon: "HeartHandshake",
      highlights: [
        "Acompañamiento primario en salud",
        "Orientación de cuidado en el hogar",
        "Atención respetuosa y humanizada",
        "Canal de consulta directa para pacientes"
      ],
    },
    {
      id: "toma-de-tension",
      title: "Toma de Tensión Arterial",
      shortDesc: "Medición preventiva de presión arterial realizada con equipos calibrados y pautas claras de autocuidado.",
      fullDesc: "Monitoreo preventivo de presión arterial para control rutinario de pacientes hipertensos o personas que deseen supervisar sus valores basales.",
      badge: "Prevención",
      slug: "/servicios-asistenciales#toma-tension",
      ctaText: "Más información",
      audience: "particulares" as const,
      icon: "Activity",
      highlights: [
        "Monitoreo con tensiómetros certificados",
        "Registro de lecturas para seguimiento",
        "Orientación no invasiva y responsable",
        "Recomendación oportuna de consulta médica ante anomalías"
      ],
    },
    {
      id: "soluciones-empresariales",
      title: "Soluciones para Empresas e Instituciones",
      shortDesc: "Suministro programado, convenios corporativos y atención comercial especializada para entidades de Boyacá.",
      fullDesc: "Unidad comercial enfocada en satisfacer las necesidades de volumen, continuidad de inventario y facturación institucional para el sector empresarial.",
      badge: "Corporativo B2B",
      slug: "/empresas",
      ctaText: "Soy una empresa",
      audience: "empresas" as const,
      icon: "Building2",
      highlights: [
        "Atención ejecutiva y asesor institucional asignado",
        "Abastecimiento programado de medicamentos e insumos",
        "Gestión documental, facturación y cotizaciones ágiles",
        "Cobertura y logística adaptada a Boyacá"
      ],
    },
  ],

  // Pilares de confianza cualitativos
  trustPillars: [
    {
      number: "01",
      title: "Atención personalizada",
      description: "Personal de farmacia con vocación de servicio, listo para asesorarte con cercanía y calidez.",
    },
    {
      number: "02",
      title: "Servicio cercano",
      description: "Canales de WhatsApp y llamadas directas sin intermediarios ni esperas complejas.",
    },
    {
      number: "03",
      title: "Particulares y Empresas",
      description: "Desde las necesidades diarias de tu hogar hasta el abastecimiento a escala de instituciones de Boyacá.",
    },
    {
      number: "04",
      title: "Medicamentos e insumos",
      description: "Trazabilidad, calidad garantizada y cumplimiento estricto de la normatividad farmacéutica.",
    },
  ],

  // FAQs de Farmacia
  faqs: [
    {
      question: "¿Cómo puedo comprar o pedir medicamentos por WhatsApp?",
      answer: "Es muy fácil: haz clic en nuestro botón de WhatsApp, escribe el nombre del medicamento o adjunta la foto de tu fórmula médica. Un asesor confirmará existencia, precio y coordinará tu entrega o retiro en Boyacá.",
    },
    {
      question: "¿Requieren fórmula médica para todos los medicamentos?",
      answer: "Únicamente para los medicamentos clasificados como de prescripción facultativa o control especial, de acuerdo con la normatividad del INVIMA y el Ministerio de Salud. Los productos de venta libre no requieren fórmula.",
    },
    {
      question: "¿Tienen cobertura de entrega en municipios de Boyacá?",
      answer: "Sí, coordinamos despachos para Tunja, Duitama, Sogamoso y diversos municipios del departamento. Escríbenos tu ubicación para validar los tiempos de entrega.",
    },
    {
      question: "¿Cómo solicito cotización de insumos hospitalarios para mi IPS o empresa?",
      answer: "Puedes utilizar nuestra sección de empresas en la web o escribirnos directamente al correo institucional o WhatsApp con la lista de insumos requeridos. Emitimos cotizaciones formales rápidamente.",
    },
    {
      question: "¿Ofrecen servicio de toma de tensión arterial?",
      answer: "Sí, contamos con toma de tensión arterial rutinaria y preventiva. Es un servicio no invasivo realizado con equipos calibrados para tu autocuidado.",
    },
  ],

  medicalDisclaimer: "RESPONSABILIDAD SANITARIA: La información contenida en este sitio web tiene carácter informativo y comercial farmacéutico. FARMABOY no realiza diagnósticos clínicos, no prescribe tratamientos médicos ni promueve la automedicación. Consulte siempre a un médico profesional para el diagnóstico y tratamiento de su salud.",
};
