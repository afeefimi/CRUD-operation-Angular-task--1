import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';




@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.css']
})
export class PasswordsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'lastName', 'password','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  constructor(private _UserService: UserService,private _dialog : MatDialog ){
    
  }
  ngOnInit(): void {
    this.getUserlist();
    
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
}
