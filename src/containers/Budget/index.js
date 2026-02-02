import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, Header } from 'semantic-ui-react';
import BudgetForm from '../../components/Budget/Form';
import BudgetList from '../../components/Budget/List';
import BudgetOverview from '../../components/Budget/Overview';
import { loadBudgets, removeBudget } from '../../actions/entities/budgets';
import { loadAccounts } from '../../actions/entities/accounts';
import { loadTags } from '../../actions/entities/tags';
import {
  openBudgetForm,
  closeBudgetForm,
  changeBudgetForm,
  submitBudgetForm
} from '../../actions/ui/form/budget';
import { getBudgetsList } from '../../selectors/entities/budgets';
import { getAccountsList } from '../../selectors/entities/accounts';
import { getTagsList } from '../../selectors/entities/tags';
import { stateToForm } from '../../entities/Budget';

class Budget extends React.Component {
  componentDidMount() {
    this.props.loadBudgets();
    this.props.loadAccounts();
    this.props.loadTags();
  }

  handleOpenForm = (budget = null) => {
    if (budget) {
      this.props.openBudgetForm(stateToForm(budget));
    } else {
      this.props.openBudgetForm({
        currency: this.props.baseCurrency
      });
    }
  };

  handleCloseForm = () => {
    this.props.closeBudgetForm();
  };

  handleFormChange = changes => {
    this.props.changeBudgetForm(changes);
  };

  handleSubmit = () => {
    this.props.submitBudgetForm();
  };

  handleDelete = budgetId => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      this.props.removeBudget(budgetId);
    }
  };

  render() {
    const {
      budgets,
      spending,
      form,
      accounts,
      tags,
      baseCurrency
    } = this.props;

    return (
      <div className="container-full-page">
        <div style={{ marginBottom: '20px' }}>
          <Button
            primary
            icon="plus"
            content="Create Budget"
            onClick={() => this.handleOpenForm()}
          />
        </div>

        {budgets.length > 0 && (
          <BudgetOverview
            budgets={budgets}
            spending={spending}
            baseCurrency={baseCurrency}
          />
        )}

        <div style={{ marginTop: '20px' }}>
          <BudgetList
            budgets={budgets}
            spending={spending}
            onEdit={this.handleOpenForm}
            onDelete={this.handleDelete}
          />
        </div>

        <Modal open={form.isOpen} onClose={this.handleCloseForm}>
          <Modal.Header>
            <Header icon="shopping basket" content={form.id ? 'Edit Budget' : 'Create Budget'} />
          </Modal.Header>
          <Modal.Content>
            <BudgetForm
              {...form}
              availableTags={tags}
              availableAccounts={accounts}
              baseCurrency={baseCurrency}
              onChange={this.handleFormChange}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCloseForm}
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

Budget.propTypes = {
  budgets: PropTypes.array.isRequired,
  spending: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  baseCurrency: PropTypes.string.isRequired,
  loadBudgets: PropTypes.func.isRequired,
  loadAccounts: PropTypes.func.isRequired,
  loadTags: PropTypes.func.isRequired,
  openBudgetForm: PropTypes.func.isRequired,
  closeBudgetForm: PropTypes.func.isRequired,
  changeBudgetForm: PropTypes.func.isRequired,
  submitBudgetForm: PropTypes.func.isRequired,
  removeBudget: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  budgets: getBudgetsList(state),
  spending: state.ui.budgetSpending,
  form: state.ui.form.budget,
  accounts: getAccountsList(state),
  tags: getTagsList(state),
  baseCurrency: (state.settings.baseCurrency || 'USD')
});

export default connect(
  mapStateToProps,
  {
    loadBudgets,
    loadAccounts,
    loadTags,
    openBudgetForm,
    closeBudgetForm,
    changeBudgetForm,
    submitBudgetForm,
    removeBudget
  }
)(Budget);
