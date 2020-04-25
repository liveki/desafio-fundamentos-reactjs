import React, { useState, useEffect } from 'react';

import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import {
  Container,
  CardContainer,
  Card,
  TableContainer,
  HeaderContent,
} from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [arrowDirection, setArrowDirection] = useState('FiChevronDown');

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('/transactions');

      const newTransactions: Transaction[] = [];

      const newBalance: Balance = {
        income: formatValue(data.balance.income),
        outcome: formatValue(data.balance.outcome),
        total: formatValue(data.balance.total),
      };

      data.transactions.map((transaction: Transaction) => {
        return newTransactions.push({
          ...transaction,
          formattedDate: formatDate(transaction.created_at),
          formattedValue: formatValue(transaction.value),
        });
      });

      setTransactions(newTransactions);
      setBalance(newBalance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>

          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>

          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <HeaderContent>
                    Título
                    <FiChevronDown
                      id="title"
                      className="iconHeader"
                      size={17}
                    />
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent id="value">
                    Preço
                    <FiChevronDown className="iconHeader" size={17} />
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent>
                    Categoria
                    <FiChevronDown className="iconHeader" size={17} />
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent>
                    Data
                    <FiChevronDown className="iconHeader" size={17} />
                  </HeaderContent>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={`${
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }`}
                  >
                    {`${transaction.type === 'outcome' ? '- ' : ''}${
                      transaction.formattedValue
                    }`}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
