import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './App';

function pobierzPole(wiersz, kolumna) {
  const rzad = document.querySelectorAll('.wiersz')[wiersz - 1];
  return rzad.children[kolumna - 1].querySelector('input');
}

describe('Testy aplikacji Krzyżówka', () => {

  test('Hasło na 5 liter ma 5 pól', () => {
    render(<App />);

    const wiersz = document.querySelectorAll('.wiersz')[1];
    const polaHasla = [];

    for (let i = 7; i <= 11; i++) {
      const pole = wiersz.children[i - 1].querySelector('input');
      if (pole) polaHasla.push(pole);
    }

    expect(polaHasla.length).toBe(5);
  });

 
  test('Pole przyjmuje literę, ignoruje cyfrę i zostawia jedną literę', () => {
    render(<App />);

    const input = pobierzPole(1, 8);

    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toBe('A');

    fireEvent.change(input, { target: { value: 'AB' } });
    expect(input.value).toBe('B');
  });

 
  test('Przycisk Pokaż rozwiązanie uzupełnia kratki', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Pokaż rozwiazanie'));

 
    expect(pobierzPole(1, 8).value).toBe('T');
    expect(pobierzPole(1, 9).value).toBe('A');
  });


  test('Przycisk Wyczyść czyści pola', () => {
    render(<App />);

    const input = pobierzPole(1, 8);
    fireEvent.change(input, { target: { value: 'T' } });

    expect(input.value).toBe('T');

    fireEvent.click(screen.getByText('Wyczyść'));

    expect(input.value).toBe('');
  });


  test('Kliknięcie definicji podświetla kratki hasła', () => {
    render(<App />);

    const definicja = screen.getByText(/Instrukcja powtarzająca fragment kodu/);
    fireEvent.click(definicja);

    const wiersz = document.querySelectorAll('.wiersz')[1];

    for (let i = 7; i <= 11; i++) {
      const pole = wiersz.children[i - 1].querySelector('input');
      expect(pole.parentElement.className).toContain('pole-wybrane');
    }
  });


  test('Przycisk Sprawdź oznacza poprawne i błędne litery', () => {
    render(<App />);

    const dobrePole = pobierzPole(1, 8); 
    const zlePole = pobierzPole(1, 9);   

    fireEvent.change(dobrePole, { target: { value: 'T' } });
    fireEvent.change(zlePole, { target: { value: 'X' } });

    fireEvent.click(screen.getByText('Sprawdź'));

    expect(dobrePole.parentElement.className).toContain('pole-dobre');
    expect(zlePole.parentElement.className).toContain('pole-zle');
  });

});
