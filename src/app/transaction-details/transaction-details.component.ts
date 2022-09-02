import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css'],
})
export class TransactionDetailsComponent implements OnInit {
  transactionId;
  loggedInUser;
  transactionDetails;
  allComments;
  commentInput;
  constructor(
    private api: DataProviderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.transactionId = params['transactionId'];
    });

    console.log(this.transactionId);
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));

    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.fetchTransactionDetails();
    this.fetchAllComments();
  }

  fetchTransactionDetails() {
    this.api.getSingleTransactions(this.transactionId).subscribe((data) => {
      console.log(data);

      this.transactionDetails = data['data'][0];
      console.log(this.transactionDetails);
    });
  }

  fetchAllComments() {
    this.api.getAllComments(this.transactionId).subscribe((data) => {
      console.log(data);
      this.allComments = data['data'].reverse();
    });
  }
  createComment() {
    const comment = {
      transactionId: this.transactionId,
      comment: this.commentInput,
      commentedBy: {
        memberName: this.loggedInUser.userName,
        userEmailId: this.loggedInUser.userEmailId,
      },
    };
    this.api.createComment(comment).subscribe((data) => {
      console.log(data);
      setTimeout(() => {
        this.fetchAllComments();
      }, 1000);
    });
  }
  updateTransaction(memberId) {
    let members = this.transactionDetails.membersOfTransaction;

    members.forEach((member) => {
      if (member.userEmailId == memberId) {
        member.paid = true;
      }
    });
    console.log(members);
    const payloadForTransactionUpdate = {
      transactionId: this.transactionId,
      membersOfTransaction: members,
    };
    this.api
      .updateTransaction(payloadForTransactionUpdate)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
