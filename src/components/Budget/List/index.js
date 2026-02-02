import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import BudgetItem from './BudgetItem';

class BudgetList extends React.Component {
  render() {
    const { budgets, spending, onEdit, onDelete } = this.props;

    if (!budgets || budgets.length === 0) {
      return (
        <Message info icon="info circle" header="No budgets yet" content="Create your first budget to start tracking your spending!" />
      );
    }

    const activeBudgets = budgets.filter(b => b.isActive);
    const inactiveBudgets = budgets.filter(b => !b.isActive);

    return (
      <div>
        {activeBudgets.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Active Budgets</h3>
            {activeBudgets.map(budget => (
              <BudgetItem
                key={budget.id}
                budget={budget}
                spending={spending[budget.id]}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
        {inactiveBudgets.length > 0 && (
          <div>
            <h3>Inactive Budgets</h3>
            {inactiveBudgets.map(budget => (
              <BudgetItem
                key={budget.id}
                budget={budget}
                spending={spending[budget.id]}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

BudgetList.propTypes = {
  budgets: PropTypes.array.isRequired,
  spending: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BudgetList;
