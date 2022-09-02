import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  constructor(private http: HttpClient) {}
  // URI = 'https://node-trainiing.herokuapp.com/api/v1/';
  URI = 'http://localhost:5000/api/v1/';
  getUser(user) {
    return this.http.post(this.URI + 'bills/LoginUser', user);
  }
  newUSer(userRegisterForm) {
    return this.http.post(this.URI + 'bills/User', userRegisterForm);
  }
  updateUser(userData) {
    return this.http.put(this.URI + 'bills/User', userData);
  }

  createNewGroup(data) {
    return this.http.post(this.URI + 'bills/Group', data);
  }
  getAllGroups() {
    return this.http.get(this.URI + 'bills/Group');
  }

  getAlltransactions(groupId) {
    return this.http.get(this.URI + 'bills/' + groupId + '/allTransaction');
  }
  getSingleTransactions(transactionId) {
    return this.http.get(this.URI + 'bills/' + transactionId + '/Transaction');
  }
  createTransaction(transaction) {
    console.log(transaction);
    return this.http.post(this.URI + 'bills/Transaction', transaction);
  }
  getGroup(groupId) {
    return this.http.get(this.URI + 'bills/' + groupId + '/Group');
  }

  userLoggedIn() {
    return !!localStorage.getItem('user');
  }
  createComment(comment) {
    return this.http.post(this.URI + 'bills/Comment', comment);
  }

  getAllComments(transactionId) {
    return this.http.get(this.URI + 'bills/' + transactionId + '/allComments ');
  }
  updateTransaction(transaction) {
    return this.http.put(this.URI + 'bills/Transaction', transaction);
  }
}
