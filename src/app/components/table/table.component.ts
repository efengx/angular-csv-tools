import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { CollegeDataService } from '../../service/college-data.service';
import { ActivatedRoute, Params, Router, ActivationStart } from '@angular/router';
import { TableDataSource } from './table-datasource';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  // 路由参数
  id: number;
  // 搜索框placehodel
  cName: String;
  // 搜索框数据
  filter: string;
  // 上传的文件名
  fileName: string;

  // 控制是否显示文件上传进度
  isUpdate: Boolean = false;

  constructor(
    private collegeDataService: CollegeDataService,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // 每一行的matColumnDef属性值对应这个方括号里的数据！！！
  displayedColumns = ['name', 'lastTime', 'createTime', 'operate'];
  dataSource: TableDataSource;

  ngOnInit () {
    // 获取路由参数
    this.routerInfo.params.subscribe((params: Params) => {
      this.id = params['pkid'];
      this.cName = params['name'];
    });

    // 初始化表格数据信息
    this.dataSource = new TableDataSource(
      this.paginator, this.sort, this.collegeDataService,
      this.id, this.filter, { number: 0, size: 10 }
    );


    // 监听router变化刷新dataTable
    this.router.events.subscribe(event => {
      if (event instanceof ActivationStart) {
        this.filter = null;
        this.id = parseInt(event.snapshot.paramMap.get('pkid'), 10);
        this.dataSource = new TableDataSource(
          this.paginator, this.sort, this.collegeDataService,
          this.id, this.filter, { number: 0, size: 10 }
        );
      }
    });
  }

  /**分页事件
   * @param e
   */
  onPage (event) {
    this.dataSource = new TableDataSource(
      this.paginator, this.sort, this.collegeDataService,
      this.id, this.filter, {
        number: event.pageIndex,
        size: event.pageSize,
        totalElements: event.length
      }
    );
  }


  addRightFile () {
    const fi = this.fileInput.nativeElement;
    const fileToUpload = fi.files[0];
    this.fileName = fileToUpload.name;
    const input = new FormData();
    input.append('files', fileToUpload);
    input.append('propertyGroupId', this.id.toString());
    const that = this;
    this.collegeDataService.uploadFile(input).subscribe(
      (response) => {
        console.log(response);
      },
      (err) => {
        if (err.error.text === 'success') {
          this.isUpdate = false;
          that.snackBar.open('上传成功', '', {
            duration: 800,
            verticalPosition: 'top',
          });
          that.dataSource = new TableDataSource(
            this.paginator, this.sort, this.collegeDataService,
            this.id, this.filter, this.dataSource.page
          );
        }
      },
      () => {
        console.log('Completed');
      }
    );
  }
  /**文件上传
   */
  addFile (): void {
    const fi = this.fileInput.nativeElement;
    const fileToUpload = fi.files[0];
    const that = this;
    if (fi.files && fi.files[0]) {
      const rightFileName = fileToUpload.name.slice(fileToUpload.name.indexOf('.') + 1);
      const fileSize = fileToUpload.size;
      if (rightFileName === 'csv' && fileSize <= 5242880) {
        this.isUpdate = true;
        this.addRightFile();
      } else if (rightFileName !== 'csv') {
        that.snackBar.open('文件格式不正确！', '', {
          duration: 800,
          verticalPosition: 'top',
        });
      } else {
        that.snackBar.open('文件太大了！', '', {
          duration: 800,
          verticalPosition: 'top',
        });
      }
    }
  }

  /**筛查
   */
  search () {
    this.dataSource = new TableDataSource(
      this.paginator, this.sort, this.collegeDataService,
      this.id, this.filter, { number: 0, size: 10 }
    );
  }

  // 删除数据
  delete (id) {
    const that = this;
    this.collegeDataService.deleteEditDate(id).subscribe(
      () => {
        that.dataSource = new TableDataSource(
          this.paginator, this.sort, this.collegeDataService,
          this.id, this.filter, this.dataSource.page
        );
      },
      err => {
        console.log(err);
      },
      () => {
        that.snackBar.open('删除成功！', '', {
          duration: 800,
          verticalPosition: 'top',
        });
      }
    );
  }

  // 弹出框确认是否删除数据
  openDialog (id) {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(id);
      } else {

      }
    });
  }
}
