import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs'
import { GithubRepositoryResponse, Repository } from 'src/shared/model/github-repository-search-response'
import { Organization } from 'src/shared/model/github-organization';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  shareReplay,
  take,
} from 'rxjs/operators';


const GITHUB_URL = 'https://api.github.com/search/repositories';

@Component({
  selector: 'app-github-simple',
  templateUrl: './github-simple.component.html',
  styleUrls: ['./github-simple.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubSimpleComponent implements OnInit {
  queries = new Subject<string>();
  searchResult: Observable<GithubRepositoryResponse>
  organizations$: Observable<Organization[]>;
  selectedRepository$ = new Subject<Repository | undefined>();

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.searchResult = this.queries.pipe(
      map((query: string) => query ? query.trim() : ''),
      filter(Boolean),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => this.fetchGithubRepositories(query)),
      //filterByOwnerType(OwnerType.User)
      shareReplay(1)
    )

    this.organizations$ = this.selectedRepository$.pipe(
      map((repository) => repository && repository.owner.organizations_url),
      switchMap((url: string | false) => {
          return url ? this.fetchUserOrganizations(url) : of(undefined);
      }),
    )
  }

  onTextChange(query: string) {
    console.log(query)
    //this.searchResult = this.fetchGithubRepositories(query)
    this.queries.next(query);
  }

  onRepositoryMouseEvent(repository: Repository | undefined) {
    this.selectedRepository$.next(repository);
  }

  private fetchGithubRepositories(query: string):Observable<GithubRepositoryResponse> {
    const params = {q: query}
    //return this.http.get<GithubRepositoryResponse>(GITHUB_URL, { params })

    return this.http
            .get<GithubRepositoryResponse>(GITHUB_URL, { params })
            .pipe(
                map((response: GithubRepositoryResponse) => response)
            )
  }

  private fetchUserOrganizations(url: string): Observable<Organization[]> {
    return this.http.get<Organization[]>(url);
  }

  exportRepos() {  
    /*this.searchResult.subscribe(repos => {  
        console.log(repos);  
        //take(1)
    });*/

    this.searchResult.pipe(
      take(1)
    ).subscribe(repos => {
      console.log("Exporting\n", repos)
    })
  }

}
