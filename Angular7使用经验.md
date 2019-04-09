1. 动态创建的组件需要在NgModule里面动态创建

```
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    DialogResultExampleDialog        
  ],
  entryComponents: [DialogResultExampleDialog]
```

2. 兄弟组件传值方式
- 依赖注入大法
- 依靠LCA来中转
