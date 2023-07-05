import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './services/user.service';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PasswordsComponent } from './passwords/passwords.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-first';
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email','dob','gender','category','app','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog : MatDialog, private _UserService : UserService){


  }
  ngOnInit(): void {
    this.getUserlist();
  }
OpenAddEditForm(){

  const dialogRef = this._dialog.open(UserAddEditComponent)
  dialogRef.afterClosed().subscribe({
    next: (val) =>{
      if(val){
        this.getUserlist();
      }

    }
  })

}
getUserlist(){
this._UserService.getUserlist().subscribe({
  next:(res)=> {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator=this.paginator;
    
  },
  error: console.log,
})

}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

deleteUser(id: number){
this._UserService.deleteUser(id).subscribe({

  next :(res) =>{
    alert('User deleted');
    this.getUserlist();
  },
  error:console.log,

})

}
openEditForm(data : any ){
const dialogRef = this._dialog.open(UserAddEditComponent,{
  data,
})
dialogRef.afterClosed().subscribe({
  next: (val) =>{
    if(val){
      this.getUserlist();
    }

  }
})



  
}
openAllPassword(){
  const dialogRef3 = this._dialog.open(PasswordsComponent)
}
}
