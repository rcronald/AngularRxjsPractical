import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubSimpleComponent } from './github-simple.component';

describe('GithubSimpleComponent', () => {
  let component: GithubSimpleComponent;
  let fixture: ComponentFixture<GithubSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
