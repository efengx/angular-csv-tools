import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CollegeDataService } from '../../service/college-data.service';
import { Dialog } from '../../entity/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  // 路由参数
  id: number;
  pkid: number;
  cName: string;

  // 后台数据
  editData: any;

  // 查询名
  name: String;


  isActive: Boolean = false;

  addData: Dialog = {
    addNumber: 0,
    addName: ''
  };

  constructor(
    private routerInfo: ActivatedRoute,
    private snackBar: MatSnackBar,
    private college: CollegeDataService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit () {
    this.routerInfo.params.subscribe((params: Params) => {
      this.pkid = params['pkid'];
      this.id = params['id'];
      this.cName = params['Cname'];
    });
    this.college.getEditData(this.pkid).subscribe(data => {
      if (data.propertyValues) {
        const tmpData = data.propertyValues;
        const len = tmpData.length;
        for (let i = 0; i < len; i++) {
          // 将后台传来的数据转换成JSON格式
          if (tmpData[i].propertyName.istable) {
            if (tmpData[i].value !== null) {
              tmpData[i].value = JSON.parse(tmpData[i].value);
            } else {
              tmpData[i].value = [];
            }
          }
          if (tmpData[i].value && tmpData[i].value.length > 600) {
            tmpData[i]['row'] = 15;
          } else if (tmpData[i].value && tmpData[i].value.length > 40) {
            tmpData[i]['row'] = 5;
          } else {
            tmpData[i]['row'] = 1;
          }
        }
        this.name = data.name;
        this.editData = tmpData;
      }
    });
  }

  // 添加行
  addRow (i) {
    const obj = {
      value: [
        { key: '' },
      ],
      key: '',
    };
    this.editData[i].value.splice(0, 0, obj);
  }
  // 添加列
  addColumn (i, a) {
    const obj = {
      key: '',
    };
    this.editData[i].value[a].value.splice(0, 0, obj);
  }
  // 自动增加文本域的高
  rowsAuto (index) {
    this.editData[index].row++;
  }
  goBlue () {
    this.isActive = true;
  }
  goGrey () {
    this.isActive = false;
  }
  // 转换编辑上传的数据的格式
  getFormDataFn () {
    const that = this;
    const sendData = {
      id: that.pkid,
      propertyValues: []
    };
    const arr = [];
    let obj = {};
    let val = '';
    for (let i = 0; i < this.editData.length; i++) {
      // 判断value是否是数组类型，若是数组则转换成JSON字符串格式
      if (this.editData[i].value instanceof Array) {
        val = JSON.stringify(this.editData[i].value);
      } else {
        val = this.editData[i].value;
      }
      if (this.editData[i].id) {
        obj = {
          id: this.editData[i].id,
          value: val
        };
      } else {
        obj = {
          value: val,
          propertyName: {
            id: this.editData[i].propertyName.id
          }
        };
      }
      arr.push(obj);
    }
    sendData.propertyValues = arr;
    return sendData;
  }

  // 回到首页
  goBack () {
    this.router.navigate([`home/table/${this.id}/${this.cName}`])
  }

  // 确认更改编辑信息
  confirm (e) {
    this.college.save(this.getFormDataFn()).subscribe(
      x => console.log('Observer got a next value: ' + x),
      err => {
        if (err.error.text === 'success') {
          this.snackBar.open('编辑成功！', '', {
            duration: 500,
            verticalPosition: 'top',
          });
          this.goBack();
        }
      },
      () => console.log('Observer got a complete notification')
    );
  }

  // 取消
  cancel () {
    this.goBack();
  }
}
