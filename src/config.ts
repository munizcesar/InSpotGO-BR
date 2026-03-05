// ============================================
// InSpotGO BR — Configuração do Site
// ============================================

export const SITE_CONFIG = {
  // Informações Básicas
  name: 'InSpotGO BR',
  title: 'InSpotGO — Os Melhores SaaS e Softwares para o Mercado Brasileiro',
  description: 'Reviews honestos, comparativos e guias de compra de ferramentas SaaS e softwares. Ajudamos profissionais e empresas brasileiras a escolher as melhores ferramentas digitais.',
  url: 'https://inspotgo.com.br',
  ogImage: '/images/brand/og-image.png',

  // Branding
  slogan: 'Encontre o Melhor. Decida com Confiança.',
  tagline: 'Reviews e guias de SaaS e software para o mercado brasileiro',

  // Contato e Legal
  contact: {
    email: 'contato@inspotgo.com.br',
    form: '/contato',
  },

  legalEntity: 'InSpotGO BR',
  foundedYear: 2026,

  // SEO & Analytics
  analytics: {
    googleAnalyticsId: '',
    googleAdsId: '',
  },

  // Programas de Afiliados
  affiliates: {
    // SaaS com programa BR ativo
    hotmart: {
      enabled: false, // Ativar quando aprovado
    },
    hubspot: {
      enabled: false,
    },
    monday: {
      enabled: false,
    },
    hostinger: {
      enabled: false,
    },
    semrush: {
      enabled: false,
    },
    canva: {
      enabled: false,
    },
    notion: {
      enabled: false,
    },
    clickup: {
      enabled: false,
    },
  },

  // Redes Sociais
  social: {
    instagram: '',
    linkedin: '',
    youtube: '',
    twitter: '',
  },

  // Funcionalidades
  features: {
    newsletter: true,
    comments: false,
    search: true,
    darkMode: true,
  },

  // Categorias — apenas SaaS e Software
  categories: {
    saas: {
      name: 'SaaS',
      slug: 'saas',
      description: 'Plataformas de gestão de projetos, CRM, marketing e produtividade',
      icon: '☁️',
    },
    software: {
      name: 'Software',
      slug: 'software',
      description: 'Segurança, produtividade e aplicações profissionais para desktop',
      icon: '⚙️',
    },
    comparativos: {
      name: 'Comparativos',
      slug: 'comparativos',
      description: 'Comparações diretas entre ferramentas concorrentes com recomendações claras',
      icon: '⚖️',
    },
    guias: {
      name: 'Guias de Compra',
      slug: 'guias',
      description: 'Guias estruturados para ajudar você a escolher a ferramenta certa',
      icon: '📚',
    },
  },

  // Configurações de SEO
  seo: {
    twitterCard: 'summary_large_image',
    language: 'pt-BR',
    locale: 'pt_BR',
    schema: {
      type: 'WebSite',
      publisher: {
        '@type': 'Organization',
        name: 'InSpotGO BR',
        logo: '/logo.png',
      },
    },
  },
};

export function isAffiliateActive(program: keyof typeof SITE_CONFIG.affiliates): boolean {
  const affiliate = SITE_CONFIG.affiliates[program];
  return affiliate && 'enabled' in affiliate ? affiliate.enabled : false;
}
