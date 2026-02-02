import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message, Dropdown } from 'semantic-ui-react';
import './index.css';
import {save} from 'save-file';
import * as XLSX from 'xlsx';
import TransactionsStorage from '../../util/storage/transactions';
import AccountsStorage from '../../util/storage/accounts';
import Currency from '../../entities/Currency';
import format from 'date-fns/format';

class DataExport extends React.Component {
  state = {
    exportFormat: 'excel'
  };

  handleFormatChange = (e, { value }) => {
    this.setState({ exportFormat: value });
  };

  handleSaveFile = async () => {
    const { exportFormat } = this.state;
    const transactions = await TransactionsStorage.getAll();
    const accounts = await AccountsStorage.loadAll();
    const timestamp = format(new Date(), 'YYYY-MM-DD_HH-mm-ss');

    if (exportFormat === 'json') {
      save(JSON.stringify(transactions, null, 2), `simpli_expense_${timestamp}.json`);
    } else if (exportFormat === 'csv') {
      this.exportCSV(transactions, accounts, timestamp);
    } else if (exportFormat === 'excel') {
      this.exportExcel(transactions, accounts, timestamp);
    }
  };

  exportCSV = (transactions, accounts, timestamp) => {
    const accountMap = accounts.reduce((map, acc) => {
      map[acc.id] = acc.name;
      return map;
    }, {});

    const headers = ['Date', 'Type', 'Account', 'Amount', 'Currency', 'Linked Account', 'Linked Amount', 'Linked Currency', 'Note', 'Tags'];
    const rows = transactions.map(tx => [
      format(tx.date, 'YYYY-MM-DD'),
      tx.kind === 0 ? 'Expense' : tx.kind === 1 ? 'Transfer' : 'Income',
      accountMap[tx.accountId] || tx.accountId,
      Currency.centsToNumber(Math.abs(tx.amount), tx.currency),
      tx.currency,
      tx.linkedAccountId ? (accountMap[tx.linkedAccountId] || tx.linkedAccountId) : '',
      tx.linkedAmount ? Currency.centsToNumber(tx.linkedAmount, tx.linkedCurrency) : '',
      tx.linkedCurrency || '',
      tx.note || '',
      (tx.tags || []).join(', ')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    save(csvContent, `simpli_expense_${timestamp}.csv`);
  };

  exportExcel = (transactions, accounts, timestamp) => {
    const accountMap = accounts.reduce((map, acc) => {
      map[acc.id] = acc.name;
      return map;
    }, {});

    const data = transactions.map(tx => ({
      Date: format(tx.date, 'YYYY-MM-DD'),
      Type: tx.kind === 0 ? 'Expense' : tx.kind === 1 ? 'Transfer' : 'Income',
      Account: accountMap[tx.accountId] || tx.accountId,
      Amount: Currency.centsToNumber(Math.abs(tx.amount), tx.currency),
      Currency: tx.currency,
      'Linked Account': tx.linkedAccountId ? (accountMap[tx.linkedAccountId] || tx.linkedAccountId) : '',
      'Linked Amount': tx.linkedAmount ? Currency.centsToNumber(tx.linkedAmount, tx.linkedCurrency) : '',
      'Linked Currency': tx.linkedCurrency || '',
      Note: tx.note || '',
      Tags: (tx.tags || []).join(', ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, `simpli_expense_${timestamp}.xlsx`);
  }

  render() {
    const formatOptions = [
      { key: 'excel', text: 'Excel (.xlsx)', value: 'excel', icon: 'file excel' },
      { key: 'csv', text: 'CSV (.csv)', value: 'csv', icon: 'file alternate' },
      { key: 'json', text: 'JSON (.json)', value: 'json', icon: 'file code' }
    ];

    return (
      <div className="mt-dataExport">
        <p>Export your transactions to Excel, CSV, or JSON format.</p>
        {this.props.error && (
          <Message
            error
            icon="warning circle"
            header="Failed to Export"
            content={this.props.error}
          />
        )}
        {!this.props.isFileSelected && (
          <React.Fragment>
            <div style={{ marginBottom: '1em' }}>
              <Dropdown
                selection
                options={formatOptions}
                value={this.state.exportFormat}
                onChange={this.handleFormatChange}
                style={{ marginRight: '1em' }}
              />
              <Button
                primary
                content="Export Data"
                icon="download"
                onClick={this.handleSaveFile}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

DataExport.propTypes = {
  error: PropTypes.string
};

export default DataExport;
