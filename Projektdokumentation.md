# Projektdokumentation: sey-IT Workshopportal

Stand: 20.10.2026

## 0. Kurz erklärt (ohne Fachwissen)

**Worum geht es?** Die sey-IT bietet einen Workshop zu Microsoft-Lizenzen an. Dieses Projekt ist eine Vorführ-Version (Demo) der Webseite, über die Firmen den Workshop buchen. Sie zeigt, wie der Ablauf später aussehen könnte. Echte Buchungen gibt es nicht.

**Wie sieht der Ablauf aus?**
1. Sie öffnen die Startseite (Landingpage). Dort stehen zwei Workshop-Termine: 18.11.2026 und 25.11.2026.
2. Sie klicken bei einem Termin auf „Workshop buchen“.
3. Sie landen im Firmen-Dashboard, der Verwaltungsseite der Firma. Dort melden Sie Mitarbeitende an (bis zu 20 pro Termin).
4. Das Dashboard zeigt, in wie vielen Tagen der Workshop beginnt, z. B. „Ihr Workshop ist in 30 Tagen“.
5. Nach dem Workshop laden die Teilnehmer ihr Teilnahmezertifikat selbst als PDF herunter (über den QR-Code, siehe Punkt 7). Im Firmen-Dashboard gibt es keinen Zertifikat-Download.
6. Über die Symbole am rechten Rand lässt sich die Teilnahme auf Facebook, Instagram oder LinkedIn teilen.
7. Auf der letzten Präsentationsfolie steht ein QR-Code (mit dem Generator im Ordner `QR-Code` erzeugt). Teilnehmer scannen ihn, landen auf einer eigenen Seite, tragen Vor- und Nachname sowie eine E-Mail-Adresse ein und laden dort ihr Zertifikat herunter. Geprüft wird nur der Name, so wie die Firma den Teilnehmer angemeldet hat. Die E-Mail-Adresse darf von der angemeldeten abweichen (Beispiel: Die Telekom meldet 20 Teilnehmer mit Telekom-Adressen an, ein Teilnehmer gibt nach dem Workshop seine private Adresse ein und erhält trotzdem sein Zertifikat).

**Wie probiere ich es aus?** Im Ordner `Landingpage` die Datei `index.html` per Doppelklick öffnen. Es ist nichts zu installieren. Das sey-IT-Logo wird aus dem Internet geladen, die Seite braucht also eine Internetverbindung.

**Was ist wichtig zu wissen?**
- Alles, was Sie eingeben, bleibt nur in Ihrem eigenen Browser und wird nirgendwohin gesendet. Was Teilnehmer über den QR-Code eintragen, wird nur geprüft und nicht gespeichert.
- Der QR-Code funktioniert auf Handys erst, wenn die Seite im Internet erreichbar ist (nicht als lokale Datei).
- Es gibt keine Anmeldung mit Passwort. Das Dashboard ist direkt erreichbar.
- Das Zertifikat lässt sich erst ab dem Workshop-Beginn herunterladen. Davor ist der Button grau.
- Der Chatbot auf der Startseite beantwortet nur vorbereitete Standardfragen.

**Wie erkenne ich, dass alles funktioniert?** Die Datei `tests/runner.html` im Browser öffnen. Sie prüft die Programmlogik automatisch. Steht oben „ALLE TESTS BESTANDEN“, ist alles in Ordnung.

### Kleines Glossar

| Begriff | Bedeutung |
|---|---|
| Landingpage | Startseite, auf der Besucher den Workshop kennenlernen und buchen |
| Dashboard | Übersichts- und Verwaltungsseite für angemeldete Firmen |
| Demo | Vorführ-Version ohne echte Buchungen und ohne Server |
| Browser | Programm zum Anzeigen von Webseiten (Edge, Chrome, Firefox) |
| `localStorage` | Kleiner Speicher im Browser; hier liegen die Eingaben, nur auf Ihrem Rechner |
| Backend | Server im Hintergrund, der Daten speichert. Gibt es hier nicht. |
| Tenant-Check | Prüfung der Microsoft-365-Lizenzen einer Firma anhand einer hochgeladenen Datei |
| QR-Code | Quadratisches Bild, das ein Handy scannt und das direkt auf die Teilnehmer-Seite führt |
| Tenant-Report | Die Datei (CSV/Excel), die aus dem Microsoft 365 Admin Center exportiert wird |
| CSV / Excel | Gängige Tabellenformate (`.csv`, `.xlsx`, `.xls`) |
| Countdown | Rückwärtszähler bis zum Workshop-Beginn |
| Dark-/Light-Mode | Dunkle oder helle Darstellung der Seite |
| Test (automatisch) | Kleines Programm, das prüft, ob eine Funktion das Richtige tut |
| TDD | Arbeitsweise: erst den Test schreiben, dann die Funktion |
| UMD, Canvas, URL-Parameter | Technische Begriffe aus Abschnitt 3 ff. (für Entwickler, zum Verstehen nicht nötig) |

Die folgenden Abschnitte 1 bis 11 richten sich an Entwickler und Projektverantwortliche, die es genauer wissen wollen.

## 1. Projektüberblick

Das Workshopportal ist eine Click-Through-Demo der sey-IT. Firmenkunden buchen den „Microsoft License Pro Workshop“ und melden bis zu 20 Teilnehmer pro Termin an. Es gibt ausschließlich Firmenkunden, keine Privatpersonen.

| Eigenschaft | Wert |
|---|---|
| Workshop | Microsoft License Pro Workshop |
| Termine | 18.11.2026 und 25.11.2026, getrennt buchbar |
| Beginn | 9:00 Uhr (Annahme, nicht bestätigt) |
| Zielgruppe | Firmenkunden |
| Teilnehmer | max. 20 pro Buchung |
| Sprachen | Deutsch, Englisch |
| Design | Dark-/Light-Mode, Akzentfarbe Orange `#ff6600` |
| Technik | HTML, CSS und JavaScript ohne Build-Schritt und ohne Backend |

Es werden keine Pakete installiert und kein Server benötigt. Die Seiten laufen direkt aus dem Dateisystem im Browser. Für das offizielle sey-IT-Logo (von sey-it.com) ist eine Internetverbindung nötig.

## 2. Nutzerablauf

1. Die Landingpage `Landingpage/index.html` zeigt zwei Workshop-Karten, je eine pro Termin.
2. „Workshop buchen“ führt direkt zum Firmen-Dashboard. Der gewählte Termin, das Theme und die Sprache werden als URL-Parameter (`course`, `theme`, `lang`) übergeben. Es gibt keine Anmeldung und keine Rollenabfrage.
3. Im Firmen-Dashboard werden Termine gebucht oder storniert, Teilnehmer angemeldet, der Tenant-Report bereitgestellt und die Buchung geteilt. Das Teilnahmezertifikat gibt es nur in der Teilnehmer-Ansicht.
4. „Abmelden“ führt zurück zur Landingpage.
5. Teilnehmer-Weg: Der QR-Code (aus `QR-Code/qr-code-generator.html`) führt auf `firmen-dashboard.html?participant=<Termin-ID>&k=<Prüfwerte>`. Der Generator liest dafür die im Dashboard angemeldeten Teilnehmer des Termins und hängt je Name einen 8-stelligen Prüfwert (FNV-1a aus Termin-ID und Vor- und Nachname, ohne Beachtung von Groß-/Kleinschreibung und doppelten Leerzeichen) an, nie den Namen selbst. Die Ansicht fragt Vorname, Nachname und geschäftliche E-Mail-Adresse ab. Die E-Mail-Adresse wird nur auf gültiges Format geprüft und nicht mit der Anmeldung verglichen, da sie von der angemeldeten Adresse abweichen kann. Passt der Prüfwert des eingegebenen Namens, erscheinen Zertifikat-Download (ab Workshop-Beginn) und Teilen-Buttons für LinkedIn, Facebook und Instagram. Firmenbereich, Buchungen und Tenant-Check sind ausgeblendet; die Eingaben werden nicht gespeichert. Ändern sich die Anmeldungen, muss der QR-Code neu erstellt werden.

## 3. Projektstruktur

```text
.
├── Landingpage/
│   ├── index.html               Landingpage mit Chatbot, Gratis-Check, Feedback
│   └── hero-ohne-frau.jpg       Hintergrundbild des Hero-Bereichs
├── Firmen Dashboard/
│   ├── firmen-dashboard.html    Dashboard für Firmenkunden und Teilnehmer-Ansicht
│   └── hintergrund.jpg          dezentes Hintergrundbild
├── QR-Code/
│   └── qr-code-generator.html   QR-Code für PowerPoint als SVG oder PNG
├── Praesentation/
│   ├── Projekt-MLP.pptx         fünfseitige Präsentation im sey-IT-Design
│   └── ablauf-skizze.svg        Ablaufbild von der Buchung bis zum Zertifikat
├── shared/                      getestete Logik ohne DOM-Zugriff
│   ├── company-bookings.js
│   ├── tenant-report.js
│   ├── workshop-countdown.js
│   ├── share-links.js
│   ├── certificate.js
│   ├── participant-link.js
│   ├── qr-code.js
│   ├── sey-it-logo.js
│   ├── vendor/qrcode.js         Fremdbibliothek qrcode-generator 1.4.4 (MIT)
│   ├── landing-engagement.js
│   └── chat-intents.js
├── tests/                       je Modul eine Testdatei plus runner.html
├── translations.js              Texte Deutsch und Englisch, Sprachumschaltung
├── README.md
└── Projektdokumentation.md
```

## 4. Seiten

### 4.1 Landingpage

- Hero mit Überschrift, Terminliste und dem Slogan „ready → steady → sey-IT“ (orangefarbene Kreislauf-Pfeile, 10° gedreht, rechts im Hero) über dem festen Hintergrundbild. Die Tacho-Grafik wurde entfernt.
- Trust-Leiste: Bonus „Kostenloser Check“ (leicht vibrierend, hört beim Darüberfahren auf; bei reduzierter Bewegung deaktiviert) und „Bis zu 20 Teilnehmer“. Die Demo-Kachel entfällt.
- Abschnitt „So geht es weiter“ in drei Schritten zwischen Trust-Leiste und Workshops (der frühere Bereich „Für Unternehmen“ wurde entfernt).
- Zwei Workshop-Karten mit Termin und Button „Workshop buchen“. Eingeklappt zeigen sie Kategorie, Titel und Termin; die Beschreibung klappt beim Darüberfahren oder Fokussieren aus, der Button bleibt immer sichtbar.
- Kostenloser Check rechts neben den Workshop-Karten: Überschrift und Einleitung bleiben sichtbar, die Felder (E-Mail, Lizenzen, Software) klappen beim Darüberfahren aus. Mit Validierung; die Anfragen liegen nur im Browser. Auf Touch-Geräten ohne Hover ist alles aufgeklappt. Unter 900 px steht das Formular unter den Karten.
- Feedback in voller Breite: Sterne, Kommentar und Button in einer Zeile. 1–5 Sterne mit optionalem Kommentar, per Tastatur bedienbar. Angezeigt wird der Durchschnitt der lokal gespeicherten Bewertungen.
- Chatbot (nur auf der Landingpage): FAQ-Antworten zu Buchung, Firmenanmeldung, Gratis-Check, Tenant-Report, Terminen und Preisen. Unbekannte Fragen führen zu einer Fallback-Antwort.
- Kontaktbereich mit Link zur sey-IT-Anfrage.

### 4.2 Firmen-Dashboard

- **Countdown:** Der Text „Ihr Workshop ist in X Tagen“ zählt täglich um einen Kalendertag herunter. Er bezieht sich auf den nächsten gebuchten Termin und aktualisiert sich jede Minute. Am Termintag steht „Ihr Workshop ist heute“. Ohne Buchung erscheint ein Hinweis, nach Beginn eine Meldung.
- **Begrüßung:** „Guten Tag, Teilnehmer!“ passt sich an, sobald ein Teilnehmer angemeldet ist. Der Firmenname wird aus der E-Mail-Domain des ersten Teilnehmers abgeleitet (`anna@muster-software.com` ergibt „Muster Software“). Bei privaten Mail-Anbietern wie gmail.com oder web.de bleibt es bei „Teilnehmer“ (englisch „Participant“, Schlüssel `welcomeFallbackName`). Das gilt auch für „Angemeldet als“ im Kopf.
- **Buchungen:** Termine einzeln buchen und stornieren. Pro Termin gibt es bis zu 20 Teilnehmer mit Name und E-Mail, einen Auslastungsbalken und Fehlermeldungen bei ungültiger oder doppelter E-Mail und bei voller Buchung.
- **Teilnahmezertifikat:** Download als PDF (A4 quer) im sey-IT-Stil mit Name, Workshop und Termin, auf Deutsch oder Englisch. Der Download ist nur in der Teilnehmer-Ansicht (QR-Code) nach erfolgreicher Namensprüfung möglich, nicht im Firmenbereich des Dashboards. Der Button ist erst ab Workshop-Beginn aktiv und davor deaktiviert („Zertifikat ab Workshop-Beginn“).
- **Teilen-Leiste:** Am rechten Rand stehen Icons für Facebook, Instagram und LinkedIn in Orange, sichtbar bei vorhandener Buchung. Facebook und LinkedIn öffnen den Teilen-Dialog für `https://sey-it.com/`. Instagram hat keinen Web-Teilen-Link, daher wird der Text kopiert und Instagram geöffnet.
- **Tenant-Check:** Kurzanleitung zum Export aus dem Microsoft 365 Admin Center und Upload für `.csv`, `.xlsx` und `.xls` (max. 5 MB). In der Demo wird die Datei nicht übertragen. Er steht rechts neben den Buchungen und den buchbaren Workshops, beide Spalten schließen unten bündig ab (Container 1100 px; unter 900 px untereinander).
- **Teilnehmer-Ansicht:** Das Dashboard zeigt weder einen QR-Code noch einen Link zum Generator; sey-IT erstellt den Code separat mit `QR-Code/qr-code-generator.html`. Der Code kodiert `firmen-dashboard.html?participant=<Termin-ID>&k=<Prüfwerte>`. Mit diesem Parameter schaltet die Seite in die Teilnehmer-Ansicht (`body.participant-mode`): Firmenbereich, Teilen-Leiste und Abmelden sind ausgeblendet, es bleiben Vorname, Nachname, geschäftliche E-Mail-Adresse, nach erfolgreicher Prüfung der Zertifikat-Download und die Teilen-Buttons. Ein Link ohne Prüfwerte gilt als ungültig. Der Parameter `course` bucht dagegen weiterhin einen Termin, deshalb nutzt der QR-Code `participant`.
- Sprach- und Theme-Schalter.
- **Kopfleiste:** Unter dem Logo liegt ein statischer orangefarbener Streifen (4 px). Dasselbe gilt für die Landingpage.

## 5. Module in `shared/`

Alle Module sind UMD-Skripte. Sie laufen im Browser über ein `window.seyIt…`-Objekt und lassen sich zusätzlich in Node einbinden.

| Modul | Globales Objekt | Aufgabe |
|---|---|---|
| `company-bookings.js` | `seyItBookings` | Buchungen hinzufügen und entfernen, Teilnehmer validieren (Name, E-Mail, Duplikate, Limit 20), freie Plätze. Funktionen verändern ihre Eingaben nicht. |
| `tenant-report.js` | `seyItTenantReport` | Dateiendung und Größe prüfen, Größen formatieren. |
| `workshop-countdown.js` | `seyItCountdown` | `daysUntil` (Kalendertage, nie negativ, sommerzeitsicher), `splitRemainingTime`, `findNextStart`. |
| `share-links.js` | `seyItShare` | Teilen-Links, Share-Text und Zertifikats-Text (`buildCertificateShareText`) in Deutsch und Englisch. |
| `certificate.js` | `seyItCertificate` | `isCertificateAvailable`, `buildFileName`, `buildPdfFromJpeg` (PDF ohne externe Bibliothek). |
| `participant-link.js` | `seyItParticipantLink` | Teilnehmer-Link mit Prüfwerten bauen (`buildParticipantUrl`, `nameCheckValue`), Termin und Prüfwerte aus der URL lesen und Teilnehmer über Vor- und Nachnamen verifizieren (`verifyParticipant`). |
| `qr-code.js` | `seyItQr` | `buildQrPath` liefert Größe und SVG-Pfad eines QR-Codes (Fehlerkorrektur standardmäßig M, im Generator H, 4 Module Ruhezone) auf Basis von `vendor/qrcode.js`. `buildLogoPlacement` berechnet die weiße Fläche und die Position des Logos in der Mitte. |
| `sey-it-logo.js` | `seyItLogo` | Pfade des sey-IT-Logos (identisch mit `QR-Code/seyit-logo.svg`), lokal eingebettet, damit der PNG-Export ohne externe Bilder funktioniert. |
| `landing-engagement.js` | `seyItEngagement` | Validierung des Gratis-Checks, Bewertungslogik und Durchschnitt. |
| `chat-intents.js` | `seyItChatIntents` | Zuordnung von Fragen zu Antworten (ohne Beachtung der Groß-/Kleinschreibung). |

`vendor/qrcode.js` ist die unveränderte Bibliothek `qrcode-generator` 1.4.4 von Kazuhiko Arase (MIT-Lizenz). `QR-Code/qr-code-generator.html` erzeugt daraus den Export für PowerPoint: ein SVG oder PNG mit orangem, abgerundetem Rahmen (#ff6600, Ecken außerhalb transparent), der Überschrift „Hier zum Zertifikat“ und darunter dem Code mit sey-IT-Logo (38 % der Codebreite), für eine frei eingegebene Dashboard-Adresse und den gewählten Termin.

Das Zertifikat entsteht so: Das Dashboard zeichnet es auf ein Canvas (1754 × 1240 px), wandelt es in ein JPEG um und bettet es mit `buildPdfFromJpeg` in ein einseitiges PDF ein. Es lädt als `Teilnahmezertifikat-<Name>-<Datum>.pdf` herunter. Umlaute im Namen werden umgeschrieben (ä → ae).

## 6. Mehrsprachigkeit und Theme

- `translations.js` enthält alle Texte in Deutsch und Englisch. Elemente nutzen `data-i18n`, `data-i18n-placeholder` und `data-i18n-aria-label`. In Skripten übersetzt `seyItI18n.translate(key, values)` (Platzhalter wie `{days}`). Beim Wechsel wird das Ereignis `languagechange` ausgelöst.
- Sprache und Theme bleiben über URL-Parameter und `localStorage` (`seyItTheme`) beim Seitenwechsel erhalten.

| Eigenschaft | Light Mode | Dark Mode |
|---|---|---|
| Grundfarbe | `#ffffff` | `#26292e` |
| Haupttext | `#333333` | `#c8c8c8` |
| Logo | `seyit-logo.svg` | `seyit-logo-white.svg` |
| Bild-Overlay | `rgba(242, 244, 247, 0.9)` | `rgba(38, 41, 46, 0.9)` |

## 7. Datenhaltung

Es gibt kein Backend. Alle Daten liegen im `localStorage` des Browsers und werden nicht übertragen.

| Schlüssel | Inhalt |
|---|---|
| `seyItCompanyBookings` | Buchungen mit Termin-ID und Teilnehmern |
| `seyItFreeCheckRequests` | Anfragen des Gratis-Checks |
| `seyItFeedback` | Sternebewertungen und Kommentare |
| `seyItTheme` | gewähltes Theme |

Termin-IDs: `microsoft-licensing-1118` und `microsoft-licensing-1125`.

## 8. Qualitätssicherung

- Entwicklung nach TDD: Tests entstehen vor der Logik. Neue Logik liegt in `shared/`, getrennt von der Oberfläche.
- Aktueller Stand: 80 Tests, alle bestanden.
- `tests/runner.html` im Browser öffnen. Der Titel zeigt „ALLE TESTS BESTANDEN“ oder „TESTS FEHLGESCHLAGEN“, jeder Test erscheint als PASS oder FAIL. Bei Änderungen an `shared/*.js` gegebenenfalls zweimal neu laden.
- Alternativ mit Node.js: `node --test tests`. Das ist in dieser Umgebung nicht installiert und wurde hier nicht ausgeführt.

| Testdatei | Gegenstand |
|---|---|
| `company-bookings.test.js` | Buchungen und Teilnehmer |
| `tenant-report.test.js` | Dateiprüfung |
| `landing-engagement.test.js` | Gratis-Check und Bewertung |
| `chat-intents.test.js` | Chatbot-Antworten |
| `workshop-countdown.test.js` | Restzeit und Tageszählung |
| `share-links.test.js` | Teilen-Links und Texte |
| `certificate.test.js` | Verfügbarkeit, Dateiname, PDF-Aufbau |
| `participant-link.test.js` | Teilnehmer-Link, Prüfwerte und Verifizierung über den Namen |
| `qr-code.test.js` | Größe und Pfad des QR-Codes |

Die Oberfläche (Landingpage und Dashboard) ist ohne automatische Tests. Sie wurde manuell im Browser geprüft, zuletzt ohne JavaScript-Fehler in der Konsole. Die Handy-Ansicht war nicht prüfbar.

## 9. Entwicklungsregeln

- Tests vor der Funktionslogik (TDD).
- Arbeit in einem virtuellen Python-Environment (`venv`) und PEP8 für Python-Code. Dieses Projekt enthält keinen Python-Code.
- Selbstdokumentierender Code mit aussagekräftigen Namen. Kommentare sind neutral formuliert.
- Bei Architekturfragen gilt der objektiv beste Lösungsansatz.

## 10. Bekannte Einschränkungen und offene Punkte

- Es gibt weder Anmeldung noch Authentifizierung noch Benutzerverwaltung. Das Dashboard ist direkt erreichbar.
- Die Daten bleiben lokal im Browser und werden nicht an sey-IT übermittelt.
- Der Chatbot arbeitet mit lokalen FAQ-Antworten und ist nicht mit einem KI-Dienst verbunden. Die Chatbot-Antwort zu Zertifikaten fällt auf den Fallback zurück. Ein Intent mit Test lässt sich nachziehen.
- Das Zertifikat ist erst ab Workshop-Beginn ladbar. Das ist eine Annahme und vom Auftraggeber nicht bestätigt.
- Beginn 9:00 Uhr ist angenommen. Die Konstante `WORKSHOP_START_HOUR` und die Termine in `COURSES` (im Dashboard) legen sie fest.
- Der Countdown zählt Kalendertage: Er springt um Mitternacht und zeigt am 19.10.2026 für den 18.11. „30 Tage“.
- Der Dashboard-Kopf zeigt weiterhin „Angemeldet als Teilnehmer“, obwohl es keine Anmeldung gibt.
- Die über den QR-Code eingegebenen Daten werden nicht gespeichert; das Zertifikat wird direkt im Browser heruntergeladen. Ein Versand an die eingegebene E-Mail-Adresse oder eine Übermittlung an die Firma braucht ein Backend.
- Die Prüfung über Namen ist ein Demo-Schutz: Wer den QR-Code hat und einen angemeldeten Namen kennt, kann dessen Zertifikat abrufen. Ein echter Schutz erfordert eine serverseitige Prüfung.
- Der QR-Code führt auf die Adresse, die im Generator eingetragen wird. Bei einer lokalen Datei (`file:///…`) lässt er sich auf einem Handy nicht öffnen. Für den echten Einsatz muss das Portal im Internet gehostet sein; für einen Test im WLAN reicht ein lokaler Server (`python -m http.server`).
- Instagram unterstützt kein direktes Teilen per Link. Daher wird der Text kopiert und Instagram geöffnet.
- Preise werden nicht genannt, sie gibt es auf Anfrage.

## 11. Änderungsverlauf (Kurzfassung)

1. Rollen-Dashboards, Tenant-Check, Hero-Grafik, Trust-Leiste, Gratis-Check, Feedback und Chatbot auf der Landingpage.
2. Reduktion auf einen Workshop mit zwei getrennten Terminen.
3. Umstellung auf reine Firmenkunden: Login-, Zertifikats- und Privatseiten entfernt.
4. Countdown im Firmen-Dashboard, zunächst mit Tagen, Stunden, Minuten und Sekunden.
5. Hero-Grafik transparenter gemacht, Code und Übersetzungen aufgeräumt.
6. Teilen-Leiste für Facebook, Instagram und LinkedIn wieder eingebaut.
7. Tage-Countdown „Ihr Workshop ist in X Tagen“ und Zertifikat-Download im Dashboard.
8. Rollenabfrage beim Buchen entfernt: „Workshop buchen“ führt direkt ins Dashboard.
9. Landingpage umgebaut: Slogan statt Tacho-Grafik im Hero, ausklappende Workshop- und Check-Karten, Kostenloser Check neben den Workshops, breiteres Feedback, „So geht es weiter“ vor den Workshops, vibrierende Bonus-Kachel.
10. Teilnehmer-Ansicht für den QR-Code, Generator für PowerPoint, Tenant-Check neben die Buchungen verschoben, Begrüßung „Teilnehmer“.
11. Fortschrittsstreifen unter dem Logo auf Landingpage und Dashboard, Tenant-Check und letzte Workshop-Karte unten bündig, Ordner `Praesentation/` mit fünfseitiger PowerPoint und Ablaufbild.
12. Teilnehmer-Anmeldung mit Vorname, Nachname und geschäftlicher E-Mail; Streifen unter dem Logo statisch; QR-Code mit sey-IT-Logo, orangem abgerundetem Rahmen und Prüfwerten der angemeldeten Namen; Zertifikat-Download und QR-Link aus dem Firmenbereich entfernt (nur noch über den QR-Code); Teilen-Buttons nach erfolgreicher Namensprüfung; vollständiger MIT-Lizenztext der QR-Bibliothek.
