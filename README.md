#Workshopportal

Kleine, responsive HTML-Demo für die Buchung des „Microsoft License Pro Workshop“ durch Firmenkunden.
## Projektstruktur

```text
.
├── Landingpage/
│   ├── index.html
│   ├── hero-grafik.svg
│   └── hero-ohne-frau.jpg
├── Firmen Dashboard/
│   ├── firmen-dashboard.html
│   └── hintergrund.jpg
├── shared/
│   ├── company-bookings.js      (Buchungslogik, max. 20 Teilnehmer)
│   ├── tenant-report.js         (Prüfung der Tenant-Report-Datei)
│   ├── workshop-countdown.js    (Countdown bis zum Workshop-Beginn)
│   ├── share-links.js           (Teilen-Links für Facebook, Instagram, LinkedIn)
│   ├── certificate.js           (Zertifikat: Verfügbarkeit, Dateiname, PDF-Erzeugung)
│   ├── landing-engagement.js    (Gratis-Check und Sterne-Bewertung)
│   └── chat-intents.js          (Antwortlogik des Landingpage-Chatbots)
├── tests/
│   ├── company-bookings.test.js
│   ├── tenant-report.test.js
│   ├── landing-engagement.test.js
│   ├── chat-intents.test.js
│   ├── workshop-countdown.test.js
│   ├── share-links.test.js
│   ├── certificate.test.js
│   └── runner.html              (Tests im Browser ausführen)
├── translations.js
└── README.md
```

Eine Erklärung jeder einzelnen Datei und ihres Zusammenspiels steht in `Dateiuebersicht.md`, die ausführliche Dokumentation in `Projektdokumentation.md`.

## Starten

Öffnen Sie `Landingpage/index.html` direkt in einem aktuellen Browser. Der Ablauf ist ein Click-Through ohne Anmeldung: Workshop-Termin mit „Workshop buchen“ wählen und direkt im Firmen-Dashboard landen. „Abmelden“ führt zurück zur Landingpage. Für das offizielle Logo ist eine Internetverbindung erforderlich; zusätzliche Pakete oder ein Build-Schritt werden nicht benötigt.

## Tests

`tests/runner.html` im Browser öffnen; der Titel zeigt „ALLE TESTS BESTANDEN“. Dieselbe Testdatei läuft mit Node.js über `node --test tests`.

## Funktionen

- Buchung nur für Firmenkunden, ohne Anmeldeseite
- Countdown im Firmen-Dashboard bis zum Beginn des nächsten gebuchten Workshops als Text „Ihr Workshop ist in X Tagen“ (zählt täglich um einen Kalendertag herunter; Beginn 9:00 Uhr als Annahme, Logik in `shared/workshop-countdown.js`). Ohne Buchung erscheint ein Hinweis, nach Beginn eine Meldung.
- Teilnahmezertifikat im Firmen-Dashboard: Pro angemeldetem Teilnehmer als PDF herunterladbar (A4 quer, im Browser erzeugt). Der Button wird ab Workshop-Beginn aktiv, davor ist er deaktiviert.
- Teilen-Leiste am rechten Rand des Firmen-Dashboards (Facebook, Instagram, LinkedIn in sey-IT-Orange), sichtbar sobald ein Workshop gebucht ist. Facebook und LinkedIn öffnen den Teilen-Dialog; Instagram bietet keinen Web-Teilen-Link, daher wird der Text kopiert und Instagram geöffnet. Geteilt wird `https://sey-it.com/` mit dem Text zum nächsten gebuchten Workshop.
- Begrüßung im Firmen-Dashboard: „Guten Tag, Firma!“ passt sich an, sobald ein Teilnehmer angemeldet ist. Der Firmenname wird aus der E-Mail-Domain des ersten Teilnehmers abgeleitet (`anna@muster-software.com` → „Muster Software“). Bei privaten Mail-Anbietern wie gmail.com oder web.de bleibt es bei „Firma“. Ein Parameter `name` in der URL hat Vorrang. Logik in `shared/company-bookings.js`.
- Firmen-Dashboard: Workshop-Termine einzeln buchen und stornieren, pro Termin bis zu 20 Teilnehmer mit Name und E-Mail anmelden und entfernen, Auslastungsbalken, Prüfung auf ungültige oder doppelte E-Mail-Adressen und volle Buchung
- Landingpage-Abschnitt „So geht es weiter“ (drei Schritte) direkt unter den Workshop-Karten
- Tenant-Check im Firmen-Dashboard: Kurzanleitung (M365 Admin Center ► „Ihre Produkte“ ► „In CSV exportieren“) und Upload für CSV/Excel (.csv, .xlsx, .xls, max. 5 MB, Prüfung in `shared/tenant-report.js`; in der Demo wird die Datei nicht übertragen)
- Landingpage mit zwei getrennt buchbaren Workshops: „Microsoft License Pro Workshop“ am 18.11.2026 und am 25.11.2026 (keine weiteren Schulungen, keine Suche oder Filter)
- Trust-Leiste mit überprüfbaren Produktfakten (hervorgehobener „Bonus: Kostenloser Check“, 20 Teilnehmer, Demo-Hinweis); der unbelegte „bis zu 10 %“-Wert wurde entfernt
- Kostenloser Check (Lizenzen und Software) auf der Landingpage mit Validierung; Anfragen werden nur lokal im Browser gespeichert
- 1–5-Sterne-Feedback mit optionalem Kommentar (per Tastatur bedienbar); Durchschnitt aus den lokal gespeicherten Bewertungen. Logik in `shared/landing-engagement.js`
- Hero der Landingpage: mitscrollende Tacho-Grafik (`Landingpage/hero-grafik.svg`, 10,5 % aufgehellt) über dem festen Hintergrundbild ohne die Person am rechten Rand (`Landingpage/hero-ohne-frau.jpg`)
- Direkte Weiterleitung von „Workshop buchen“ an das Firmen-Dashboard inklusive gewähltem Termin (keine Rollenabfrage mehr)
- FAQ-Chatbot ausschließlich auf der Landingpage (Workshops, Firmenbuchung, Gratis-Check, Tenant-Report, Termine); Antwortlogik in `shared/chat-intents.js`
- Light-/Dark-Mode nach den sey-IT-Grundfarben
- Umschaltung zwischen Deutsch und Englisch; Sprache und Theme bleiben beim Seitenwechsel erhalten
- Sprachschalter mit Flagge der Zielsprache
- Dezentes Hintergrundbild hinter dem Firmen-Dashboard

## Demo-Einschränkungen

- Demo-Buchungen des Firmen-Dashboards werden nur im `localStorage` des Browsers gespeichert und nicht an sey-IT übermittelt.
- Es gibt kein Backend, keine Anmeldung und keine Benutzerverwaltung; das Dashboard ist ohne Authentifizierung direkt erreichbar.
- Der Chatbot verwendet lokale FAQ-Antworten und ist nicht mit einem Backend oder KI-Dienst verbunden.
- Zertifikatsseite, Zertifikats-Teilen und Privatkunden-Dashboard wurden entfernt; das Zertifikat gibt es als Download im Firmen-Dashboard.
- Die Texte für Deutsch und Englisch liegen gemeinsam in `translations.js`; ungenutzte Schlüssel wurden entfernt.

## Light-/Dark-Mode

Der Theme-Schalter ist auf der Landingpage und im Firmen-Dashboard verfügbar. Er wechselt die sey-IT-Logoversion passend zum Modus und erhält die Auswahl beim Seitenwechsel.

| Eigenschaft | Light Mode | Dark Mode |
|---|---|---|
| Grundfarbe | `#ffffff` | `#26292e` |
| Haupttext | `#333333` | `#c8c8c8` |
| Logo | `seyit-logo.svg` | `seyit-logo-white.svg` |
| Bild-Overlay | `rgba(242, 244, 247, 0.9)` | `rgba(38, 41, 46, 0.9)` |

Das Hintergrundbild `Firmen Dashboard/hintergrund.jpg` liegt unter beiden Oberflächen und scheint durch das 90-prozentige Overlay dezent hindurch. Der Sprachschalter zeigt die Flagge der Zielsprache: die England-Flagge für Englisch, die Deutschland-Flagge für Deutsch.
