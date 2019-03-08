import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


// 定义header
const host = environment.production ? 'http://www.aldexam.com:9080' : 'http://192.168.1.40:9080';
// const host = 'http://192.168.1.40:9080';
// 定义请求头
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})

export class CollegeDataService {

  constructor(
    private http: HttpClient
  ) { }

  // 获取名称类别
  getCollegeDate (): Observable<any> {
    return this.http.get<any>(`${host}/propertyGroup?size=100`, httpOptions);
  }

  /**获取表格信息
   * 根据条件查找DataTable数据
   * @param id propertyGroupId
   * @param name filter 条件，默认为undefined
   * @param page 当前页码数量，从0开始
   */
  findByGroupId (
    id: number,
    name: string,
    page: {
      size: number,
      number: number
    }
  ): Observable<any> {
    let url = `${host}/propertyId/search/findByPropertyGroupIdAndName?propertyGroupId=${id}&page=${page.number}&size=${page.size}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get<any>(url, httpOptions);
  }

  // 上传文件
  uploadFile (formModel: FormData): Observable<string> {
    console.log(formModel);
    const url = `${host}/import`;
    // 不加请求头
    return this.http.post<string>(url, formModel);
  }


  // 获取编辑面板信息
  getEditData (id: number): Observable<any> {
    return this.http.get<any>(
      `${host}/property/search/${id}`, httpOptions
    );
  }

  // 上传编辑信息
  save (editData: any): Observable<any> {
    console.log(1);
    return this.http.post<any>(`${host}/property`, editData, httpOptions);
  }

  // 删除编辑信息
  deleteEditDate (id: number): Observable<any> {
    return this.http.delete<any>(`${host}/propertyId/${id}`, httpOptions);
  }
}
