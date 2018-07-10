import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZetapushProjectComponent } from './zetapush-project.component';

describe('ZetapushProjectComponent', () => {
  let component: ZetapushProjectComponent;
  let fixture: ComponentFixture<ZetapushProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZetapushProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZetapushProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
