import React from 'react';
import PropTypes from 'prop-types';
import { Card, Progress, Button, Label, Icon } from 'semantic-ui-react';
import Currency from '../../../entities/Currency';
import format from 'date-fns/format';

class BudgetItem extends React.Component {
  getProgressColor = percentage => {
    if (percentage >= 100) return 'red';
    if (percentage >= 80) return 'orange';
    if (percentage >= 60) return 'yellow';
    return 'green';
  };

  getPeriodLabel = (period, startDate) => {
    const start = format(startDate, 'MMM D');
    return `${period.charAt(0).toUpperCase() + period.slice(1)} (from ${start})`;
  };

  render() {
    const { budget, spending, onEdit, onDelete } = this.props;
    const percentage = spending ? spending.percentage : 0;
    const spent = spending ? spending.spent : 0;
    const remaining = spending ? spending.remaining : budget.amount;
    const isOverBudget = spending ? spending.isOverBudget : false;

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            {budget.name}
            {!budget.isActive && (
              <Label size="mini" color="grey" style={{ marginLeft: '10px' }}>
                Inactive
              </Label>
            )}
            {isOverBudget && (
              <Label size="mini" color="red" style={{ marginLeft: '10px' }}>
                <Icon name="warning sign" />
                Over Budget
              </Label>
            )}
          </Card.Header>
          <Card.Meta>
            {this.getPeriodLabel(budget.period, budget.startDate)}
            {budget.type === 'category' && budget.tags && budget.tags.length > 0 && (
              <div style={{ marginTop: '5px' }}>
                {budget.tags.map(tag => (
                  <Label key={tag} size="tiny" style={{ marginRight: '5px' }}>
                    {tag}
                  </Label>
                ))}
              </div>
            )}
          </Card.Meta>
          <Card.Description style={{ marginTop: '15px' }}>
            <Progress
              percent={Math.min(percentage, 100)}
              color={this.getProgressColor(percentage)}
              progress
              size="small"
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>Spent:</strong>{' '}
                {Currency.symbol(budget.currency)}
                {Currency.centsToString(spent, budget.currency)}
              </div>
              <div>
                <strong>Budget:</strong>{' '}
                {Currency.symbol(budget.currency)}
                {Currency.centsToString(budget.amount, budget.currency)}
              </div>
            </div>
            <div style={{ marginTop: '5px' }}>
              <strong>Remaining:</strong>{' '}
              <span style={{ color: isOverBudget ? 'red' : 'green' }}>
                {Currency.symbol(budget.currency)}
                {Currency.centsToString(Math.abs(remaining), budget.currency)}
                {isOverBudget && ' over'}
              </span>
            </div>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group size="small">
            <Button icon="edit" content="Edit" onClick={() => onEdit(budget)} />
            <Button icon="trash" content="Delete" onClick={() => onDelete(budget.id)} />
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

BudgetItem.propTypes = {
  budget: PropTypes.object.isRequired,
  spending: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BudgetItem;
