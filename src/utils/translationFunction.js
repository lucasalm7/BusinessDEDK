// src/utils/translationFunction.js

/**
 * @param {Object} item - The video object from the API
 * @param {String} field - The base field name (e.g., 'title' or 'video_short_description')
 * @param {String} currentLang - The currently selected language from your filter
 * @returns {String} - The translated string or fallback
 */

// 1. Dictionary for hardcoded UI labels
const uiLabels = {
  English: {
    readMore: "Read more",
    searchPlaceholder: "Search by title, language...",
    filterBy: "Filter by",
    allVideos: "All videos",
    shareTitle: "Share this video",
    backToMedia: "Back to Media",
    loading: "Loading...",
    shareDescription: "Found this article helpful or interesting? Spread the word by sharing it on your social media or email.",
    noVideos: "No videos found matching your criteria.",
    language: "Language",
    type: "Type",
    topic: "Topic",
    mediaTitle: "Cross-Border Business Media",
    mediaDescription: "Watch expert interviews, cross-border business insights, recruitment stories, and Denmark-Germany success cases."
  },
  Danish: {
    readMore: "Læs mere",
    searchPlaceholder: "Søg efter titel, sprog...",
    filterBy: "Filtrer efter",
    allVideos: "Alle videoer",
    shareTitle: "Del denne video",
    backToMedia: "Tilbage til medier",
    loading: "Indlæser...",
    shareDescription: "Synes du, denne artikel er nyttig eller interessant? Del den på dine sociale medier eller via e-mail.",
    noVideos: "Ingen videoer fundet, der matcher dine kriterier.",
    language: "Sprog",
    type: "Type",
    topic: "Emne",
    mediaTitle: "Grænseoverskridende Erhvervsmedier",
    mediaDescription: "Se ekspertinterviews, historier om international rekruttering, virksomhedsekspansion og succesfuldt samarbejde mellem Danmark og Tyskland."
  },
  German: {
    readMore: "Weiterlesen",
    searchPlaceholder: "Suche nach Titel, Sprache...",
    filterBy: "Filtern nach",
    allVideos: "Alle Videos",
    shareTitle: "Dieses Video teilen",
    backToMedia: "Zurück zu Medien",
    loading: "Lädt...",
    shareDescription: "Fanden Sie diesen Artikel hilfreich oder interessant? Teilen Sie ihn in Ihren sozialen Medien oder per E-Mail.",
    noVideos: "Keine Videos gefunden, die Ihren Kriterien entsprechen.",
    language: "Sprache",
    type: "Typ",
    topic: "Thema",
    mediaTitle: "Grenzüberschreitende Wirtschaftsmedien",
    mediaDescription: "Entdecken Sie Experteninterviews, internationale Rekrutierungsstrategien, Unternehmenswachstum und erfolgreiche Zusammenarbeit zwischen Dänemark und Deutschland."
  }
};

export const getLabel = (key, currentLang) => {
  return uiLabels[currentLang]?.[key] || uiLabels['English'][key];
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

