// src/utils/translationFunction.js

import About from "../router/About.vue";
import Photogallery from "../router/Photogallery.vue";

/**
 * @param {Object} item - The video object from the API
 * @param {String} field - The base field name (e.g., 'title' or 'video_short_description')
 * @param {String} currentLang - The currently selected language from your filter
 * @returns {String} - The translated string or fallback
 */

// 1. Dictionary for hardcoded UI labels
const uiLabels = {
  English: {
    mediapage: {
      allVideos: "All videos",
      shareTitle: "Share this video",
      backToMedia: "Back to Media",
      shareDescription: "Found this article helpful or interesting? Spread the word by sharing it on your social media or email.",
      noVideos: "No videos found matching your criteria.",
      mediaTitle: "Cross-Border Business Media",
      mediaDescription: "Watch expert interviews, cross-border business insights, recruitment stories, and Denmark-Germany success cases."
    },
    general: {
      readMore: "Read more",
      searchPlaceholder: "Search by title, language...",
      filterBy: "Filter by",
      loading: "Loading...",
      language: "Language",
      type: "Type",
      topic: "Topic",
      subscribe: "Subscribe now"
    },
    nav: {
        media: "Media",
        network: "Network",
        events: "Events",
        About: "About",
        more: "More",
        becomeamember: "Become a member",
        borderregion: "Border Region",
        blog: "Blog",
        photogallery: "Photogallery",
        resources: "Resources"
    },
    footer: {
        community: "Use the community",
        aboutus: "About us",
        signup: "Sign up for newsletter",
        openinghours: "Opening hours",
        callinghours: "Calling hours",
        visitinghours: "Visiting hours",
        contact: "Contact",
    },
    homepage: {
        title: "Cross-Border Business and Recruitment Between Denmark and Germany",
    }
  },
  Danish: {
    mediapage: {
      allVideos: "Alle videoer",
      shareTitle: "Del denne video",
      backToMedia: "Tilbage til medier",
      shareDescription: "Synes du, denne artikel er nyttig eller interessant? Del den på dine sociale medier eller via e-mail.",
      noVideos: "Ingen videoer fundet, der matcher dine kriterier.",
      mediaTitle: "Grænseoverskridende Erhvervsmedier",
      mediaDescription: "Se ekspertinterviews, historier om international rekruttering, virksomhedsekspansion og succesfuldt samarbejde mellem Danmark og Tyskland."
    },
    general: {
        readMore: "Læs mere",
        searchPlaceholder: "Søg efter titel, sprog...",
        filterBy: "Filtrer efter",
        loading: "Indlæser...",
        language: "Sprog",
        type: "Type",
        topic: "Emne",
        subscribe: "Tilmeld dig nu"
    },
    nav: {
        media: "Medier",
        network: "Netværk",
        events: "Events",
        About: "Om os",
        more: "Mere",
        becomeamember: "Bliv medlem",
        borderregion: "Grænseregionen",
        blog: "Blog",
        photogallery: "Fotogalleri",
        resources: "Ressourcer"
    },
    footer: {
        community: "Brug fællesskabet",
        aboutus: "Om os",
        signup: "Tilmeld dig nyhedsbrevet",
        openinghours: "Åbningstider",
        callinghours: "Ringetider",
        visitinghours: "Besøgstider",
        contact: "Kontakt",
    },
    homepage: {
        title: "Grænseoverskridende Erhverv og Rekruttering mellem Danmark og Tyskland",
    }
  },
  German: {
    mediapage: {
      allVideos: "Alle Videos",
      shareTitle: "Dieses Video teilen",
      backToMedia: "Zurück zu Medien",
      shareDescription: "Fanden Sie diesen Artikel hilfreich oder interessant? Teilen Sie ihn in Ihren sozialen Medien oder per E-Mail.",
      noVideos: "Keine Videos gefunden, die Ihren Kriterien entsprechen.",
      mediaTitle: "Grenzüberschreitende Wirtschaftsmedien",
      mediaDescription: "Entdecken Sie Experteninterviews, internationale Rekrutierungsstrategien, Unternehmenswachstum und erfolgreiche Zusammenarbeit zwischen Dänemark und Deutschland."
    },
    general: {
        readMore: "Weiterlesen",
        searchPlaceholder: "Suche nach Titel, Sprache...",
        filterBy: "Filtern nach",
        loading: "Lädt...",
        language: "Sprache",
        type: "Typ",
        topic: "Thema",
        subscribe: "Jetzt abonnieren"
    },
    nav: {
      media: "Medien",
      network: "Netzwerk",
      events: "Veranstaltungen",
      About: "Über uns",
      more: "Mehr",
      becomeamember: "Mitglied werden",
      borderregion: "Grenzregion",
      blog: "Blog",
      photogallery: "Fotogalerie",
      resources: "Ressourcen"
    },
    footer: {
      community: "Verwenden Sie die Community",
      aboutus: "Über uns",
      signup: "Abonnieren Sie den Newsletter",
      openinghours: "Öffnungszeiten",
      callinghours: "Anrufzeiten",
      visitinghours: "Besuchszeiten",
      contact: "Kontakt"
    },
    homepage: {
      title: "Grenzüberschreitendes Business und Rekrutierung zwischen Dänemark und Deutschland"
    }
  }
};

export const getLabel = (keyPath, currentLang) => {
  const langData = uiLabels[currentLang] || uiLabels['English'];
  
  // This allows us to use "media.title" or "common.readMore"
  const keys = keyPath.split('.');
  let result = langData;

  for (const key of keys) {
    if (result[key]) {
      result = result[key];
    } else {
      // If it fails, try finding it in English as a fallback
      return keyPath; 
    }
  }
  return result;
};




export const getTranslatedContent = (item, field, currentLang) => {
  if (!item) return '';

  // 1. Define suffixes based on selection
  const suffixes = {
    'Danish': '_dk',
    'German': '_de'
  };

  const suffix = suffixes[currentLang];

  // 2. Logic for the Title (Special case because WP titles are in .title.rendered)
  if (field === 'title') {
    // Check for title_dk or title_de
    if (suffix && item.acf && item.acf[`title${suffix}`]) {
      return item.acf[`title${suffix}`];
    }
    return item.title?.rendered || '';
  }

  // 3. Logic for ACF fields (Short Description, etc.)
  if (item.acf) {
    const overrideKey = `${field}${suffix || ''}`;
    // Check if the specific override exists (e.g., video_short_description_dk)
    if (suffix && item.acf[overrideKey]) {
      return item.acf[overrideKey];
    }
    // Fallback to the original English ACF field
    return item.acf[field] || '';
  }

  return '';
};

