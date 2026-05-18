// src/utils/translationFunction.js

import About from "../router/About.vue";
import Advisors from "../router/Advisors.vue";
import Photogallery from "../router/Photogallery.vue";

// src/utils/translationFunction.js

/**
 * @param {String} key - The translation key using dot notation (e.g., 'homepage.title')
 * @param {String} language - The language to retrieve ('English', 'Danish', 'German')
 * @returns {String} - The translated string or the key as fallback
 */

export const getLabel = (key, language = 'English') => {
  const labels = {
    'English': {
      homepage: {
        title: "Cross-Border Business and Recruitment Between Denmark and Germany",
        shortcutnetwork: "Become a member of the network",
        shortcutresources: "Access our resources and find your answers",
        shortcutborder: "Get information about the border region",
        latestblog: "Latest blog posts",
        viewvideo: "View video"
      },
      mediapage: {
        mediaTitle: "Cross-Border Business Media",
        mediaDescription: "Watch expert interviews, cross-border business insights, recruitment stories, and Denmark-Germany success cases.",
        allVideos: "All videos",
        shareTitle: "Share this video",
        backToMedia: "Back to Media",
        shareDescription: "Found this article helpful or interesting? Spread the word by sharing it on your social media or email.",
        noVideos: "No videos found matching your criteria."
      },
      events: {
        upcoming: "Upcoming events",
        heroTitle: "Events & Conferences",
        heroSubtitle: "Network and learn at our exclusive cross-border business events",
        loading: "Loading events...",
        allEvents: "All Events",
        upcomingEvents: "Upcoming Events",
        pastEvents: "Past Events",
        filterBy: "Filter by",
        dateRange: "Date range",
        from: "From",
        to: "To",
        clear: "Clear",
        noEvents: "No events found",
        eventType: "Event Type"
      },
      resources: {
        heroTitle: "Resources",
        heroDescription: "Everything you need to succeed in cross-border business",
        downloads: "Downloads",
        guides: "Guides",
        tools: "Tools",
        noResources: "No resources available"
      },
      blog: {
        noimage: "No image provided",
        nopreview: "No preview available",
        loading: "Loading posts...",
        heroSubtitle: "News, analysis and insights for doing business across the Danish–German border",
        heroTitle: "Cross-Border Business Blog",
        allArticles: "All articles",
        country: "Country",
        audience: "Audience",
        dateRange: "Date range",
        searchPlaceholder: "Search by name, topic, country..."
      },
      taxonomy: {
        video_interview: "Interview",
        video_event: "Event",
        video_story: "Story"
      },
      about: {
        title: "About us",
        hero_subtitle: "Connect with businesses, institutions, and experts across the DE-DK region.",
        who_we_are: "Who We Are",
        who_p1: "Business DE-DK is a cross-border economic initiative dedicated to strengthening business relationships and fostering collaboration between Northern Germany and Southern Denmark. Established as a bridge connecting the two dynamic economies, we serve as a catalyst for economic growth and sustainable development.",
        who_p2: "Our platform connects over 500 businesses, institutions, and decision-makers across the border region, facilitating partnerships that drive economic prosperity and create opportunities for all stakeholders.",
        who_p3: "With deep roots in both German and Danish business cultures, we understand the unique opportunities and challenges of cross-border collaboration. Our team of experts provides tailored support from market entry strategies to regulatory guidance, ensuring your success in this vibrant economic corridor.",
        mission_title: "Our Mission",
        mission_text: "To create a thriving cross-border business ecosystem that leverages the strengths of both Germany and Denmark, enabling companies to grow, innovate, and compete on a global stage.",
        vision_title: "Our Vision",
        vision_text: "A unified border region recognized as a leading hub for innovation, sustainability, and international commerce, where businesses seamlessly collaborate across cultural and national boundaries.",
        values_title: "Our Values",
        value1: "Collaboration & Partnership",
        value2: "Innovation & Excellence",
        value3: "Sustainability & Responsibility",
        value4: "Transparency & Integrity",
        what_we_offer: "What We Offer",
        get_in_touch: "Get in Touch",
        contact_intro1: "Have questions or want to learn more about how we can support your business?",
        contact_intro2: "Fill out the form below and our team will get back to you within 24 hours.",
        form_name: "Full Name *",
        form_name_placeholder: "Your name",
        form_email: "Email Address *",
        form_email_placeholder: "your@email.com",
        form_org: "Organization",
        form_org_placeholder: "Company or institution name",
        form_message: "Message *",
        form_message_placeholder: "Tell us how we can help...",
        form_submit: "Send Message",
        contact_info_title: "Contact Information",
        contact_info_subtitle: "Reach out to us through any of the channels below. We're here to help your business thrive in the DE-DK border region.",
        contact_email_label: "Email",
        contact_phone_label: "Phone",
        office_hours_title: "Office Hours",
        weekdays: "Monday - Friday",
        weekend: "Saturday - Sunday",
        closed: "Closed",
        offices_title: "Offices"
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
        denmark: "Denmark",
        germany: "Germany",
        businesses: "Businesses",
        freelancers: "Freelancers",
        startups: "Startups",
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
        contact: "Contact"
      },
      newsletter: {
        title: "Stay up to date with business, from your inbox",
        description: "Stay up to date on new media, local business news and upcoming events. Our newsletter gives you relevant knowledge and inspiration – without the noise.",
        emailplaceholder: "Enter your email address",
        subscribe: "Subscribe to newsletter",
        success: "Subscribed!",
        positivefdbk: "Thank you for subscribing to our newsletter! We're excited to have you on board."
      },
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
      }
    },
    'Danish': {
      homepage: {
        title: "Grænseoverskridende Erhverv og Rekruttering mellem Danmark og Tyskland",
        shortcutnetwork: "Bliv medlem af netværket",
        shortcutresources: "Få adgang til vores ressourcer og find dine svar",
        shortcutborder: "Få oplysninger om grænseregionen",
        latestblog: "Seneste blogindlæg",
        viewvideo: "Se video"
      },
      mediapage: {
        mediaTitle: "Grænseoverskridende Erhvervsmedier",
        mediaDescription: "Se ekspertinterviews, historier om international rekruttering, virksomhedsekspansion og succesfuldt samarbejde mellem Danmark og Tyskland.",
        allVideos: "Alle videoer",
        shareTitle: "Del denne video",
        backToMedia: "Tilbage til medier",
        shareDescription: "Synes du, denne artikel er nyttig eller interessant? Del den på dine sociale medier eller via e-mail.",
        noVideos: "Ingen videoer fundet, der matcher dine kriterier."
      },
      events: {
        upcoming: "Kommende events",
        heroTitle: "Events & Konferencer",
        heroSubtitle: "Netværk og lær på vores eksklusive grænseoverskridende erhvervsevent",
        loading: "Indlæser events...",
        allEvents: "Alle events",
        upcomingEvents: "Kommende events",
        pastEvents: "Tidligere events",
        filterBy: "Filtrer efter",
        dateRange: "Datointerval",
        from: "Fra",
        to: "Til",
        clear: "Ryd",
        noEvents: "Ingen events fundet",
        eventType: "Event-type"
      },
      resources: {
        heroTitle: "Ressourcer",
        heroDescription: "Alt hvad du har brug for for at få succes i grænseoverskridende forretninger",
        downloads: "Downloads",
        guides: "Guides",
        tools: "Værktøjer",
        noResources: "Ingen ressourcer tilgængelige"
      },
      blog: {
        noimage: "Ingen billede tilgængeligt",
        nopreview: "Ingen preview tilgængelig",
        loading: "Indlæser indlæg...",
        heroSubtitle: "Nyheder, analyser og indsigt om at drive forretning på tværs af den dansk-tyske grænse",
        heroTitle: "Grænseoverskridende Erhvervsblog",
        allArticles: "Alle artikler",
        country: "Land",
        audience: "Målgruppe",
        dateRange: "Datointerval",
        searchPlaceholder: "Søg efter navn, emne, land..."
      },
      taxonomy: {
        video_interview: "Interview",
        video_event: "Event",
        video_story: "Historie"
      },
      about: {
        title: "Om os",
        hero_subtitle: "Få forbindelse til virksomheder, institutioner og eksperter i DE-DK-regionen.",
        who_we_are: "Hvem er vi",
        who_p1: "Business DE-DK er et grænseoverskridende økonomisk initiativ, der er dedikeret til at styrke forretningsforbindelser og fremme samarbejde mellem det nordlige Tyskland og det sydlige Danmark. Etableret som en bro mellem de to dynamiske økonomier fungerer vi som en katalysator for økonomisk vækst og bæredygtig udvikling.",
        who_p2: "Vores platform forbinder over 500 virksomheder, institutioner og beslutningstagere på tværs af grænseregionen og faciliterer partnerskaber, der driver økonomisk velstand og skaber muligheder for alle interessenter.",
        who_p3: "Med dybe rødder i både den tyske og den danske erhvervskultur forstår vi de unikke muligheder og udfordringer ved grænseoverskridende samarbejde. Vores ekspertteam yder skræddersyet støtte – fra markedsindtrængningsstrategier til regulatorisk vejledning.",
        mission_title: "Vores Mission",
        mission_text: "At skabe et blomstrende grænseoverskridende erhvervsøkosystem, der udnytter styrkerne i både Tyskland og Danmark, og som sætter virksomheder i stand til at vokse, innovere og konkurrere på den globale scene.",
        vision_title: "Vores Vision",
        vision_text: "En samlet grænseregion, der anerkendes som et ledende knudepunkt for innovation, bæredygtighed og international handel, hvor virksomheder samarbejder problemfrit på tværs af kulturelle og nationale grænser.",
        values_title: "Vores Værdier",
        value1: "Samarbejde & Partnerskab",
        value2: "Innovation & Ekspertise",
        value3: "Bæredygtighed & Ansvar",
        value4: "Gennemsigtighed & Integritet",
        what_we_offer: "Hvad vi tilbyder",
        get_in_touch: "Kontakt os",
        contact_intro1: "Har du spørgsmål eller ønsker du at vide mere om, hvordan vi kan støtte din virksomhed?",
        contact_intro2: "Udfyld formularen nedenfor, og vores team vender tilbage til dig inden for 24 timer.",
        form_name: "Fulde navn *",
        form_name_placeholder: "Dit navn",
        form_email: "E-mailadresse *",
        form_email_placeholder: "din@email.com",
        form_org: "Organisation",
        form_org_placeholder: "Virksomheds- eller institutionsnavn",
        form_message: "Besked *",
        form_message_placeholder: "Fortæl os, hvordan vi kan hjælpe...",
        form_submit: "Send besked",
        contact_info_title: "Kontaktoplysninger",
        contact_info_subtitle: "Kontakt os via en af kanalerne nedenfor. Vi er her for at hjælpe din virksomhed med at trives i DE-DK-grænseregionen.",
        contact_email_label: "E-mail",
        contact_phone_label: "Telefon",
        office_hours_title: "Åbningstider",
        weekdays: "Mandag - fredag",
        weekend: "Lørdag - søndag",
        closed: "Lukket",
        offices_title: "Kontorer"
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
        denmark: "Danmark",
        germany: "Tyskland",
        businesses: "Virksomheder",
        freelancers: "Freelancere",
        startups: "Startups",
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
        contact: "Kontakt"
      },
      newsletter: {
        title: "Hold dig opdateret med erhvervslivet, direkte i din indbakke",
        description: "Hold dig opdateret om nye medier, lokale erhvervsnyheder og kommende events. Vores nyhedsbrev giver dig relevant viden og inspiration – uden støj.",
        emailplaceholder: "Indtast din e-mailadresse",
        subscribe: "Tilmeld dig nyhedsbrevet",
        success: "Tilmeldt!",
        positivefdbk: "Tak for at du tilmeldte dig vores nyhedsbrev! Vi er glade for at have dig med ombord."
      },
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
      }
    },
    'German': {
      homepage: {
        title: "Grenzüberschreitendes Business und Rekrutierung zwischen Dänemark und Deutschland",
        shortcutnetwork: "Werden Sie Mitglied des Netzwerks",
        shortcutresources: "Zugriff auf unsere Ressourcen und finden Sie Ihre Antworten",
        shortcutborder: "Erhalten Sie Informationen über die Grenzregion",
        latestblog: "Neueste Blogbeiträge",
        viewvideo: "Video ansehen"
      },
      mediapage: {
        mediaTitle: "Grenzüberschreitende Wirtschaftsmedien",
        mediaDescription: "Entdecken Sie Experteninterviews, internationale Rekrutierungsstrategien, Unternehmenswachstum und erfolgreiche Zusammenarbeit zwischen Dänemark und Deutschland.",
        allVideos: "Alle Videos",
        shareTitle: "Dieses Video teilen",
        backToMedia: "Zurück zu Medien",
        shareDescription: "Fanden Sie diesen Artikel hilfreich oder interessant? Teilen Sie ihn in Ihren sozialen Medien oder per E-Mail.",
        noVideos: "Keine Videos gefunden, die Ihren Kriterien entsprechen."
      },
      events: {
        upcoming: "Bevorstehende Veranstaltungen",
        heroTitle: "Events & Konferenzen",
        heroSubtitle: "Netzwerken und lernen Sie bei unseren exklusiven grenzüberschreitenden Geschäftsveranstaltungen",
        loading: "Lädt Events...",
        allEvents: "Alle Events",
        upcomingEvents: "Kommende Events",
        pastEvents: "Vergangene Events",
        filterBy: "Filtern nach",
        dateRange: "Datumsbereich",
        from: "Von",
        to: "Bis",
        clear: "Löschen",
        noEvents: "Keine Events gefunden",
        eventType: "Event-Typ"
      },
      resources: {
        heroTitle: "Ressourcen",
        heroDescription: "Alles, was Sie für Erfolg im grenzüberschreitenden Geschäft benötigen",
        downloads: "Downloads",
        guides: "Leitfäden",
        tools: "Werkzeuge",
        noResources: "Keine Ressourcen verfügbar"
      },
      blog: {
        noimage: "Kein Bild verfügbar",
        nopreview: "Kein Preview verfügbar",
        loading: "Lädt Beiträge...",
        heroSubtitle: "Nachrichten, Analysen und Einblicke für Unternehmen über die dänisch-deutsche Grenze",
        heroTitle: "Grenzüberschreitender Geschäftsblog",
        allArticles: "Alle Artikel",
        country: "Land",
        audience: "Zielgruppe",
        dateRange: "Datumsbereich",
        searchPlaceholder: "Suche nach Name, Thema, Land..."
      },
      taxonomy: {
        video_interview: "Interview",
        video_event: "Event",
        video_story: "Story"
      },
      about: {
        title: "Über uns",
        hero_subtitle: "Vernetzen Sie sich mit Unternehmen, Institutionen und Experten in der DE-DK-Region.",
        who_we_are: "Wer wir sind",
        who_p1: "Business DE-DK ist eine grenzüberschreitende Wirtschaftsinitiative, die sich der Stärkung von Geschäftsbeziehungen und der Förderung der Zusammenarbeit zwischen Norddeutschland und Süddänemark widmet. Als Brücke zwischen den beiden dynamischen Wirtschaftsräumen sind wir ein Katalysator für wirtschaftliches Wachstum und nachhaltige Entwicklung.",
        who_p2: "Unsere Plattform verbindet über 500 Unternehmen, Institutionen und Entscheidungsträger in der Grenzregion und fördert Partnerschaften, die wirtschaftlichen Wohlstand vorantreiben und Chancen für alle Beteiligten schaffen.",
        who_p3: "Mit tiefen Wurzeln in der deutschen wie auch der dänischen Unternehmenskultur verstehen wir die einzigartigen Chancen und Herausforderungen grenzüberschreitender Zusammenarbeit. Unser Expertenteam bietet maßgeschneiderte Unterstützung – von Markteintrittstrategien bis hin zu regulatorischer Beratung.",
        mission_title: "Unsere Mission",
        mission_text: "Ein florierendes grenzüberschreitendes Unternehmensökosystem zu schaffen, das die Stärken Deutschlands und Dänemarks nutzt und Unternehmen ermöglicht, auf der globalen Bühne zu wachsen, zu innovieren und wettbewerbsfähig zu sein.",
        vision_title: "Unsere Vision",
        vision_text: "Eine vereinte Grenzregion, die als führender Knotenpunkt für Innovation, Nachhaltigkeit und internationalen Handel anerkannt ist, in der Unternehmen nahtlos über kulturelle und nationale Grenzen hinweg zusammenarbeiten.",
        values_title: "Unsere Werte",
        value1: "Zusammenarbeit & Partnerschaft",
        value2: "Innovation & Exzellenz",
        value3: "Nachhaltigkeit & Verantwortung",
        value4: "Transparenz & Integrität",
        what_we_offer: "Was wir anbieten",
        get_in_touch: "Kontakt aufnehmen",
        contact_intro1: "Haben Sie Fragen oder möchten Sie mehr darüber erfahren, wie wir Ihr Unternehmen unterstützen können?",
        contact_intro2: "Füllen Sie das Formular unten aus, und unser Team meldet sich innerhalb von 24 Stunden bei Ihnen.",
        form_name: "Vollständiger Name *",
        form_name_placeholder: "Ihr Name",
        form_email: "E-Mail-Adresse *",
        form_email_placeholder: "ihre@email.com",
        form_org: "Organisation",
        form_org_placeholder: "Unternehmens- oder Institutionsname",
        form_message: "Nachricht *",
        form_message_placeholder: "Teilen Sie uns mit, wie wir helfen können...",
        form_submit: "Nachricht senden",
        contact_info_title: "Kontaktinformationen",
        contact_info_subtitle: "Erreichen Sie uns über einen der unten aufgeführten Kanäle. Wir helfen Ihrem Unternehmen, in der DE-DK-Grenzregion erfolgreich zu sein.",
        contact_email_label: "E-Mail",
        contact_phone_label: "Telefon",
        office_hours_title: "Öffnungszeiten",
        weekdays: "Montag – Freitag",
        weekend: "Samstag – Sonntag",
        closed: "Geschlossen",
        offices_title: "Büros"
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
        denmark: "Dänemark",
        germany: "Deutschland",
        businesses: "Unternehmen",
        freelancers: "Freiberufler",
        startups: "Startups",
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
      newsletter: {
        title: "Bleiben Sie mit Business auf dem Laufenden, direkt in Ihrem Posteingang",
        description: "Bleiben Sie über neue Medien, lokale Geschäftsnachrichten und bevorstehende Veranstaltungen auf dem Laufenden. Unser Newsletter bietet Ihnen relevante Kenntnisse und Inspiration – ohne das Rauschen.",
        emailplaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
        subscribe: "Abonnieren Sie den Newsletter",
        success: "Abonniert!",
        positivefdbk: "Vielen Dank für Ihre Anmeldung zu unserem Newsletter! Wir freuen uns, Sie an Bord zu haben."
      },
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
      }
    }
  };

  const parts = key.split('.');
  let current = labels[language];
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }
  
  return current || key;
};

/**
 * @param {Object} item - The item object from the API
 * @param {String} field - The base field name (e.g., 'title')
 * @param {String} currentLang - The currently selected language from your filter
 * @returns {String} - The translated string or fallback
 */
export const getTranslatedContent = (item, field, currentLang) => {
  if (!item) return '';

  const suffixes = {
    'Danish': '_dk',
    'German': '_de'
  };

  const suffix = suffixes[currentLang];

  // Logic for the Title (Special case because WP titles are in .title.rendered)
  if (field === 'title') {
    if (suffix && item.acf && item.acf[`title${suffix}`]) {
      return item.acf[`title${suffix}`];
    }
    return item.title?.rendered || '';
  }

  // Logic for ACF fields (Short Description, etc.)
  if (item.acf) {
    const overrideKey = `${field}${suffix || ''}`;
    if (suffix && item.acf[overrideKey]) {
      return item.acf[overrideKey];
    }
    return item.acf[field] || '';
  }

  return '';
};