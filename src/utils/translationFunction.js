// src/utils/translationFunction.js

import About from "../router/About.vue";
import Advisors from "../router/Advisors.vue";
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
    months: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December"
    },
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
      subscribe: "Subscribe now",
      seeall: "See all",
      all: "All",
      english: "English",
      danish: "Danish",
      german: "German"
    },
    nav: {
        media: "Media",
        network: "Network",
        events: "Events",
        about: "About",
        more: "More",
        becomeamember: "Become a member",
        borderregion: "Border Region",
        blog: "Blog",
        photogallery: "Photogallery",
        resources: "Resources",
        advisors: "Advisors"
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
        shortcutnetwork: "Become a member of the network",
        shortcutresources: "Access our resources and find your answers",
        shortcutborder: "Get information about the border region",
        latestblog: "Latest blog posts",
        viewvideo: "View video"
    },
    newsletter: {
        title: "Stay up to date with business, from your inbox",
        description: "Stay up to date on new media, local business news and upcoming events. Our newsletter gives you relevant knowledge and inspiration – without the noise.",
        emailplaceholder: "Enter your email address",
        subscribe: "Subscribe to newsletter",
        success: "Subscribed!",
        positivefdbk: "Thank you for subscribing to our newsletter! We're excited to have you on board."
     },
     events: {
        upcoming: "Upcoming events",
        loading: "Loading upcoming events...",
        noevents: "No upcoming activities recorded currently."
     },
     blog: {
        noimage: "No image provided",
        nopreview: "No preview available",
        loading: "Loading posts..."
     },
     taxonomy: {
            video_interview: "Interview",
            video_event: "Event",
            video_story: "Story",
  },
  Danish: {
    months: {
      jan: "Januar",
      feb: "Februar",
      mar: "Marts",
      apr: "April",
      may: "Maj",
      jun: "Juni",
      jul: "Juli",
      aug: "August",
      sep: "September",
      oct: "Oktober",
      nov: "November",
      dec: "December"
     },
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
        subscribe: "Tilmeld dig nu",
        seeall: "Se alle",
        all: "Alle",
        english: "Engelsk",
        danish: "Dansk",
        german: "Tysk"
    },
    nav: {
        media: "Medier",
        network: "Netværk",
        events: "Events",
        about: "Om os",
        more: "Mere",
        becomeamember: "Bliv medlem",
        borderregion: "Grænseregionen",
        blog: "Blog",
        photogallery: "Fotogalleri",
        resources: "Ressourcer",
        advisors: "Advisors"
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
        shortcutnetwork: "Bliv medlem af netværket",
        shortcutresources: "Få adgang til vores ressourcer og find dine svar",
        shortcutborder: "Få oplysninger om grænseregionen",
        latestblog: "Seneste blogindlæg",
        viewvideo: "Se video"
    },
    newsletter: {
        title: "Hold dig opdateret med erhvervslivet, direkte i din indbakke",
        description: "Hold dig opdateret om nye medier, lokale erhvervsnyheder og kommende events. Vores nyhedsbrev giver dig relevant viden og inspiration – uden støj.",
        emailplaceholder: "Indtast din e-mailadresse",
        subscribe: "Tilmeld dig nyhedsbrevet",
        success: "Tilmeldt!",
        positivefdbk: "Tak for at du tilmeldte dig vores nyhedsbrev! Vi er glade for at have dig med ombord."
     },
        events: {
          upcoming: "Kommende events",
          loading: "Indlæser kommende events...",
          noevents: "Ingen kommende aktiviteter registreret i øjeblikket."
        },
        blog: {
            noimage: "Ingen billede tilgængeligt",
            nopreview: "Ingen preview tilgængelig",
            loading: "Indlæser indlæg..."
        },
        taxonomy: {
            video_interview: "Interview",
            video_event: "Event",
            video_story: "Historie"
        }
  },
  German: {
    months: {
        jan: "Januar",
        feb: "Februar",
        mar: "März",
        apr: "April",
        may: "Mai",
        jun: "Juni",
        jul: "Juli",
        aug: "August",
        sep: "September",
        oct: "Oktober",
        nov: "November",
        dec: "Dezember"
     },
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
        subscribe: "Jetzt abonnieren",
        seeall: "Alle ansehen",
        all: "Alle",
        english: "Englisch",
        danish: "Dänisch",
        german: "Deutsch"
    },
    nav: {
        media: "Medien",
        network: "Netzwerk",
        events: "Veranstaltungen",
        about: "Über uns",
        more: "Mehr",
        becomeamember: "Mitglied werden",
        borderregion: "Grenzregion",
        blog: "Blog",
        photogallery: "Fotogalerie",
        resources: "Ressourcen",
        advisors: "Berater"
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
        title: "Grenzüberschreitendes Business und Rekrutierung zwischen Dänemark und Deutschland",
        shortcutresources: "Zugriff auf unsere Ressourcen und finden Sie Ihre Antworten",
        shortcutnetwork: "Werden Sie Mitglied des Netzwerks",
        shortcutborder: "Erhalten Sie Informationen über die Grenzregion",
        latestblog: "Neueste Blogbeiträge",
        viewvideo: "Video ansehen"
    },
    newsletter: {
        title: "Bleiben Sie mit Business auf dem Laufenden, direkt in Ihrem Posteingang",
        description: "Bleiben Sie über neue Medien, lokale Geschäftsnachrichten und bevorstehende Veranstaltungen auf dem Laufenden. Unser Newsletter bietet Ihnen relevante Kenntnisse und Inspiration – ohne das Rauschen.",
        emailplaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
        subscribe: "Abonnieren Sie den Newsletter",
        success: "Abonniert!",
        positivefdbk: "Vielen Dank für Ihre Anmeldung zu unserem Newsletter! Wir freuen uns, Sie an Bord zu haben."
    },
    events: {
        upcoming: "Bevorstehende Veranstaltungen",
        loading: "Indlæser kommende events...",
        noevents: "Ingen kommende aktiviteter registreret i øjeblikket."
    },
    blog: {
        noimage: "Kein Bild verfügbar",
        nopreview: "Kein Preview verfügbar",
        loading: "Lädt Beiträge..."
    },
      taxonomy: {
          video_interview: "Interview",
          video_event: "Veranstaltung",
          video_story: "Geschichte"
        }
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


