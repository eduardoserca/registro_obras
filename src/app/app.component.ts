import { Component, OnInit } from '@angular/core';
// import { SharedService } from './services/shared.service';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {

    // const navEndEvents$ = this.router.events
    //   .pipe(
    //     filter(event => event instanceof NavigationEnd)
    //   );

    // navEndEvents$.subscribe((event: NavigationEnd) => {
    //   gtag('config', 'UA-84656270-10', {
    //     'page_path': event.urlAfterRedirects
    //   });
    // });
  }

  ngOnInit() { }
}
