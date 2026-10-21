#Workshopportal

Kleine, responsive HTML-Demo für die Buchung des „Microsoft License Pro Workshop“ durch Firmenkunden.
## Projektstruktur

```text
.
├── Landingpage/
│   ├── index.html
│   └── hero-ohne-frau.jpg
├── Firmen Dashboard/
│   ├── firmen-dashboard.html
│   └── hintergrund.jpg
├── QR-Code/
│   ├── qr-code-generator.html   (QR-Code für PowerPoint als SVG/PNG erzeugen)
│   └── seyit-logo.svg           (Vorlage des sey-IT-Logos im QR-Code)
├── Praesentation/
│   ├── Projekt-MLP.pptx         (fünfseitige Präsentation im sey-IT-Design)
│   └── ablauf-skizze.svg        (Ablaufbild von der Buchung bis zum Zertifikat)
├── shared/
│   ├── company-bookings.js      (Buchungslogik, max. 20 Teilnehmer)
│   ├── tenant-report.js         (Prüfung der Tenant-Report-Datei)
│   ├── workshop-countdown.js    (Countdown bis zum Workshop-Beginn)
│   ├── share-links.js           (Teilen-Links für Facebook, Instagram, LinkedIn)
│   ├── certificate.js           (Zertifikat: Verfügbarkeit, Dateiname, PDF-Erzeugung)
│   ├── participant-link.js      (Teilnehmer-Link des QR-Codes, Prüfung der Namen)
│   ├── qr-code.js               (Text in QR-Code-Pfad umwandeln)
│   ├── sey-it-logo.js           (sey-IT-Logo als SVG-Pfade für den QR-Code)
│   ├── vendor/qrcode.js         (Bibliothek qrcode-generator 1.4.4, MIT)
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
│   ├── participant-link.test.js
│   ├── qr-code.test.js
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
- Teilnahmezertifikat: Nur über den QR-Code in der Teilnehmer-Ansicht als PDF herunterladbar (A4 quer, im Browser erzeugt), ab Workshop-Beginn. Im Firmen-Dashboard selbst gibt es keinen Download; dort werden Teilnehmer nur angemeldet.
- Teilen-Leiste am rechten Rand des Firmen-Dashboards (Facebook, Instagram, LinkedIn in sey-IT-Orange), sichtbar sobald ein Workshop gebucht ist. Facebook und LinkedIn öffnen den Teilen-Dialog; Instagram bietet keinen Web-Teilen-Link, daher wird der Text kopiert und Instagram geöffnet. Geteilt wird `https://sey-it.com/` mit dem Text zum nächsten gebuchten Workshop.
- Begrüßung im Firmen-Dashboard: „Guten Tag, Teilnehmer!“ passt sich an, sobald ein Teilnehmer angemeldet ist. Der Firmenname wird aus der E-Mail-Domain des ersten Teilnehmers abgeleitet (`anna@muster-software.com` → „Muster Software“). Bei privaten Mail-Anbietern wie gmail.com oder web.de bleibt es bei „Teilnehmer“. Ein Parameter `name` in der URL hat Vorrang. Logik in `shared/company-bookings.js`.
- Firmen-Dashboard: Workshop-Termine einzeln buchen und stornieren, pro Termin bis zu 20 Teilnehmer mit Name und E-Mail anmelden und entfernen, Auslastungsbalken, Prüfung auf ungültige oder doppelte E-Mail-Adressen und volle Buchung
- Landingpage-Abschnitt „So geht es weiter“ (drei Schritte) zwischen der Bonus-Leiste und den Workshops
- QR-Code für Teilnehmer: Der Generator `QR-Code/qr-code-generator.html` (wird direkt geöffnet, im Dashboard gibt es keinen Link dorthin) erzeugt einen QR-Code mit sey-IT-Logo und orangem, abgerundetem Rahmen (Ecken transparent) als SVG oder PNG für PowerPoint. Er enthält Prüfwerte der angemeldeten Namen (keine Klartext-Namen) und führt auf `firmen-dashboard.html?participant=<Termin-ID>&k=<Prüfwerte>`. Teilnehmer geben dort Vorname, Nachname und geschäftliche E-Mail-Adresse ein. Geprüft wird nur der Name (ohne Beachtung von Groß-/Kleinschreibung und doppelten Leerzeichen). Die E-Mail-Adresse muss lediglich gültig sein und darf von der angemeldeten Adresse abweichen. Ist der Name angemeldet, können sie ihr Zertifikat direkt im Browser herunterladen (ab Workshop-Beginn) und den Erfolg auf LinkedIn, Facebook oder Instagram teilen. Ändern sich die Anmeldungen, muss der QR-Code neu erstellt werden.
  - Beispiel: Die Telekom meldet 20 Teilnehmer mit Telekom-Adressen an. Nach dem Workshop scannt jeder den QR-Code, gibt seinen angemeldeten Vor- und Nachnamen und eine beliebige gültige E-Mail-Adresse ein und erhält sein Zertifikat.
- Tenant-Check im Firmen-Dashboard rechts neben den Buchungen und Workshops (unten bündig): Kurzanleitung (M365 Admin Center ► „Ihre Produkte“ ► „In CSV exportieren“) und Upload für CSV/Excel (.csv, .xlsx, .xls, max. 5 MB, Prüfung in `shared/tenant-report.js`; in der Demo wird die Datei nicht übertragen)
- Landingpage mit zwei getrennt buchbaren Workshops: „Microsoft License Pro Workshop“ am 18.11.2026 und am 25.11.2026 (keine weiteren Schulungen, keine Suche oder Filter). Die Karten zeigen eingeklappt Kategorie, Titel und Termin; die Beschreibung klappt beim Darüberfahren aus, „Workshop buchen“ ist immer sichtbar.
- Trust-Leiste mit der leicht vibrierenden Hervorhebung „Bonus: Kostenloser Check“ und „Bis zu 20 Teilnehmer“
- Kostenloser Check (Lizenzen und Software) auf der Landingpage rechts neben den Workshop-Karten: Überschrift und Einleitung sind sichtbar, die Eingabefelder klappen beim Darüberfahren oder Fokussieren aus. Anfragen werden nur lokal im Browser gespeichert.
- 1–5-Sterne-Feedback mit optionalem Kommentar (per Tastatur bedienbar) in voller Breite und einer Zeile; Durchschnitt aus den lokal gespeicherten Bewertungen. Logik in `shared/landing-engagement.js`
- Hero der Landingpage: Slogan „ready → steady → sey-IT“ mit orangefarbenen Kreislauf-Pfeilen, 10° gedreht, rechts im Hero; die Tacho-Grafik wurde entfernt. Hintergrundbild ohne die Person am rechten Rand (`Landingpage/hero-ohne-frau.jpg`)
- Direkte Weiterleitung von „Workshop buchen“ an das Firmen-Dashboard inklusive gewähltem Termin (keine Rollenabfrage mehr)
- FAQ-Chatbot ausschließlich auf der Landingpage (Workshops, Firmenbuchung, Gratis-Check, Tenant-Report, Termine); Antwortlogik in `shared/chat-intents.js`
- Light-/Dark-Mode nach den sey-IT-Grundfarben
- Umschaltung zwischen Deutsch und Englisch; Sprache und Theme bleiben beim Seitenwechsel erhalten
- Sprachschalter mit Flagge der Zielsprache
- Dezentes Hintergrundbild hinter dem Firmen-Dashboard
- Statischer orangefarbener Streifen (4 px) unter dem sey-IT-Logo auf Landingpage und Dashboard. Auf dem Dashboard schließt der Tenant-Check unten bündig mit der letzten Workshop-Karte ab.
- Präsentation im Ordner `Praesentation/`: `Projekt-MLP.pptx` (5 Folien, Dunkelmodus mit Orange) und das Ablaufbild `ablauf-skizze.svg`

## Demo-Einschränkungen

- Demo-Buchungen des Firmen-Dashboards werden nur im `localStorage` des Browsers gespeichert und nicht an sey-IT übermittelt.
- Die über den QR-Code eingegebenen Daten werden nur zur Prüfung verwendet und nicht gespeichert. Ein Versand des Zertifikats an die eingegebene E-Mail-Adresse wäre nur mit einem Backend möglich.
- Die Prüfung über Namen ist ein Demo-Schutz: Wer den QR-Code hat und einen angemeldeten Namen kennt, kann dessen Zertifikat abrufen.
- Der QR-Code funktioniert auf Handys nur, wenn das Dashboard unter einer von dort erreichbaren Internetadresse liegt. Ein Link auf eine lokale Datei (`file:///…`) lässt sich nicht öffnen.
- Es gibt kein Backend, keine Anmeldung und keine Benutzerverwaltung; das Dashboard ist ohne Authentifizierung direkt erreichbar.
- Der Chatbot verwendet lokale FAQ-Antworten und ist nicht mit einem Backend oder KI-Dienst verbunden.
- Zertifikatsseite, Zertifikats-Teilen und Privatkunden-Dashboard wurden entfernt; das Zertifikat gibt es nur noch als Download in der Teilnehmer-Ansicht (QR-Code).
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
