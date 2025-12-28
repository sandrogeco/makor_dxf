# XY Chart - DXF CSV Viewer

Un widget web interattivo per visualizzare dati XY da file CSV, specificamente progettato per dati DXF.

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

### Visualizzazione
- **Grafico XY interattivo** con rendering su canvas HTML5
- **Auto-refresh** ogni 2 secondi per aggiornamenti in tempo reale
- **Design moderno** con tema scuro e gradients cyan/blue

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
2. Il widget caricherà automaticamente i dati da `data/output.csv`
3. I dati si aggiorneranno automaticamente ogni 2 secondi

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

### Modifica Percorso CSV

Nel file `widget/index.html`, linea ~425:

```javascript
fetch('../data/output.csv?' + new Date().getTime())
```

Cambiare il percorso per puntare a un diverso file CSV.

### Modifica Frequenza Refresh

Nel file `widget/index.html`, linea ~670:

```javascript
setInterval(loadCSVData, 2000);  // 2000ms = 2 secondi
```

Modificare il valore in millisecondi per cambiare la frequenza di aggiornamento.

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

## Licenza

Progetto sviluppato per visualizzazione dati DXF.

## Supporto

Per problemi o domande, aprire una issue nel repository del progetto.
