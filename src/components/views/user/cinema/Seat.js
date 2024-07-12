import React, { useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import CurrencyFormat from "react-currency-format";

const Seat = () => {
  const [selected, setSelected] = useState([]);
  const [calculate, setCalculate] = useState({
    subtotal: 0,
    fee: 0,
    discount: 0,
    total: 0,
  });

  const rows = [
    [
      { id: 1, number: "A1" },
      { id: 2, number: "A2" },
      { id: 3, number: "A3" },
      { id: 4, number: "A4" },
      { id: 5, number: "A5" },
      { id: 6, number: "A6" },
      { id: 7, number: "A7" },
      { id: 8, number: "A8" },
      { id: 9, number: "A9" },
      { id: 10, number: "A10" },
      { id: 11, number: "A11" },
      { id: 12, number: "A12", isReserved: true },
      { id: 13, number: "A13", isReserved: true },
    ],
    [
      { id: 13, number: "B1" },
      { id: 14, number: "B2" },
      { id: 15, number: "B3", isReserved: true },
      { id: 16, number: "B4" },
      { id: 17, number: "B5" },
      { id: 18, number: "B6" },
      { id: 19, number: "B7" },
      { id: 20, number: "B8" },
      { id: 21, number: "B9" },
      { id: 22, number: "B10" },
      { id: 23, number: "B11" },
      { id: 24, number: "B12" },
      { id: 25, number: "B13" },
    ],
    [
      { id: 26, number: "C1" },
      { id: 27, number: "C2" },
      { id: 28, number: "C3" },
      { id: 29, number: "C4" },
      { id: 30, number: "C5" },
      { id: 31, number: "C6" },
      { id: 32, number: "C7" },
      { id: 33, number: "C8" },
      { id: 34, number: "C9" },
      { id: 35, number: "C10" },
      { id: 36, number: "C11", isReserved: true },
      { id: 37, number: "C12" },
      { id: 38, number: "C13" },
    ],
    [
      { id: 39, number: "D1" },
      { id: 40, number: "D2" },
      { id: 41, number: "D3", isReserved: true },
      { id: 42, number: "D4" },
      { id: 43, number: "D5" },
      { id: 44, number: "D6" },
      { id: 45, number: "D7" },
      { id: 46, number: "D8" },
      { id: 47, number: "D9" },
      { id: 48, number: "D10" },
      { id: 49, number: "D11" },
      { id: 50, number: "D12" },
      { id: 51, number: "D13" },
    ],
    [
      { id: 52, number: "E1" },
      { id: 53, number: "E2" },
      { id: 54, number: "E3" },
      { id: 55, number: "E4" },
      { id: 56, number: "E5" },
      { id: 57, number: "E6" },
      { id: 58, number: "E7" },
      { id: 59, number: "E8" },
      { id: 60, number: "E9" },
      { id: 61, number: "E10" },
      { id: 62, number: "E11" },
      { id: 63, number: "E12" },
      { id: 64, number: "E13" },
    ],
    [
      { id: 65, number: "F1" },
      { id: 66, number: "F2" },
      { id: 67, number: "F3" },
      { id: 68, number: "F4" },
      { id: 69, number: "F5" },
      { id: 70, number: "F6" },
      { id: 71, number: "F7" },
      { id: 72, number: "F8" },
      { id: 73, number: "F9" },
      { id: 74, number: "F10" },
      { id: 75, number: "F11" },
      { id: 76, number: "F12" },
      { id: 77, number: "F13" },
    ],
    [
      { id: 78, number: "G1" },
      { id: 79, number: "G2" },
      { id: 80, number: "G3" },
      { id: 81, number: "G4" },
      { id: 82, number: "G5" },
      { id: 83, number: "G6" },
      { id: 84, number: "G7", isReserved: true },
      { id: 85, number: "G8" },
      { id: 86, number: "G9" },
      { id: 87, number: "G10" },
      { id: 88, number: "G11" },
      { id: 89, number: "G12" },
      { id: 90, number: "G13" },
    ],
  ];

  const price = 300000;

  const addSeatCallback = (seat) => {
    setSelected((prevItems) => {
      const updatedSelected = [...prevItems, seat];
      updateTotalPrice(updatedSelected);
      return updatedSelected;
    });
  };
  
  const removeSeatCallback = (seat) => {
    setSelected((prevItems) => {
      const updatedSelected = prevItems.filter((item) => item !== seat);
      updateTotalPrice(updatedSelected);
      return updatedSelected;
    });
  };
  
  const updateTotalPrice = (selectedSeats) => {
    const total = price * selectedSeats.length;
    setCalculate((prevCalculate) => ({
      ...prevCalculate,
      subtotal: total,
      total: total,
    }));
  };
  

  return (
    <MainLayout top={true} footer={true} menu={true}>
      <div className="grid grid-cols-5 gap-4 font-sans p-4 bg-white rounded-lg shadow-lg">
        <div className="col-span-3 bg-gray-200 p-4 ">
          <div className="flex flex-col items-center relative mb-6">
            <div className="flex justify-evenly w-full mb-4">
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-white border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Available
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-gray-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Booked
                </span>
              </div>
              <div className="relative text-sm">
                <span className="absolute w-5 h-5 rounded-t-lg bg-yellow-400 border border-gray-400 -left-6 top-1/2 transform -translate-y-1/2"></span>
                <span className="text-medium font-semibold text-center text-gray-700 dark:text-white">
                  Selected
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-2 mb-5 mt-5 w-full">
              {rows.map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className="flex justify-center space-x-2"
                >
                  {row.map((seat) =>
                    seat ? (
                      <div
                        key={seat.id}
                        id={seat.number}
                        onClick={() => {
                          if (!seat.isReserved) {
                            if (selected.includes(seat.number)) {
                              removeSeatCallback(seat.number);
                            } else {
                              addSeatCallback(seat.number);
                            }
                          }
                        }}
                        className={`w-8 h-8 m-1 rounded-t-lg cursor-pointer flex items-center justify-center text-xs ${
                          seat.isReserved
                            ? "bg-gray-400 cursor-not-allowed"
                            : selected.includes(seat.number)
                            ? "bg-yellow-400"
                            : "bg-white border border-gray-400"
                        }`}
                      >
                        <span
                          className={`${
                            seat.isReserved
                              ? "font-medium"
                              : selected.includes(seat.number)
                              ? "font-medium"
                              : ""
                          }`}
                        >
                          {seat.number}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={`empty-${rowIndex}-${seat.id}`}
                        className="w-8 h-8 m-1"
                      ></div>
                    )
                  )}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-1.5 bg-blue-300 rounded-b-md border-t border-gray-400"></div>
          </div>
        </div>
        <div className="col-span-2  p-4 ">
          <h2 className="text-2xl font-bold">Informasi Pembelian</h2>
          <div className="mt-4">
            <div className="mt-2">
              <div className="flex justify-between my-1">
                <div>
                  <span className="text-xl">Tiket ({selected.length})</span>
                </div>
                <div>
                  <span className="font-semibold text-xl">
                    <CurrencyFormat
                      value={calculate.subtotal}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </span>
                </div>
              </div>
              <div className="flex justify-between my-1">
                <div>
                  <span className="text-xl">Biaya Admin ()</span>
                </div>
                <div>
                  <span className="font-semibold text-xl">
                    <CurrencyFormat
                      value={calculate.fee}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </span>
                </div>
              </div>
              <div className="mt-20">
                <h2 className="text-xl font-bold text-right">Subtotal</h2>
                <h2
                  className={`text-4xl font-bold text-right ${
                    calculate.total ? "animate-pulse" : ""
                  }`}
                >
                  <CurrencyFormat
                    value={calculate.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Seat;
