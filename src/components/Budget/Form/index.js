import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Dropdown, Checkbox, Message } from 'semantic-ui-react';
import Currency from '../../../entities/Currency';
import { getPeriodOptions, getTypeOptions } from '../../../entities/Budget';

class BudgetForm extends React.Component {
  handleChange = (e, { name, value, checked }) => {
    const newValue = name === 'isActive' ? checked : value;
    this.props.onChange({ [name]: newValue });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.isValid()) {
      this.props.onSubmit();
    }
  };

  isValid = () => {
    const { name, amount, currency, startDate } = this.props;
    return name && amount && parseFloat(amount) > 0 && currency && startDate;
  };

  render() {
    const {
      name,
      amount,
      currency,
      period,
      type,
      tags,
      accountIds,
      startDate,
      endDate,
      isActive,
      availableTags,
      availableAccounts,
      baseCurrency
    } = this.props;

    const currencyOptions = Currency.options();
    const periodOptions = getPeriodOptions();
    const typeOptions = getTypeOptions();
    const tagOptions = availableTags.map(tag => ({
      key: tag.id,
      value: tag.id,
      text: tag.name
    }));
    const accountOptions = availableAccounts.map(acc => ({
      key: acc.id,
      value: acc.id,
      text: acc.name
    }));

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          label="Budget Name"
          name="name"
          value={name}
          onChange={this.handleChange}
          placeholder="e.g., Monthly Groceries"
          required
        />

        <Form.Group widths="equal">
          <Form.Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={this.handleChange}
            placeholder="0.00"
            required
          />
          <Form.Field>
            <label>Currency</label>
            <Dropdown
              selection
              search
              name="currency"
              value={currency || baseCurrency}
              options={currencyOptions}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Field>
            <label>Period</label>
            <Dropdown
              selection
              name="period"
              value={period}
              options={periodOptions}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Type</label>
            <Dropdown
              selection
              name="type"
              value={type}
              options={typeOptions}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>

        {type === 'category' && (
          <Form.Field>
            <label>Categories (Tags)</label>
            <Dropdown
              placeholder="Select categories to track"
              fluid
              multiple
              search
              selection
              name="tags"
              value={tags}
              options={tagOptions}
              onChange={this.handleChange}
            />
            <small>Leave empty to track all expenses</small>
          </Form.Field>
        )}

        <Form.Field>
          <label>Accounts (Optional)</label>
          <Dropdown
            placeholder="Select accounts to track"
            fluid
            multiple
            search
            selection
            name="accountIds"
            value={accountIds}
            options={accountOptions}
            onChange={this.handleChange}
          />
          <small>Leave empty to track all accounts</small>
        </Form.Field>

        <Form.Group widths="equal">
          <Form.Input
            label="Start Date"
            name="startDate"
            type="date"
            value={startDate}
            onChange={this.handleChange}
            required
          />
          <Form.Input
            label="End Date (Optional)"
            name="endDate"
            type="date"
            value={endDate || ''}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Field>
          <Checkbox
            label="Active"
            name="isActive"
            checked={isActive}
            onChange={this.handleChange}
          />
        </Form.Field>

        {!this.isValid() && (
          <Message
            warning
            icon="warning sign"
            header="Please fill in all required fields"
            content="Budget name, amount, currency, and start date are required."
          />
        )}

        <Button primary type="submit" disabled={!this.isValid()}>
          Save Budget
        </Button>
        <Button type="button" onClick={this.props.onCancel}>
          Cancel
        </Button>
      </Form>
    );
  }
}

BudgetForm.propTypes = {
  name: PropTypes.string,
  amount: PropTypes.string,
  currency: PropTypes.string,
  period: PropTypes.string,
  type: PropTypes.string,
  tags: PropTypes.array,
  accountIds: PropTypes.array,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  isActive: PropTypes.bool,
  availableTags: PropTypes.array,
  availableAccounts: PropTypes.array,
  baseCurrency: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default BudgetForm;
