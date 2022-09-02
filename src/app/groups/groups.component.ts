import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  createGroupForm!: FormGroup;
  allGroups;
  partOfGroups = [];
  groupCreated = false;
  constructor(
    private api: DataProviderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchallGroups();
    this.toInitializeCreateGroupForm();
  }
  @HostListener('hide.bs.modal', ['$event']) onModalHide(event) {
    this.groupCreated = false;
    this.toInitializeCreateGroupForm();
  }

  toInitializeCreateGroupForm() {
    this.createGroupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      members: this.formBuilder.array([this.addMemberFormGroup()]),
    });
  }
  addMemberFormGroup() {
    return this.formBuilder.group({
      memberName: ['', Validators.required],
      userEmailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  addMemberButtonClick(): void {
    (<FormArray>this.createGroupForm.get('members')).push(
      this.addMemberFormGroup()
    );
  }
  getMembersFormControl(): AbstractControl[] {
    return (<FormArray>this.createGroupForm.get('members')).controls;
  }
  pointAt(index) {
    return (<FormArray>this.createGroupForm.get('members')).at(index);
  }

  removemember(index) {
    (this.createGroupForm.get('members') as FormArray).removeAt(index);
  }
  fetchallGroups() {
    let data = this.api.getAllGroups().subscribe((data) => {
      this.allGroups = data['data'].reverse();
      console.log(this.allGroups);

      this.partOfGroup();
    });
  }

  allData() {
    let user = JSON.parse(localStorage.getItem('user'));

    let obj = [{ memberName: user.userName, userEmailId: user.userEmailId }];

    this.createGroupForm.value.members = [
      ...this.createGroupForm.value.members,
      ...obj,
    ];
    this.api.createNewGroup(this.createGroupForm.value).subscribe((data) => {
      console.log(data);
      this.createGroupForm.reset();
      setTimeout(() => {
        this.fetchallGroups();
      }, 1000);

      this.groupCreated = true;

      let updateUser = {
        userName: user.userName,
        userEmailId: user.userEmailId,
        groupsInvolved: [...user.groupsInvolved, data['groupId']],
      };
      localStorage.setItem('user', JSON.stringify(updateUser));
      this.api.updateUser(updateUser).subscribe((data) => {
        console.log(data);
      });
    });
  }
  partOfGroup() {
    this.partOfGroups = [];
    let user = JSON.parse(localStorage.getItem('user'));
    this.allGroups?.forEach((ele) => {
      ele['members'].forEach((ele2) => {
        if (ele2['userEmailId'] == user.userEmailId) {
          if (!this.partOfGroups.includes(ele)) {
            this.partOfGroups.push(ele);
          }
          console.log(this.partOfGroups);
        }
      });
    });
  }
}
