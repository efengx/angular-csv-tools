import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable, of } from 'rxjs';
import { TableData } from '../../entity/table-data';
import { mergeMap } from 'rxjs/internal/operators';
import { CollegeDataService } from '../../service/college-data.service';



/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableData> {
  data: TableData[];

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private collegeDataService: CollegeDataService,
    private id: number,
    private filter: string,
    public page: {       // 初始化分页数据
      totalElements?: 0, // 总条数
      totalPages?: 0,    // 总页数
      size: 10,         // 默认每页显示数量
      number: 0,         // 当前页码
    }
  ) {
    super();
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect (): Observable<TableData[]> {
    return this.collegeDataService.findByGroupId(this.id, this.filter, this.page).pipe(
      mergeMap(data => {
        this.page = data.page;
        return of(data._embedded.propertyId as TableData[]);
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect () { }
}
