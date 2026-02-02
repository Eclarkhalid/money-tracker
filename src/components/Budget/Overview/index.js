import React from 'react';
import PropTypes from 'prop-types';
import { Statistic, Grid, Segment, Icon } from 'semantic-ui-react';
import Currency from '../../../entities/Currency';

class BudgetOverview extends React.Component {
  calculateTotals = () => {
    const { budgets, spending, baseCurrency } = this.props;
    
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;
    
    budgets.filter(b => b.isActive).forEach(budget => {
      const budgetSpending = spending[budget.id];
      if (budgetSpending) {
        totalBudget += budget.amount;
        totalSpent += budgetSpending.spent;
        if (budgetSpending.isOverBudget) {
          overBudgetCount++;
        }
      }
    });
    
    return {
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      overBudgetCount,
      activeBudgetCount: budgets.filter(b => b.isActive).length
    };
  };

  render() {
    const { baseCurrency } = this.props;
    const totals = this.calculateTotals();
    const currency = baseCurrency || 'USD';

    return (
      <Segment>
        <Grid columns={4} stackable textAlign="center">
          <Grid.Column>
            <Statistic size="small">
              <Statistic.Value>
                <Icon name="clipboard list" />
                {totals.activeBudgetCount}
              </Statistic.Value>
              <Statistic.Label>Active Budgets</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="small" color="blue">
              <Statistic.Value>
                {Currency.symbol(currency)}
                {Currency.centsToString(totals.totalBudget, currency)}
              </Statistic.Value>
              <Statistic.Label>Total Budget</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="small" color="orange">
              <Statistic.Value>
                {Currency.symbol(currency)}
                {Currency.centsToString(totals.totalSpent, currency)}
              </Statistic.Value>
              <Statistic.Label>Total Spent</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="small" color={totals.totalRemaining >= 0 ? 'green' : 'red'}>
              <Statistic.Value>
                {Currency.symbol(currency)}
                {Currency.centsToString(Math.abs(totals.totalRemaining), currency)}
              </Statistic.Value>
              <Statistic.Label>
                {totals.totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
        {totals.overBudgetCount > 0 && (
          <div style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>
            <Icon name="warning sign" />
            {totals.overBudgetCount} budget{totals.overBudgetCount > 1 ? 's are' : ' is'} over limit
          </div>
        )}
      </Segment>
    );
  }
}

BudgetOverview.propTypes = {
  budgets: PropTypes.array.isRequired,
  spending: PropTypes.object.isRequired,
  baseCurrency: PropTypes.string.isRequired
};

export default BudgetOverview;
