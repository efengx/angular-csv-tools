import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollegeDataService } from '../../service/college-data.service';
import { College } from '../../entity/college';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 类别列表名变量
  links: Array<College>;

  // 进度条是否显示
  isShowProgress: Boolean;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private college: CollegeDataService,
    private router: Router
  ) { }

  ngOnInit () {
    // 获取类别列表名
    this.college.getCollegeDate().subscribe(u => {
      this.links = u._embedded.propertyGroup;
    });
    // 监听路由
    this.router.events
      .subscribe((event) => {
        // 导航开始
        if (event instanceof NavigationStart) {
          this.isShowProgress = true;
          // 导航结束
        } else if (event instanceof NavigationEnd) {
          this.isShowProgress = false;
        }
      });
  }
}


