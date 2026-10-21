# Dateiübersicht: Was jede Datei macht und wie alles zusammenhängt

Diese Übersicht erklärt jede Datei im Projektordner. Die Fachbegriffe stehen im Glossar der [Projektdokumentation](./Projektdokumentation.md).

## 1. Das Ganze in einem Bild

Das Projekt hat zwei Seiten, die der Besucher sieht, und ein Werkzeug für den QR-Code. Alle greifen auf gemeinsame Bausteine zurück.

```text
              translations.js  (alle Texte, DE + EN)
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
 Landingpage/index.html   Firmen Dashboard/firmen-dashboard.html ◄── QR-Code scannen
        │                        │        (?participant=…)            ▲
        │  „Workshop buchen“     │                                    │
        └───────────────────────►│   (Termin, Sprache, Theme per Link)│
                                 │                                    │
                                 │ Anmeldungen (localStorage)         │
                                 └──────────► QR-Code/qr-code-generator.html
                                                                      
   nutzen Rechenbausteine aus shared/
        │                        │                         │
        ▼                        ▼                         ▼
  landing-engagement.js     company-bookings.js       qr-code.js
  chat-intents.js           tenant-report.js          sey-it-logo.js
                            workshop-countdown.js     participant-link.js
                            share-links.js
                            certificate.js
                            participant-link.js

 tests/runner.html  ──►  prüft alle Bausteine in shared/ mit den *.test.js
```

Die Seiten zeigen etwas an und nehmen Eingaben entgegen. Die Rechenbausteine in `shared/` entscheiden, was richtig ist (z. B. „ist diese E-Mail gültig?“ oder „wie viele Tage sind es noch?“). Die Tests prüfen nur diese Bausteine.

### Ablauf in 7 Schritten

1. **Workshop buchen:** Die Firma wählt auf der Landingpage (`Landingpage/index.html`) einen Termin und klickt „Workshop buchen“. Das Firmen-Dashboard öffnet sich und bucht den Termin.
2. **Teilnehmer anmelden:** Im Dashboard meldet die Firma bis zu 20 Teilnehmer mit Vorname, Nachname und geschäftlicher E-Mail-Adresse an (z. B. die Telekom mit Telekom-Adressen). Im Dashboard gibt es keinen Zertifikat-Download.
3. **QR-Code erzeugen:** sey-IT öffnet `QR-Code/qr-code-generator.html` im selben Browser, wählt den Seminartermin und lädt den QR-Code mit sey-IT-Logo und orangem Rahmen als SVG oder PNG herunter. Der Code enthält Prüfwerte der angemeldeten Namen, nie die Namen selbst.
4. **Auf die Folie setzen:** Der QR-Code kommt pro Seminar auf die letzte Seite der Präsentation.
5. **Scannen:** Nach dem Workshop scannen die Teilnehmer den Code und landen auf der Teilnehmer-Ansicht (`firmen-dashboard.html?participant=<Termin>&k=<Prüfwerte>`). Diese Ansicht ist nur über den QR-Code erreichbar.
6. **Eingeben und prüfen:** Der Teilnehmer gibt Vorname, Nachname und E-Mail-Adresse ein. Geprüft wird nur der Name (Groß-/Kleinschreibung und Leerzeichen egal). Die E-Mail-Adresse muss nur gültig sein und darf von der angemeldeten abweichen. Sie wird weder gespeichert noch übermittelt.
7. **Zertifikat und Teilen:** Passt der Name, lädt der Teilnehmer sein Zertifikat als PDF herunter (ab Workshop-Beginn) und kann den Erfolg auf LinkedIn, Facebook oder Instagram teilen.

Ändern sich die Anmeldungen nach Schritt 3, muss der QR-Code neu erzeugt werden.

## 2. Alle Dateien im Überblick

| Datei | Zweck in einem Satz |
|---|---|
| `Landingpage/index.html` | Startseite für Besucher |
| `Landingpage/hero-ohne-frau.jpg` | Hintergrundbild der Startseite |
| `Firmen Dashboard/firmen-dashboard.html` | Verwaltungsseite der Firma |
| `Firmen Dashboard/hintergrund.jpg` | Hintergrundbild des Dashboards |
| `QR-Code/qr-code-generator.html` | Eigenständiges Werkzeug: erzeugt den QR-Code für PowerPoint als SVG oder PNG |
| `Praesentation/Projekt-MLP.pptx` | Fünfseitige Präsentation im sey-IT-Design |
| `Praesentation/ablauf-skizze.svg` | Ablaufbild von der Buchung bis zum Zertifikat |
| `translations.js` | Alle Texte auf Deutsch und Englisch, plus Sprachumschaltung |
| `shared/company-bookings.js` | Regeln für Buchungen und Teilnehmer, Firmenname |
| `shared/tenant-report.js` | Prüfung der hochgeladenen Report-Datei |
| `shared/workshop-countdown.js` | Rechnet die Tage bis zum Workshop aus |
| `shared/share-links.js` | Baut die Teilen-Links für soziale Netzwerke |
| `shared/certificate.js` | Zertifikat: Freigabe, Dateiname, PDF-Erzeugung |
| `shared/participant-link.js` | Teilnehmer-Link (QR-Ziel) mit Prüfwerten und Prüfung über Vor- und Nachnamen |
| `shared/qr-code.js` | Wandelt einen Text in einen SVG-Pfad für den QR-Code um und berechnet die Logo-Position in der Mitte |
| `shared/sey-it-logo.js` | sey-IT-Logo als eingebettete SVG-Pfade für den QR-Code-Generator (gleiche Pfade wie `QR-Code/seyit-logo.svg`) |
| `QR-Code/seyit-logo.svg` | Vorlage des sey-IT-Logos, aus der die Pfade in `shared/sey-it-logo.js` stammen |
| `shared/vendor/qrcode.js` | Fremdbibliothek `qrcode-generator` 1.4.4 (MIT-Lizenz, Kazuhiko Arase) |
| `shared/landing-engagement.js` | Regeln für Gratis-Check und Sternebewertung |
| `shared/chat-intents.js` | Entscheidet, welche Antwort der Chatbot gibt |
| `tests/runner.html` | Startet alle Tests im Browser und zeigt das Ergebnis |
| `tests/*.test.js` (9 Dateien) | Die eigentlichen Tests, je eine pro Baustein |
| `README.md` | Kurzanleitung zum Projekt |
| `Projektdokumentation.md` | Ausführliche Dokumentation, auch für Laien |
| `Dateiuebersicht.md` | Diese Datei |

## 3. Die Seiten

### `Landingpage/index.html`
Die Startseite, mit der Besucher beginnen. Sie enthält den Kopf mit Navigation, Sprach- und Theme-Schalter, den Hero-Bereich, die zwei Workshop-Karten, den Abschnitt „So geht es weiter“, Gratis-Check, Feedback, Kontaktband und den Chatbot. Aussehen (CSS) und Seitenlogik (JavaScript) stehen direkt in dieser Datei. Unter dem Logo liegt ein statischer orangefarbener Streifen, der auch im Dashboard steckt.

- **Bindet ein:** `translations.js`, `shared/landing-engagement.js`, `shared/chat-intents.js`.
- **Nutzt als Bild:** `hero-ohne-frau.jpg` aus dem eigenen Ordner.
- **Verbindung zum Dashboard:** „Workshop buchen“ öffnet das Dashboard und hängt Termin, Sprache und Theme an den Link (`?course=…&lang=…&theme=…`).
- **Speichert im Browser:** Gratis-Check-Anfragen, Feedback und das gewählte Theme.

### `Landingpage/hero-ohne-frau.jpg`
Das feste Hintergrundbild der Startseite. Der Name verweist darauf, dass die Person am rechten Rand entfernt wurde. Wird nur von `index.html` genutzt.

### `Firmen Dashboard/firmen-dashboard.html`
Die Seite, die nach „Workshop buchen“ erscheint. Sie enthält Begrüßung, Countdown, Buchungskarten mit Teilnehmerliste, Tenant-Check-Upload und die Teilen-Leiste am Rand. Über den QR-Code-Link (`?participant=`) zeigt dieselbe Datei die Teilnehmer-Ansicht mit dem Zertifikat-Download. Aussehen und Seitenlogik stehen ebenfalls in der Datei selbst.

- **Bindet ein:** `translations.js`, `shared/company-bookings.js`, `shared/tenant-report.js`, `shared/workshop-countdown.js`, `shared/share-links.js`, `shared/certificate.js`, `shared/participant-link.js`.
- **Nutzt als Bild:** `hintergrund.jpg` aus dem eigenen Ordner.
- **Verbindung zur Landingpage:** Der Link „Abmelden“ führt zurück.
- **Speichert im Browser:** Buchungen und Teilnehmer, das gewählte Theme.
- **Ablauf beim Öffnen:** Gespeicherte Buchungen laden, den übergebenen Termin automatisch buchen, alles anzeigen. Bei jeder Änderung wird alles neu gezeichnet: Begrüßung, Countdown, Buchungskarten und Teilen-Leiste.

### `Firmen Dashboard/hintergrund.jpg`
Dezentes Hintergrundbild hinter dem Dashboard. Es scheint durch ein 90-prozentiges Overlay hindurch.

### `QR-Code/qr-code-generator.html`
Eigenständiges Werkzeug für sey-IT, ohne Link aus dem Dashboard. Es liest die Anmeldungen des gewählten Termins aus `seyItCompanyBookings` im selben Browser und erzeugt den QR-Code mit sey-IT-Logo (Fehlerkorrektur H, Logo 38 % der Codebreite) und orangem, abgerundetem Rahmen (Ecken transparent) als SVG oder PNG für die letzte Präsentationsfolie.

- **Bindet ein:** `shared/vendor/qrcode.js`, `shared/qr-code.js`, `shared/sey-it-logo.js`, `shared/participant-link.js`.

## 4. Texte und Sprache

### `translations.js`
Die einzige Datei mit sichtbaren Texten, getrennt nach Deutsch und Englisch. Beide Seiten binden sie ein. In den Seiten steht ein Textschlüssel (z. B. `courseAction`), und die Datei liefert den passenden Text. Sie schaltet auch die Sprache um und merkt sich die Wahl.

Wer einen Text ändern will, ändert ihn hier, nicht in den Seiten. Neue Texte müssen in beiden Sprachen angelegt werden.

## 5. Die Rechenbausteine in `shared/`

Diese Dateien greifen weder auf Seitenelemente zu noch zeichnen sie etwas. Sie bekommen Werte, rechnen und liefern ein Ergebnis. Deshalb lassen sie sich automatisch testen. Jede Datei hat genau eine Testdatei.

| Baustein | Genutzt von | Getestet durch | Was er kann |
|---|---|---|---|
| `company-bookings.js` | Dashboard | `company-bookings.test.js` | Termin buchen und stornieren, Teilnehmer anmelden und entfernen (Name nötig, E-Mail gültig und nicht doppelt, höchstens 20), freie Plätze zählen, Firmenname aus der E-Mail-Domain ableiten |
| `tenant-report.js` | Dashboard | `tenant-report.test.js` | Prüft, ob eine Datei `.csv`, `.xlsx` oder `.xls` ist, nicht leer und höchstens 5 MB. Formatiert die Dateigröße für die Anzeige |
| `workshop-countdown.js` | Dashboard | `workshop-countdown.test.js` | Findet den nächsten Starttermin, rechnet die Tage bis dahin aus (nie negativ, auch bei Zeitumstellung korrekt) und teilt Restzeit in Tage, Stunden, Minuten, Sekunden |
| `share-links.js` | Dashboard | `share-links.test.js` | Baut Links für Facebook und LinkedIn und den Teilen-Text auf Deutsch und Englisch. Instagram kennt keinen Link, dafür liefert der Baustein die Startseite |
| `certificate.js` | Dashboard | `certificate.test.js` | Sagt, ob das Zertifikat schon verfügbar ist (ab Workshop-Beginn), bildet den Dateinamen und baut aus einem Bild ein PDF |
| `participant-link.js` | Dashboard, QR-Generator | `participant-link.test.js` | Baut den Teilnehmer-Link mit Prüfwerten der Namen, liest Termin und Prüfwerte aus der URL und prüft den eingegebenen Vor- und Nachnamen |
| `qr-code.js` | QR-Generator | `qr-code.test.js` | Wandelt einen Text in einen QR-Code-Pfad um und berechnet die Fläche für das Logo in der Mitte |
| `landing-engagement.js` | Landingpage | `landing-engagement.test.js` | Prüft die Gratis-Check-Eingaben, prüft die Sternezahl (1–5) und berechnet den Durchschnitt |
| `chat-intents.js` | Landingpage | `chat-intents.test.js` | Ordnet eine Chat-Frage einem Thema zu und liefert den Schlüssel der passenden Antwort. Ohne Treffer kommt die Fallback-Antwort |

Zusammenspiel am Beispiel des Zertifikats: Das Dashboard zeichnet das Zertifikat selbst auf eine Zeichenfläche und wandelt sie in ein Bild um. `certificate.js` macht daraus das PDF und den Dateinamen und sagt dem Dashboard, ob der Button aktiv sein darf. Alle Texte darauf kommen aus `translations.js`.

Der Chatbot funktioniert ähnlich: Die Landingpage gibt die Frage an `chat-intents.js` und erhält einen Textschlüssel. Den Text dazu holt sie aus `translations.js`.

## 6. Die Tests

### `tests/runner.html`
Öffnen Sie diese Datei im Browser, um alle Tests zu starten. Sie lädt jeden Baustein aus `shared/` und danach jede Testdatei. Die Ergebnisse stehen als PASS oder FAIL auf der Seite, und der Titel zeigt „ALLE TESTS BESTANDEN“ oder „TESTS FEHLGESCHLAGEN“. Sie enthält eine kleine eigene Prüffunktion, damit keine Test-Bibliothek nötig ist.

### `tests/*.test.js`
Je eine Testdatei pro Baustein: `company-bookings`, `tenant-report`, `landing-engagement`, `chat-intents`, `workshop-countdown`, `share-links`, `certificate`, `participant-link`, `qr-code`. Jeder Test beschreibt ein erwartetes Verhalten in einem Satz, z. B. „der 21. Teilnehmer wird abgelehnt“. Neue Bausteine brauchen eine Testdatei und einen Eintrag im Runner.

Reihenfolge der Arbeit: erst den Test schreiben, dann den Baustein, damit er besteht (TDD).

## 7. Die Dokumentation

| Datei | Für wen | Inhalt |
|---|---|---|
| `README.md` | Alle, die schnell starten wollen | Struktur, Starten, Tests, Funktionsliste, Einschränkungen |
| `Projektdokumentation.md` | Alle, auch ohne Vorwissen | Erklärung in einfachen Worten, Glossar, Seiten, Bausteine, Datenhaltung, offene Punkte, Verlauf |
| `Dateiuebersicht.md` | Alle, die sich in den Dateien zurechtfinden wollen | Diese Datei |

## 8. Wo liegt was beim Ändern?

| Ich möchte … | Dann ändere ich … |
|---|---|
| einen Text ändern | `translations.js` (Deutsch und Englisch) |
| einen Workshop-Termin ändern | In beiden Seiten die Termine: `COURSES` im Dashboard, Workshop-Karten und Hero-Liste auf der Landingpage, dazu die Datumstexte in `translations.js` |
| die Startzeit ändern | `WORKSHOP_START_HOUR` im Dashboard |
| die Teilnehmergrenze ändern | `MAX_PARTICIPANTS` in `shared/company-bookings.js` (Test anpassen) |
| erlaubte Dateitypen oder Größe des Reports ändern | `shared/tenant-report.js` (Test anpassen) |
| eine neue Chatbot-Frage ergänzen | `shared/chat-intents.js` und die Antworttexte in `translations.js` (Test ergänzen) |
| das Zertifikat gestalten | Funktion `drawCertificate` im Dashboard und die Zertifikat-Texte in `translations.js` |
| die Farben ändern | CSS-Variablen am Anfang der jeweiligen Seite (Theme-Abschnitt) |
| ein Hintergrundbild tauschen | `hero-ohne-frau.jpg` oder `hintergrund.jpg` ersetzen, Dateiname beibehalten |

## 9. Gespeicherte Daten

Alles bleibt im Browser des Besuchers (`localStorage`) und wird nirgends hingesendet. Was Teilnehmer über den QR-Code eingeben (Name, E-Mail-Adresse), wird nur geprüft und nicht gespeichert.

| Schlüssel | Geschrieben von | Inhalt |
|---|---|---|
| `seyItCompanyBookings` | Dashboard | Buchungen mit Teilnehmern (liest auch der QR-Generator) |
| `seyItFreeCheckRequests` | Landingpage | Gratis-Check-Anfragen |
| `seyItFeedback` | Landingpage | Sternebewertungen und Kommentare |
| `seyItTheme` | Beide Seiten | Dark oder Light |
| `seyItLanguage` | Beide Seiten | Deutsch oder Englisch |

Die Sprache und das Theme werden zusätzlich über den Seitenlink weitergegeben, damit sie beim Wechsel zwischen den Seiten erhalten bleiben.
