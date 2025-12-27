/**
 * German translations for documentation page
 */

export const documentation = {
  title: 'App-Dokumentation',
  description: 'Umfassende Dokumentation für die Midora AI Frontend-Anwendung',
  navigation: {
    overview: 'Übersicht',
    theme: 'Theme-Variablen',
    icons: 'Icon-Galerie',
    components: 'UI-Komponenten',
    api: 'API-Dokumentation',
  },
  overview: {
    title: 'Dokumentationsübersicht',
    description: 'Willkommen in der Midora AI Frontend-Dokumentation. Dieses Dashboard bietet umfassende Informationen über die Anwendungsstruktur, das Theme-System, UI-Komponenten und mehr.',
    sections: {
      theme: {
        title: 'Theme-System',
        description: 'Erkunden Sie die vollständigen Theme-Variablen, Farben und Styling-Systeme, die in der gesamten Anwendung verwendet werden.',
        features: [
          'Unterstützung für hellen und dunklen Modus',
          'CSS-Custom-Properties',
          'Tailwind CSS-Integration',
          'Responsive Design-Tokens'
        ]
      },
      icons: {
        title: 'Icon-Bibliothek',
        description: 'Durchsuchen und interagieren Sie mit allen verfügbaren Icons in der Anwendung.',
        features: [
          'Interaktive Icon-Galerie',
          'Code-Beispiele für jedes Icon',
          'Kopieren-in-Zwischenablage-Funktionalität',
          'Such- und Filterfunktionen'
        ]
      },
      components: {
        title: 'UI-Komponenten',
        description: 'Umfassende Bibliothek wiederverwendbarer UI-Komponenten.',
        features: [
          'Button-Varianten',
          'Formulareingaben',
          'Karten und Layouts',
          'Ladezustände'
        ]
      }
    }
  },
  theme: {
    title: 'Theme-Variablen',
    description: 'Vollständiges Theme-System einschließlich Farben, Typografie, Abstände und mehr.',
    sections: {
      colors: {
        title: 'Farbpalette',
        description: 'Primäre, sekundäre und semantische Farbdefinitionen'
      },
      typography: {
        title: 'Typografie',
        description: 'Schriftfamilien, Größen, Gewichte und Zeilenhöhen'
      },
      spacing: {
        title: 'Abstandssystem',
        description: 'Konsistente Abstandswerte für Ränder und Polsterung'
      },
      borders: {
        title: 'Rahmensystem',
        description: 'Rahmenradius, Breiten und Farbdefinitionen'
      }
    },
    variables: {
      lightMode: 'Heller Modus Variablen',
      darkMode: 'Dunkler Modus Variablen',
      surface: 'Oberflächenfarben',
      text: 'Textfarben',
      border: 'Rahmenfarben',
      primitive: 'Primitive Farben'
    }
  },
  icons: {
    title: 'Icon-Galerie',
    description: 'Interaktive Galerie aller verfügbaren Icons mit Code-Beispielen.',
    search: {
      placeholder: 'Icons durchsuchen...',
      noResults: 'Keine Icons gefunden, die Ihrer Suche entsprechen.',
      totalCount: 'Icons insgesamt: {count}'
    },
    code: {
      title: 'Verwendungscode',
      copy: 'Code kopieren',
      copied: 'Kopiert!',
      import: 'Importieren',
      usage: 'Verwendungsbeispiel'
    },
    categories: {
      all: 'Alle Icons',
      navigation: 'Navigation',
      actions: 'Aktionen',
      media: 'Medien',
      communication: 'Kommunikation',
      files: 'Dateien & Ordner'
    }
  },
  components: {
    title: 'UI-Komponenten',
    description: 'Wiederverwendbare UI-Komponenten mit Beispielen und Dokumentation.',
    categories: {
      buttons: 'Buttons',
      inputs: 'Formulareingaben',
      cards: 'Karten & Layouts',
      navigation: 'Navigation',
      feedback: 'Feedback & Laden'
    }
  },
  common: {
    loading: 'Wird geladen...',
    error: 'Fehler beim Laden des Inhalts',
    retry: 'Erneut versuchen',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    search: 'Suchen',
    filter: 'Filtern',
    clear: 'Löschen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    close: 'Schließen',
    open: 'Öffnen',
    expand: 'Erweitern',
    collapse: 'Reduzieren'
  }
}

