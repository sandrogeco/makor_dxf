# XY Chart - DXF Viewer

Un widget web interattivo per visualizzare dati XY da file DXF con parsing diretto nel browser, oppure tramite file CSV pre-generati.

## Struttura del Progetto

```
makor_dxf/
├── widget/
│   └── index.html       # Widget principale di visualizzazione
├── data/
│   └── output.csv       # File CSV con i dati da visualizzare
├── docs/                # Documentazione aggiuntiva
└── README.md            # Questo file
```

## Funzionalità

### Caricamento Dati
- **Upload DXF diretto**: Carica file DXF direttamente dal browser (parsing JavaScript)
- **Supporto CSV**: Carica dati da file CSV pre-generati
- **Parsing real-time**: Estrae punti da entità DXF (Spline, Line, Arc, Polyline)
- **Interpolazione automatica**: Converte curve in punti discreti
- **Fattore di scala**: Applica scala 1000x ai punti (configurabile)

### Visualizzazione
- **Grafico XY interattivo** con rendering su canvas HTML5
- **Design moderno** con tema scuro e gradients cyan/blue
- **Info dettagliate**: Mostra numero di punti, spline, linee e archi processati

### Controlli Zoom
- **Zoom X**: Controlli indipendenti per l'asse X (pulsanti + slider)
- **Zoom Y**: Controlli indipendenti per l'asse Y (pulsanti + slider)
- Range zoom: da 0.1x a 10x
- Zoom con rotellina mouse (Shift per asse Y)

### Controlli Pan
- **Pan X**: Spostamento orizzontale del grafico
- **Pan Y**: Spostamento verticale del grafico
- Drag and drop con mouse per pan interattivo
- Pulsanti reset per ogni asse

### AutoScale
- **AutoScale X**: Adatta automaticamente la scala dell'asse X ai dati
- **AutoScale Y**: Adatta automaticamente la scala dell'asse Y ai dati
- Disattivabile per controllo manuale

### Info Panel
- Numero di punti dati caricati
- Livelli zoom correnti (X e Y)
- Offset pan correnti (X e Y)
- Stato AutoScale

## Utilizzo

### Aprire il Widget

1. Apri il file `widget/index.html` in un browser web moderno (Chrome, Firefox, Edge, Safari)
2. Scegli una delle due modalità di caricamento dati:

#### Modalità 1: Upload File DXF (Raccomandato)
1. Clicca sul pulsante **"📁 Carica File DXF"**
2. Seleziona un file `.dxf` dal tuo computer
3. Il widget parsarà automaticamente il file ed estrarrà i punti
4. I dati verranno visualizzati immediatamente sul grafico

**Entità DXF Supportate**:
- SPLINE (con interpolazione)
- LINE
- ARC
- LWPOLYLINE
- POLYLINE

#### Modalità 2: File CSV Pre-generato
1. Posiziona il tuo file CSV in `data/output.csv`
2. Clicca su **"🔄 Ricarica CSV"**
3. (Opzionale) L'auto-refresh è disabilitato di default, decommentare nel codice se necessario

### Formato CSV

Il file CSV deve avere il seguente formato:

```csv
X,Y
0.0,0.0
10.5,15.3
20.8,28.7
...
```

- **Header obbligatorio**: La prima riga deve contenere `X,Y`
- **Due colonne**: Valori X e Y separati da virgola
- **Numeri decimali**: Usare il punto (.) come separatore decimale

### Controlli Interattivi

#### Zoom
- **Pulsanti Zoom In/Out**: Clic per zoom incrementale
- **Slider**: Trascinare per controllo preciso del livello di zoom
- **Rotellina mouse**: Scroll per zoom X, Shift+Scroll per zoom Y

#### Pan
- **Pulsanti direzionali**: Spostamento in passi fissi
- **Drag con mouse**: Trascina il grafico quando AutoScale è disattivato
- **Reset**: Riporta il pan a 0 per l'asse selezionato

#### AutoScale
- **Toggle AutoScale X/Y**: Clic per attivare/disattivare
- **Reset Tutto**: Ripristina tutti i controlli ai valori default

## Requisiti Tecnici

- Browser moderno con supporto HTML5 Canvas
- JavaScript abilitato
- Connessione internet (per i font Google Fonts)

### Browser Compatibili
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Personalizzazione

### Parametri DXF Parser

Nel file `widget/index.html`, linee ~781-782:

```javascript
const INTERPOLATION_STEP = 0.005;  // Precisione interpolazione (più basso = più punti)
const SCALE_FACTOR = 1000.0;       // Fattore moltiplicativo per i punti
```

- **INTERPOLATION_STEP**: Distanza minima tra punti interpolati (default: 0.005)
  - Valori più bassi = più punti = maggiore precisione
  - Valori più alti = meno punti = processamento più veloce
- **SCALE_FACTOR**: Moltiplica tutti i valori X e Y (default: 1000.0)
  - Utile per convertire unità (es. mm → µm)

### Modifica Percorso CSV

Nel file `widget/index.html`, linea ~407:

```javascript
fetch('../data/output.csv?' + new Date().getTime())
```

Cambiare il percorso per puntare a un diverso file CSV.

### Abilita Auto-Refresh CSV

Nel file `widget/index.html`, linee ~1001-1004:

```javascript
// Decommentare per abilitare caricamento automatico CSV all'avvio
// loadCSVData();

// Decommentare per abilitare auto-refresh ogni 2 secondi
// setInterval(loadCSVData, 2000);
```

### Personalizzazione Colori

Le variabili CSS nel tag `<style>` controllano i colori:

```css
:root {
    --bg-primary: #0a0e1a;
    --bg-secondary: #131824;
    --bg-tertiary: #1a2030;
    --accent-blue: #00d4ff;
    --accent-cyan: #00ffaa;
    --text-primary: #e8edf4;
    --text-secondary: #8a94a8;
    --border-color: #2a3447;
}
```

## Sviluppo

### Server Locale

Per evitare problemi CORS, è consigliato usare un server web locale:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Quindi aprire `http://localhost:8000/widget/index.html`

## Architettura DXF Parser

### Traduzione da C# a JavaScript

Il parser DXF JavaScript è una traduzione fedele dello script C# originale che utilizza la libreria `netDxf`. Ecco le equivalenze:

| Funzionalità C# | Implementazione JavaScript |
|----------------|----------------------------|
| `netDxf.DxfDocument.Load()` | `dxf-parser` library (CDN) |
| `InterpolateLine()` | Identica logica matematica |
| `InterpolateArc()` | Identica logica con angoli |
| `Spline.PolygonalVertexes()` | `controlPoints` + `fitPoints` |
| `scaleFactor * 1000` | `SCALE_FACTOR` costante |
| Export to CSV | `exportToCSV()` con Blob |

### Flusso di Processamento

```
1. Upload file DXF
   ↓
2. FileReader legge come testo
   ↓
3. DxfParser.parseSync() crea oggetto DXF
   ↓
4. Itera su entities (SPLINE, LINE, ARC, POLYLINE)
   ↓
5. Interpola ogni entità in punti discreti
   ↓
6. Applica SCALE_FACTOR
   ↓
7. Popola chartState.data
   ↓
8. Renderizza su canvas
```

### Parametri Configurabili

- **INTERPOLATION_STEP (0.005)**: Precisione interpolazione curve
- **SCALE_FACTOR (1000.0)**: Moltiplicatore per conversione unità
- **Parser precision**: Modificabile tramite `numSegments` in `interpolateLine()`

### Export CSV

Il parser genera automaticamente un CSV scaricabile. Per abilitare l'auto-download, decommentare in `exportToCSV()`:

```javascript
a.click();  // Auto-download del CSV generato
```

## Licenza

Progetto sviluppato per visualizzazione dati DXF.

## Supporto

Per problemi o domande, aprire una issue nel repository del progetto.

## Credits

- **DXF Parser**: [dxf-parser](https://github.com/gdsestimating/dxf-parser) by gdsestimating
- **Font**: Google Fonts (Barlow, JetBrains Mono)
- **Ispirazione**: Script C# originale con netDxf
