import { ComponentFixture, TestBed,async, inject  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { FormGroup, FormBuilder, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  let httpClient : HttpClient;
  let url = 'localhost:3000/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule,HttpClientTestingModule,ReactiveFormsModule,ToastrModule.forRoot()],
      providers: [HomeComponent],
      declarations: [ HomeComponent ]
    })
    .compileComponents();
    component = TestBed.get(component);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it(`should fetch posts as an Observable`, async(inject([HttpTestingController, HomeComponent],
  //   (httpClient: HttpTestingController, HomeComponent: HomeComponent) => {
  //     const postItem = [
  //       {
  //         "userId": 1,
  //         "id": 1,
  //         "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  //         "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  //       },
  //       {
  //         "userId": 1,
  //         "id": 2,
  //         "title": "qui est esse",
  //         "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  //       },
  //       {
  //         "userId": 1,
  //         "id": 3,
  //         "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
  //         "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  //       }
  //     ];

  //     HomeComponent.getAllTransactionTest()
  //       .subscribe((trans: any) => {
  //         console.log(trans)
  //         expect(trans.length).toBe(3);
  //       });
  //     let req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
  //     expect(req.request.method).toBe("GET");
  //     req.flush(postItem);
  //     httpMock.verify();
  //   })));

  // it("should return data", () => {
  //   const names = [{tid: 1}, {tid: 2}];

  //   component.getAllTransactionTest().subscribe((res) => {
  //     console.log(res)
  //     expect(res).toEqual(names);
  //   });

  //   const req = httpMock.expectOne('/getTransaction');
  //   console.log(req)
  //   expect(req.request.method).toEqual("GET");
  //   req.flush(names);

  //   httpMock.verify();
  // });

  it('should call getTransaction and return an array of Trans', () => {
    // const testArr = [{tid:1}]
    // component.getAllTransactionTest().subscribe((res) => {
    //   //2
    //   expect(res).toEqual(testArr);
    // });
    // console.log("**********");
    // //3
    // const req = httpMock.expectOne({
    //   method: 'GET',
    //   url: `${url}/getTransaction`,
    // });
    // console.log(req)
    // //4
    // req.flush(testArr);
    //Arrange
    //Set Up Data 
    let employee = [{tid :1}];
 
    //Act
    component.getAllTransactionTest().subscribe((emp)=>{
      //Assert-1
      // let d=[{tid :1}];
      expect(emp).toEqual(employee);
 
    });
     
    //Assert -2
    const req = httpMock.expectOne('/getTransaction');
 
    //Assert -3
    httpMock.verify();
  });
});
