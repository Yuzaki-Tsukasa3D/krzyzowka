import React, { useState } from 'react';
import './App.css';

const hasla = [
  // Poziomo
  { id: 1, kierunek: 'poziomo', wiersz: 3, kolumna: 4, odpowiedz: 'FUNKCJA', opis: 'Wydzielony, wywoływalny fragment kodu (7)' },
  { id: 5, kierunek: 'poziomo', wiersz: 2, kolumna: 7, odpowiedz: 'PETLA', opis: 'Instrukcja powtarzająca fragment kodu (5)' },
  { id: 6, kierunek: 'poziomo', wiersz: 10, kolumna: 5, odpowiedz: 'GIT', opis: 'System kontroli wersji (3)' },
  { id: 8, kierunek: 'poziomo', wiersz: 9, kolumna: 1, odpowiedz: 'ZMIENNA', opis: 'Nazwane miejsce w pamięci na dane (7)' },
  { id: 9, kierunek: 'poziomo', wiersz: 1, kolumna: 8, odpowiedz: 'TABLICA', opis: 'Uporządkowana kolekcja elementów (7)' },
  { id: 10, kierunek: 'poziomo', wiersz: 12, kolumna: 1, odpowiedz: 'JAVASCRIPT', opis: 'Język skryptowy działający w przeglądarce (10)' },

  // Pionowo
  { id: 2, kierunek: 'pionowo', wiersz: 3, kolumna: 7, odpowiedz: 'KOMPILATOR', opis: 'Program tłumaczący kod źródłowy na kod maszynowy (10)' },
  { id: 3, kierunek: 'pionowo', wiersz: 10, kolumna: 2, odpowiedz: 'REACT', opis: 'Biblioteka JavaScript do budowania interfejsów (5)' },
  { id: 4, kierunek: 'pionowo', wiersz: 5, kolumna: 4, odpowiedz: 'SERWER', opis: 'Komputer udostępniający usługi w sieci (6)' },
  { id: 7, kierunek: 'pionowo', wiersz: 1, kolumna: 10, odpowiedz: 'BLAD', opis: 'Polska nazwa bug-a (4)' }
];

const WIERSZE = 14;
const KOLUMNY = 14;

function App() {
  const [litery, setLitery] = useState({});
  const [wybraneHaslo, setWybraneHaslo] = useState(null);
  const [aktywnePole, setAktywnePole] = useState(null);
  const [sprawdzono, setSprawdźono] = useState(false);

  const poprawneLitery = {};
  const numeryPol = {};

  // Przekształcamy listę haseł na siatkę współrzędnych "wiersz-kolumna" dla szybkich odwołań
  hasla.forEach(function(haslo) {
    const start = haslo.wiersz + '-' + haslo.kolumna;
    numeryPol[start] = haslo.id;

    // Obliczamy położenie każdej kolejnej litery w zależności od kierunku (poziomo/pionowo)
    for (let i = 0; i < haslo.odpowiedz.length; i++) {
      let w = haslo.wiersz;
      let k = haslo.kolumna;

      if (haslo.kierunek === 'poziomo') {
        k = k + i;
      } else {
        w = w + i;
      }

      poprawneLitery[w + '-' + k] = haslo.odpowiedz[i];
    }
  });

  // Funkcja sprawdza, czy komórka o danych współrzędnych (w, k) należy do aktualnie klikniętego hasła z listy
  function czyWybranePole(w, k) {
    if (wybraneHaslo === null) return false;

    const haslo = hasla.find(function(h) {
      return h.id === wybraneHaslo;
    });

    for (let i = 0; i < haslo.odpowiedz.length; i++) {
      let poleW = haslo.wiersz;
      let poleK = haslo.kolumna;

      if (haslo.kierunek === 'poziomo') {
        poleK = poleK + i;
      } else {
        poleW = poleW + i;
      }

      if (poleW === w && poleK === k) return true;
    }

    return false;
  }

  function wpiszLitere(w, k, wartosc) {
    // Pozwalamy wpisać tylko 1 dużą literę; cyfry i znaki specjalne są odrzucane przez regex
    const litera = wartosc.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
    const klucz = w + '-' + k;

    setLitery({
      ...litery,
      [klucz]: litera
    });

    setSprawdźono(false);
  }

  function pokazRozwiazanie() {
    setLitery({ ...poprawneLitery });
    setSprawdźono(true);
  }

  function wyczysc() {
    setLitery({});
    setWybraneHaslo(null);
    setAktywnePole(null);
    setSprawdźono(false);
  }

  let punkty = 0;
  const liczbaPol = Object.keys(poprawneLitery).length;

  Object.keys(poprawneLitery).forEach(function(klucz) {
    if (litery[klucz] === poprawneLitery[klucz]) {
      punkty++;
    }
  });

  return (
    <div className="aplikacja">
      <h2>Krzyżówka</h2>

      <div className="glowny-kontener">
        <div className="sekcja-krzyzowki">
          <div className="siatka">
            {Array.from({ length: WIERSZE }).map(function(_, wIndex) {
              return (
                <div className="wiersz" key={wIndex}>
                  {Array.from({ length: KOLUMNY }).map(function(_, kIndex) {
                    const w = wIndex + 1;
                    const k = kIndex + 1;
                    const klucz = w + '-' + k;

                    // Jeśli dla tej współrzędnej nie ma żadnej litery, renderujemy puste pole
                    if (poprawneLitery[klucz] === undefined) {
                      return <div className="puste-pole" key={klucz}></div>;
                    }

                    let kolor = '';
                    const czyAktywne = aktywnePole === klucz;
                    const czyZaznaczone = czyWybranePole(w, k);

                    // Hierarchia kolorów: kursor (żółty) nadpisuje zaznaczenie definicji (niebieskie)
                    if (czyAktywne) {
                      kolor = 'pole-aktywne';
                    } else if (czyZaznaczone) {
                      kolor = 'pole-wybrane';
                    }

                    // Po kliknięciu "Sprawdź" weryfikujemy wpisane litery (zielony = ok, czerwony = błąd)
                    if (sprawdzono && litery[klucz] !== undefined) {
                      if (litery[klucz] === poprawneLitery[klucz]) {
                        kolor = 'pole-dobre';
                      } else {
                        kolor = 'pole-zle';
                      }
                    }

                    return (
                      <div className={'komorka ' + kolor} key={klucz}>
                        {numeryPol[klucz] && (
                          <span className="numer">{numeryPol[klucz]}</span>
                        )}
                        <input
                          type="text"
                          maxLength="1"
                          value={litery[klucz] || ''}
                          onFocus={function() { setAktywnePole(klucz); }}
                          onChange={function(e) {
                            wpiszLitere(w, k, e.target.value);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="przyciski">
            <button onClick={function() { setSprawdźono(true); }}>Sprawdź</button>
            <button onClick={pokazRozwiazanie}>Pokaż rozwiazanie</button>
            <button onClick={wyczysc}>Wyczyść</button>
            <strong>{punkty}/{liczbaPol}</strong>
          </div>
        </div>

        <div className="sekcja-pytan">
          <h3>Poziomo</h3>
          <ul>
            {hasla.filter(h => h.kierunek === 'poziomo').map(function(h) {
              return (
                <li
                  key={h.id}
                  className={wybraneHaslo === h.id ? 'wybrane-pytanie' : ''}
                  onClick={function() { setWybraneHaslo(h.id); }}
                >
                  {h.id}. {h.opis}
                </li>
              );
            })}
          </ul>

          <h3>Pionowo</h3>
          <ul>
            {hasla.filter(h => h.kierunek === 'pionowo').map(function(h) {
              return (
                <li
                  key={h.id}
                  className={wybraneHaslo === h.id ? 'wybrane-pytanie' : ''}
                  onClick={function() { setWybraneHaslo(h.id); }}
                >
                  {h.id}. {h.opis}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;