# Projektdokumentation: sey-IT Workshopportal

Stand: 19.10.2026

## 0. Kurz erklärt (ohne Fachwissen)

**Worum geht es?** Die sey-IT bietet einen Workshop zu Microsoft-Lizenzen an. Dieses Projekt ist eine Vorführ-Version (Demo) der Webseite, über die Firmen den Workshop buchen. Sie zeigt, wie der Ablauf später aussehen könnte. Echte Buchungen gibt es nicht.

**Wie sieht der Ablauf aus?**
1. Sie öffnen die Startseite (Landingpage). Dort stehen zwei Workshop-Termine: 18.11.2026 und 25.11.2026.
2. Sie klicken bei einem Termin auf „Workshop buchen“.
3. Sie landen im Firmen-Dashboard, der Verwaltungsseite der Firma. Dort melden Sie Mitarbeitende an (bis zu 20 pro Termin).
4. Das Dashboard zeigt, in wie vielen Tagen der Workshop beginnt, z. B. „Ihr Workshop ist in 30 Tagen“.
5. Nach dem Workshop kann für jede angemeldete Person ein Teilnahmezertifikat als PDF heruntergeladen werden.
6. Über die Symbole am rechten Rand lässt sich die Teilnahme auf Facebook, Instagram oder LinkedIn teilen.

**Wie probiere ich es aus?** Im Ordner `Landingpage` die Datei `index.html` per Doppelklick öffnen. Es ist nichts zu installieren. Das sey-IT-Logo wird aus dem Internet geladen, die Seite braucht also eine Internetverbindung.

**Was ist wichtig zu wissen?**
- Alles, was Sie eingeben, bleibt nur in Ihrem eigenen Browser und wird nirgendwohin gesendet.
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
3. Im Firmen-Dashboard werden Termine gebucht oder storniert, Teilnehmer angemeldet, der Tenant-Report bereitgestellt, das Teilnahmezertifikat geladen und die Buchung geteilt.
4. „Abmelden“ führt zurück zur Landingpage.

## 3. Projektstruktur

```text
.
├── Landingpage/
│   ├── index.html               Landingpage mit Chatbot, Gratis-Check, Feedback
│   ├── hero-grafik.svg          mitscrollende Tacho-Grafik
│   └── hero-ohne-frau.jpg       Hintergrundbild des Hero-Bereichs
├── Firmen Dashboard/
│   ├── firmen-dashboard.html    Dashboard für Firmenkunden
│   └── hintergrund.jpg          dezentes Hintergrundbild
├── shared/                      getestete Logik ohne DOM-Zugriff
│   ├── company-bookings.js
│   ├── tenant-report.js
│   ├── workshop-countdown.js
│   ├── share-links.js
│   ├── certificate.js
│   ├── landing-engagement.js
│   └── chat-intents.js
├── tests/                       je Modul eine Testdatei plus runner.html
├── translations.js              Texte Deutsch und Englisch, Sprachumschaltung
├── README.md
└── Projektdokumentation.md
```

## 4. Seiten

### 4.1 Landingpage

- Hero mit Überschrift, Terminliste und halbtransparenter Tacho-Grafik (`opacity: 0.6`) über dem festen Hintergrundbild.
- Trust-Leiste: Bonus „Kostenloser Check“, „Bis zu 20 Teilnehmer“, Demo-Hinweis.
- Zwei Workshop-Karten mit Termin und Button „Workshop buchen“.
- Abschnitt „So geht es weiter“ in drei Schritten direkt unter den Workshop-Karten (der frühere Bereich „Für Unternehmen“ wurde entfernt).
- Kostenloser Check: Formular mit E-Mail, Lizenzen und Software, mit Validierung. Die Anfragen liegen nur im Browser.
- Feedback: 1–5 Sterne mit optionalem Kommentar, per Tastatur bedienbar. Angezeigt wird der Durchschnitt der lokal gespeicherten Bewertungen.
- Chatbot (nur auf der Landingpage): FAQ-Antworten zu Buchung, Firmenanmeldung, Gratis-Check, Tenant-Report, Terminen und Preisen. Unbekannte Fragen führen zu einer Fallback-Antwort.
- Kontaktbereich mit Link zur sey-IT-Anfrage.

### 4.2 Firmen-Dashboard

- **Countdown:** Der Text „Ihr Workshop ist in X Tagen“ zählt täglich um einen Kalendertag herunter. Er bezieht sich auf den nächsten gebuchten Termin und aktualisiert sich jede Minute. Am Termintag steht „Ihr Workshop ist heute“. Ohne Buchung erscheint ein Hinweis, nach Beginn eine Meldung.
- **Begrüßung:** „Guten Tag, Firma!“ passt sich an, sobald ein Teilnehmer angemeldet ist. Der Firmenname wird aus der E-Mail-Domain des ersten Teilnehmers abgeleitet (`anna@muster-software.com` ergibt „Muster Software“). Bei privaten Mail-Anbietern wie gmail.com oder web.de bleibt es bei „Firma“. Das gilt auch für „Angemeldet als“ im Kopf.
- **Buchungen:** Termine einzeln buchen und stornieren. Pro Termin gibt es bis zu 20 Teilnehmer mit Name und E-Mail, einen Auslastungsbalken und Fehlermeldungen bei ungültiger oder doppelter E-Mail und bei voller Buchung.
- **Teilnahmezertifikat:** Pro angemeldetem Teilnehmer gibt es einen Download als PDF (A4 quer) im sey-IT-Stil mit Name, Workshop und Termin, auf Deutsch oder Englisch. Der Button ist erst ab Workshop-Beginn aktiv und davor deaktiviert („Zertifikat ab Workshop-Beginn“).
- **Teilen-Leiste:** Am rechten Rand stehen Icons für Facebook, Instagram und LinkedIn in Orange, sichtbar bei vorhandener Buchung. Facebook und LinkedIn öffnen den Teilen-Dialog für `https://sey-it.com/`. Instagram hat keinen Web-Teilen-Link, daher wird der Text kopiert und Instagram geöffnet.
- **Tenant-Check:** Kurzanleitung zum Export aus dem Microsoft 365 Admin Center und Upload für `.csv`, `.xlsx` und `.xls` (max. 5 MB). In der Demo wird die Datei nicht übertragen.
- Sprach- und Theme-Schalter.

## 5. Module in `shared/`

Alle Module sind UMD-Skripte. Sie laufen im Browser über ein `window.seyIt…`-Objekt und lassen sich zusätzlich in Node einbinden.

| Modul | Globales Objekt | Aufgabe |
|---|---|---|
| `company-bookings.js` | `seyItBookings` | Buchungen hinzufügen und entfernen, Teilnehmer validieren (Name, E-Mail, Duplikate, Limit 20), freie Plätze. Funktionen verändern ihre Eingaben nicht. |
| `tenant-report.js` | `seyItTenantReport` | Dateiendung und Größe prüfen, Größen formatieren. |
| `workshop-countdown.js` | `seyItCountdown` | `daysUntil` (Kalendertage, nie negativ, sommerzeitsicher), `splitRemainingTime`, `findNextStart`. |
| `share-links.js` | `seyItShare` | Teilen-Links und Share-Text in Deutsch und Englisch. |
| `certificate.js` | `seyItCertificate` | `isCertificateAvailable`, `buildFileName`, `buildPdfFromJpeg` (PDF ohne externe Bibliothek). |
| `landing-engagement.js` | `seyItEngagement` | Validierung des Gratis-Checks, Bewertungslogik und Durchschnitt. |
| `chat-intents.js` | `seyItChatIntents` | Zuordnung von Fragen zu Antworten (ohne Beachtung der Groß-/Kleinschreibung). |

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
- Aktueller Stand: 62 Tests, alle bestanden.
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
- Das Zertifikat ist pro Teilnehmer erst ab Workshop-Beginn ladbar. Das ist eine Annahme und vom Auftraggeber nicht bestätigt.
- Beginn 9:00 Uhr ist angenommen. Die Konstante `WORKSHOP_START_HOUR` und die Termine in `COURSES` (im Dashboard) legen sie fest.
- Der Countdown zählt Kalendertage: Er springt um Mitternacht und zeigt am 19.10.2026 für den 18.11. „30 Tage“.
- Der Dashboard-Kopf zeigt weiterhin „Angemeldet als Firma“, obwohl es keine Anmeldung gibt.
- Instagram unterstützt kein direktes Teilen per Link. Daher wird der Text kopiert und Instagram geöffnet.
- Der leere Ordner `Anmelde Page` ist von Windows gesperrt und muss von Hand gelöscht werden.
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
