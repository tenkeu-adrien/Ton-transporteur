import React from "react";

const Payments = () => {
  const payments = [
    { id: "001", amount: "50€", date: "2024-01-15", status: "Payé" },
    { id: "002", amount: "30€", date: "2024-01-10", status: "En attente" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Paiements et factures</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Date</th>
            <th className="p-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="text-center">
              <td className="p-2">{payment.id}</td>
              <td className="p-2">{payment.amount}</td>
              <td className="p-2">{payment.date}</td>
              <td className="p-2">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;