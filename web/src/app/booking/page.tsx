"use client"; 

import React, { useEffect, useState } from "react";

export default function Booking() {
  interface Movie {
    id: string;
    title: string;
    image: string;
    description: string;
    release_date: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<number[][]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ticketPrice = 150;
  const rows = 10;
  const cols = 10;

  // Вже заброньовані місця
  const bookedSeats = [
    [3, 4],
    [5, 6],
  ];

  // Завантаження списку фільмів
  useEffect(() => {
    fetch("API")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Помилка завантаження фільмів. Спробуйте ще раз.");
        setLoading(false);
      });
  }, []);

  // Оновлення загальної ціни
  useEffect(() => {
    setTotalPrice(selectedSeats.length * ticketPrice);
  }, [selectedSeats]);

  // Вибір місця
  const handleSeatSelect = (row: number, col: number) => {
    if (bookedSeats.some(([r, c]) => r === row && c === col)) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some(([r, c]) => r === row && c === col);
      return isSelected
        ? prev.filter(([r, c]) => !(r === row && c === col))
        : [...prev, [row, col]];
    });
  };

  // Підтвердження бронювання
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !selectedDate || !selectedTime || selectedSeats.length === 0) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) return <p className="text-white text-center">Завантаження фільмів...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Бронювання квитків</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Оберіть фільм:</label>
          <select
            onChange={(e) =>
              setSelectedMovie(movies.find((movie) => movie.id === e.target.value) || null)
            }
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={selectedMovie?.id || ""}
          >
            <option value="">-- Виберіть фільм --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded w-full"
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded w-full"
          >
            <option value="">-- Виберіть час --</option>
            <option value="10:00">10:00 </option>
            <option value="14:00">14:00 </option>
            <option value="18:00">18:00 </option>
          </select>
        </div>

        <div className="mb-6">
  <p className="text-lg font-semibold mb-2">Оберіть місця:</p>

  {/* Екран */}
  <div className="bg-gray-300 text-center text-black font-bold py-2 mb-4 rounded">
    Екран
  </div>

  <div className="grid grid-cols-10 gap-2 justify-center">
    {Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => (
        <button
          key={`${row}-${col}`}
          onClick={() => handleSeatSelect(row, col)}
          type="button"
          className={`w-8 h-8 rounded-full ${bookedSeats.some(([r, c]) => r === row && c === col)
              ? "bg-red-600 cursor-not-allowed"
              : selectedSeats.some(([r, c]) => r === row && c === col)
              ? "bg-green-500"
              : "bg-gray-500"
            }`}
        ></button>
      ))
    )}
  </div>

  {/* Пояснення кольорів */}
  <div className="mt-4 text-center text-white">
    <p className="mb-2">
      <span className="w-4 h-4 inline-block rounded-full bg-green-500"></span> — Вибране місце
    </p>
    <p className="mb-2">
      <span className="w-4 h-4 inline-block rounded-full bg-red-600"></span> — Заброньоване місце
    </p>
    <p>
      <span className="w-4 h-4 inline-block rounded-full bg-gray-500"></span> — Доступне місце
    </p>
  </div>
</div>


<div className="flex justify-between items-center">
  <p className="text-xl font-bold">Ціна: {totalPrice} грн</p>
  <button type="submit" className="px-4 py-2 bg-blue-600 rounded text-white">
    Оплатити
  </button>
</div>
      </form>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white text-black p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-2">Оплата підтверджена!</h2>
      <p>Фільм: {selectedMovie?.title}</p>
      <p>Дата: {selectedDate}</p>
      <p>Час: {selectedTime}</p>
      <p>Місця: {selectedSeats.map(([r, c]) => `[${r + 1},${c + 1}]`).join(", ")}</p>
      <p>Загальна ціна: {totalPrice} грн</p>
      <button
        onClick={() => setIsModalOpen(false)}
        className="px-4 py-2 mt-4 bg-blue-600 rounded text-white"
      >
        ОК
      </button>
    </div>
  </div>
)}
    </div>
  );
}
