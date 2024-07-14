import React, { useState, useEffect } from 'react';

import { Bar ,Line} from 'react-chartjs-2';

export default function TableData() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3004/Users');
      const jsonData = await response.json();
      setCustomers(jsonData.customers);
      setTransactions(jsonData.transactions);
      setFilteredTransactions(jsonData.transactions);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    const filtered = transactions.filter(
      (transaction) => transaction.customer_id === customerId
    );
    setFilteredTransactions(filtered);
  };

  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        customers.find((customer) => customer.id === transaction.customer_id)
          .name.toLowerCase().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm)
    );
    setFilteredTransactions(filtered);
  };


  const getTransactionAmountsPerDay = () => {
    const amountsPerDay = {};
    filteredTransactions.forEach((transaction) => {
      const date = transaction.date;
      if (amountsPerDay[date]) {
        amountsPerDay[date] += transaction.amount;
      } else {
        amountsPerDay[date] = transaction.amount;
      }
    });
    return Object.values(amountsPerDay);
  };


  const chartData = {
    
    labels: Object.keys(getTransactionAmountsPerDay()),
    datasets: [
      {
        label: 'Total Amount',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        data: getTransactionAmountsPerDay(),
      },
    ],
  };

  


  return (

    <>
    <div className="">
      <div className="container">
      <div className="App text-center">
      <h1 className="mt-4 mb-3">Customer Transactions</h1>
      <div className="filters">
        <input
        className="me-3 w-75"
          type="text"
          placeholder="Filter by customer name or transaction amount"
          onChange={handleFilter}
        />
        <select
          value={selectedCustomer || ''}
          onChange={(e) => handleCustomerSelect(parseInt(e.target.value))}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      <table className="table border border-1 border-black mt-5 ">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => {
            const customerName = customers.find(
              (customer) => customer.id === transaction.customer_id
            ).name;
            return (
              <tr key={transaction.id}>
                <td>{transaction.customer_id}</td>
                <td>{customerName}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedCustomer && (
        <div className="chart-container">
          <h2>Total Transaction Amount per Day</h2>
          <Bar data={chartData} />
          
        </div>
      )}
    </div>
    </div>
    </div>
    </>
    
    
  );

}
