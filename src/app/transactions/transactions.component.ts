import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  groupId;
  start = false;
  groupMember = [];
  allTransactions;
  userPartOfTransactions = [];
  totalOfAllTransactions = { amount: 0 };
  totalOfPartOfTransactions = { amount: 0 };
  transactionInModal;
  loggedInUser;
  groupMemberForCheckbox;
  constructor(
    private api: DataProviderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.groupId = params['groupId'];
    });
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));

    this.getGroupData();
    this.initiateTransactionForm();
    this.getAllTransactions();
    // this.partOfTransactions();
  }

  initiateTransactionForm() {
    this.transactionForm = this.formBuilder.group({
      transactionName: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      membersOfTransaction: new FormArray([], this.minSelectedCheckboxes(1)),
    });
    this.start = true;
  }
  get membersOfTransactionFormArray() {
    return this.transactionForm.controls.membersOfTransaction as FormArray;
  }

  getAllTransactions() {
    this.api.getAlltransactions(this.groupId).subscribe((data) => {
      this.allTransactions = data['data'].reverse();

      this.totalOfAllTransactions = this.allTransactions?.reduce(
        (previousValue, currentValue) => ({
          amount: previousValue.amount + currentValue.amount,
        }),
        { amount: 0 }
      );
      console.log(this.totalOfAllTransactions);

      this.partOfTransactions();
    });
  }
  addNewTransaction() {
    const transactionMembers = this.transactionForm.value.membersOfTransaction
      .map((checked, i) => (checked ? this.groupMemberForCheckbox[i] : null))
      .filter((v) => v !== null);

    const transactionMembersWithinitiator = [
      ...transactionMembers,

      {
        memberName: this.loggedInUser.userName,
        userEmailId: this.loggedInUser.userEmailId,
        paid: false,
      },
    ];
    console.log(transactionMembersWithinitiator);

    let user = JSON.parse(localStorage.getItem('user'));
    const payloadForCreateTransaction = {
      groupId: this.groupId,
      transactionName: this.transactionForm.controls.transactionName.value,
      initiatedBy: {
        memberName: user.userName,
        userEmailId: user.userEmailId,
      },
      amount: this.transactionForm.controls.amount.value,
      membersOfTransaction: transactionMembersWithinitiator,
    };

    this.api
      .createTransaction(payloadForCreateTransaction)
      .subscribe((data) => {
        console.log(data);
      });
    setTimeout(() => {
      this.getAllTransactions();
    }, 1000);
    this.transactionForm.reset();
  }

  getGroupData() {
    this.api.getGroup(this.groupId).subscribe((data) => {
      console.log(data);

      const groupmemberwithpaidflag = data['data'][0]?.members;
      data['data'][0]?.members.forEach((member) => {
        member.paid = false;
      });

      this.groupMember = groupmemberwithpaidflag;
      this.groupMemberForCheckbox = this.groupMember.filter((ele) => {
        return ele.userEmailId != this.loggedInUser.userEmailId;
      });
      console.log(this.groupMemberForCheckbox);
      this.addCheckboxes();
    });
  }

  private addCheckboxes() {
    this.groupMemberForCheckbox?.forEach((member) => {
      this.membersOfTransactionFormArray.push(new FormControl(false));
    });
    console.log(this.membersOfTransactionFormArray);
  }

  partOfTransactions() {
    this.userPartOfTransactions = [];
    let user = JSON.parse(localStorage.getItem('user'));
    this.allTransactions?.forEach((ele) => {
      ele['membersOfTransaction'].forEach((ele2) => {
        if (ele2?.['userEmailId'] == user.userEmailId) {
          console.log('if con');
          if (!this.userPartOfTransactions.includes(ele)) {
            this.userPartOfTransactions.push(ele);
          }
        }
      });
    });

    console.log(this.userPartOfTransactions);
    this.totalOfPartOfTransactions = this.userPartOfTransactions?.reduce(
      (previousValue, currentValue) => ({
        amount: previousValue.amount + currentValue.amount,
      }),
      { amount: 0 }
    );
    console.log(this.totalOfAllTransactions);
  }
  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
  get form() {
    return this.transactionForm.controls;
  }
  assigntransactionToModal(selectedTransaction) {
    this.transactionInModal = selectedTransaction;
  }
}
