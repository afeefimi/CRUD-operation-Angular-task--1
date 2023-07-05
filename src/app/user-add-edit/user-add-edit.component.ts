import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent implements OnInit {
  UserForm: FormGroup;
  options: string[] = ['Work', 'School', 'Business', 'Other'];
  showPassword: boolean = false; // Track whether to show the decrypted password

  constructor(
    private encryptionService: EncryptionService,
    private fb: FormBuilder,
    private _userService: UserService,
    private _dialogRef: MatDialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.UserForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      password: '',
      gender: '',
      category: '',
      app: ''
    });
  }

  ngOnInit(): void {
    if (this.data) {
      // Decrypt the password
      const decryptedPassword = this.encryptionService.decrypt(this.data.password);

      // Update the UserForm value including the decrypted password
      this.UserForm.patchValue({
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        dob: this.data.dob,
        gender: this.data.gender,
        category: this.data.category,
        app: this.data.app,
        password: decryptedPassword
      });

      // Set showPassword to true to display the decrypted password
      this.showPassword = true;
    }
  }

  onSubmitForm() {
    if (this.UserForm.valid) {
      if (this.data) {
        let updatedUser;
        if (this.UserForm.value.password) {
          // If a new password is provided, encrypt it
          const encryptedPassword = this.encryptionService.encrypt(this.UserForm.value.password);
          updatedUser = { ...this.UserForm.value, password: encryptedPassword };
        } else {
          // If no new password is provided, keep the existing encrypted password
          updatedUser = { ...this.UserForm.value, password: this.data.password };
        }
        
        this._userService.updateUser(this.data.id, updatedUser).subscribe({
          next: (val: any) => {
            alert('User updated');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      } else {
        const encryptedPassword = this.encryptionService.encrypt(this.UserForm.value.password);
        this.UserForm.patchValue({ password: encryptedPassword });
        this._userService.addUser(this.UserForm.value).subscribe({
          next: (val: any) => {
            alert('User added');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
    }
  }
}
