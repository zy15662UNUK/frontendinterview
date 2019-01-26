##### ads system
- db
  - DBConnection interface： http://www.runoob.com/java/java-interfaces.html. 规定了如下接口
    1. close
    2. public List<AdItem> searchAdItems(); return all ads
    3. public float getBudget(int advertiser_id); Given an advertiser_id, return budget of this advertiser
    4. public void updateBudget(int advertiser_id, double budget); Update advertiser budget
    5. public void updateBid(int ad_id, double bid); Update ad bid
    6. public long createAdvertiser(String advertiser_name, double budget);  create an advertiser
    7. public long createAd(double bid, String image_url, int advertiser_id, double ad_score) create an ad
  - DBConnectionFactory.java. 工厂模式 http://www.runoob.com/design-pattern/factory-pattern.html。 返回不同的应用DBConnection interface的class。例如MySQLConnection和MongoDBConnection这两种不同数据库
  - 想问下老师这里DBConnection interface的作用是什么？为什么不直接写一个MySQLConnection而要去implement DBConnection
    实现具体功能时，接口和实现的类分离。接口定义为XxxService，实现为XxxServiceImpl。
    接口提供了一个公用的方法提供方。 接口是用来规定子类的行为的。
    面向接口编程的好处：
    1.根据客户提出的需求提出来，作为接口的；业务具体实现是通过实现接口类来完成的。
    2.当客户提出新的需求时，只需编写该需求业务逻辑新的实现类。
    3.假如采用了这种模式，业务逻辑更加清晰，增强代码可读性，扩展性，可维护性。
    4.接口和实现分离，适合团队协作开发。
    5.实现松散耦合的系统，便于以后升级，扩展。

- db.mysql
  - MySQLDBUtil.java 提供一些建立MySQL的链接所用的一些常量参数
  - MySQLTableCreation.java //用程序来和数据库建立连接并在其中创建表
  - MySQLConnection： 实现了DBConnection接口。运用MySQL增删改查数据库的各个表。同时将调用Ticketmaster的代码在这里实现
- entity
  - AdItem: item对象。用于存储每个活动的具体信息(需要返还给前端的信息) 以及一个转成JSON对象方法


- rpc:
    - RpcHelper: 接受JSONObject or JSONArray并通过response将接受的东西转换成json字符串返回给前端。将前端的JSON字符串变成JSON对象
    - CreateAdvertiser: 在数据库中创建一个新的Advertiser的API。读取前端传来的advertiser_name，budget。调用MySQLConnection的createAdvertiser创造一个新的advertiser 并获取它的id，用RPCHelper的writeJsonObject换成json返回给前端
    - Ad: 返回adscore最高的那个adItem，并按照secondHighestAdRankScore / adWithHighestRank.getAd_score() + 0.01;这个公式来算出最高adscore的ad的实际cost并且更新它的budget
    - CreateAd: 调用MySQLConnection的createAd，根据前端传来的信息创建一个新的ad
    - UpdateBid: 调用MySQLConnection的updateBid，根据前端传来的信息修改指定ad的bid
    - UpdateBudget: 调用MySQLConnection的updateBudget，根据前端传来的信息修改指定ad的budget



- sql 语句
  - `INSERT INTO advertiser (name,budget) VALUES ((?), (?))`
  - `DROP TABLE IF EXISTS ad`

  ```
  sql = "CREATE TABLE advertiser ("
					+ "advertiser_id int NOT NULL AUTO_INCREMENT," // 如果不提供advertiser_id，则自增生成一个。默认从1开始
					+ "name VARCHAR(255),"
					+ "budget FLOAT,"
					+ "PRIMARY KEY (advertiser_id)"
					+ ")";
  ```

##### Spring

- 教程 https://www.jianshu.com/p/bd87d5507f5e     http://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
- 框架：call我们写的code。Jupiter项目中看似没有main函数，但是实际上是被包装到tomcat server中了，servlet中我们注册了URL，告诉在何种情况下调用servlet函数。每次启用服务器之后，main 函数就启动了，按照前端发来的事件来调用servlet中回调函数。类似于前端的事件注册
- Hibernate主要是用来和数据库交互的ORM。Jupiter中我们都是写sql语句来操作数据库。但是Hibernate把数据库的操作变成了对java对象的操作，就不需要再放SQL语句了
- J2EE就是一个framework，tomcat是用来管理web的endpoint
- 库：被主动调用的。JSONArray这个就相当于是一个库。我们使用了它的接口(new一个实例)
- spring是啥:
    1. Spring is the most broadly used framework for the development of Java Enterprise Edition applications.
    2. JavaEE is a set of specifications, extending Java SE with specifications for enterprise features such as distributed computing and web services.
- spring的modules：
  1. container：装的是所需的资源，spring来代为管理，不需要我们像调用库那样创建实例，有Beans Core Context SpEL
  2. Core Container: 核心模块, 包含Inversion of control(控制反转)、Dependency Injection(依赖注入)核心特性.
  3. Web:  Spring MVC的实现. 主要为Web开发提供支持.
  4. AOP:  Spring-aop提供了一个Aspect Oriented Programming实现.
  5. Spring也有自己的ORM，但是大家一般都用Hibernate来管理数据库，这里就涉及到同时及使用多个框架了
- bean
  A JavaBean is just a standard
  1. All properties private (use getters/setters)
  2. A public no-argument constructor
  3. Implements Serializable.
  - spring概念里Any normal java class that is initialized by Spring IoC container is called bean.

  - bean的scope:
    1. singleton 该作用域将 bean 的定义限制在每一个 Spring IoC 容器中的一个单一实例(默认). 也就是每次get获取都是同一个instance
    2. prototype 该作用域将 bean 的定义限制在任意数量的对象实例。
- spring的core container介绍
  1. Inversion of Control & Dependency Injection
    传统的代码, 每个对象负责管理自己依赖的对象, 导致如果需要切换依赖对象的实现类时,需要修改多处地方.Jupiter 项目里，如果需要数据库连接，我们需要 new 一个数据库的实例。

    而通过控制反转，我们不自己创建实例，而是向第三方请求一个数据库实例。例如JSONArray就不用我们创建实例了，直接找spring要。这样就不需要去修改代码。spring中是用一个config 的xml文件来管理。到时候不用修改代码中的实例，只用修改xml中的调用方式就好

    依赖注入：spring在配置文件中管理并调用所需要资源。就不需要在代码里手动注入

  2. 除了使用xml文件来config (XML configuration)，还可以用java来 (Annotation-based configuration)。

  3. config的内容可以自己写也可以交由spring自己搜索文件(`@componentScan(basePackages="com.laioffer.spring_hellowword")`)。如果有多个candidate需要选择时候(prototype而不是singleton)，就必须手写来自己指定好。比如同一个interface有两个class实现，这时候就需要我们自己指定到底使用哪个class
  4. `@componenet @configuration @bean @componentScan`
    1. 在xml配置了“<context:component-scan base-package="...." />” 这个标签后，spring可以自动去扫描base-package下面或者子包下面的java文件，如果扫描到有`@Component` `@Controller` `@Service` `@Repository`等这些注解的类，则把这些类注册为bean.
    2. `@Component`是用来标记任何被Spring管理的组件。
    3.` @Controller`用来标记presentation层（比如web controller）。
    4. `@Repository`用来标记persistence层（比如DAO）。
    5. `@Service`用来标记service层。
    6. `@Configuration`:表面这个class是用来管理bean的配置文件


    ```
    @Component
    public class PaymentAction {

    	private ILogger logger; //这里logger就是对应调用了congfigration中叫logger的bean

      @Autowired // 依赖注入。告诉spring需要自动引入logger的实例，也就是congfigration中叫logger的bean。这里就是类似于import + 创造instance并传入. 必须在setter或者constructor前面。 https://www.jianshu.com/p/eed4d9c7a11d
      public void setLogger(iLogger logger) {
        this.logger = logger;
      }
    	public void pay(BigDecimal payValue) {
    		logger.log("pay begin, payValue is " + payValue);
    		logger.log("pay end");
    	}
    }

    @Configuration
    @ComponentScan(basePackages = "aop")
    public class PaymentJavaConfig {

        @Bean
        @Scope
        public ILogger getIlogger() {
            return new ConsoleLogger();
        }
    }


    public class Application {
        public static void main(String[] args) {
            ApplicationContext context = new AnnotationConfigApplicationContext(PaymentJavaConfig.class);
            PaymentAction paymentAction = (PaymentAction) context.getBean("paymentAction"); // inversion control控制反转。然后这里创建paymentAction实例本来是需要传入一个logger实例的。但是spring在这里就帮我们省去了这一步。这里只用直接调用paymentAction就可以了。因为传入这一步已经由@Autowired搞定了
            paymentAction.pay(new BigDecimal(2));
        }
    }

    ```

  5. 总结
    什么是dependency? 类的成员变量
    什么是容器？生成Bean实例的工厂，并且管理容器中的Bean
    什么是控制反转? 不在主动创建依赖, 而是通过向容器申请所需要的依赖
    什么是dependency injection？容器将所需要的依赖注入到类中的过程(使用的是java反射机制)
      通过a的接口，把b传入； setter
      通过a的构造，把b传入； construcor
      通过设置a的属性，把b传入；
      这个过程叫依赖注入（DI）。
      https://blog.csdn.net/chenssy/article/details/8171427
      https://www.jianshu.com/p/eed4d9c7a11d
    为什么要用spring？ 解耦
- maven: 自动下载安装包的工具。自动安装所需要第三方库。最后打包项目
- dao: data access object
- 每次run项目时候两步走 1. run as maven clean 2. run as maven install


##### Hibernate   https://www.w3cschool.cn/hibernate/1yok1ie1.html
- ORM: Java 存储数据和SQL还是特别不同的。ORM就是将语言中对数据的操作变成数据库对数据的操作
- ORM PROS:
    DRY (Don’t Repeat Yourself): model code in one place, and reusable for different DBMS.
    Doesn’t require too much SQL knowledge. Code in your favorite language.
    Apply OOP knowledge.
- ORM CONS:
    Set up can be cumbersome.
    Performance may not match better tweaked raw SQL.
- orm 底层还是靠JDBC但是封装在底层接触不到
- What is Java Persistence API (JPA)?
  A specification that describes the management of relational data in applications using Java.
- Hibernate组成
  - SessionFactory：生成session
  - Session: Session object is the interface between java application code and hibernate framework and provide methods for CRUD operations.
  - Transaction: Transaction is a single-threaded, short-lived object used by the application to specify atomic units of work. 保证存储的一致性完整性。一旦有一部分出现问题，就会回滚到所有语句执行都完成的之前状态。atomic 是原子态，不可分割，也就是要么都成功要么都失败。transaction persec （TPS）是一个性能的概念

- hIbernate 的配置

```

@Configuration
public class ApplicationConfig {

	@Bean(name = "dataSource") // 使用spring额bean
  //里面的都是
	public DataSource dataSource() { //配置和数据库链接的参数（URL等）
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
		dataSource.setUrl("jdbc:mysql://localhost:3306/ecommerce?serverTimezone=UTC");
		dataSource.setUsername("root");
		dataSource.setPassword("root");

		return dataSource;
	}

	@Bean(name = "sessionFactory")
	public LocalSessionFactoryBean sessionFactory() {
		LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		sessionFactory.setPackagesToScan("onlineShop.model"); // hybernate需要管理
		sessionFactory.setHibernateProperties(hibernateProperties());
		return sessionFactory;
	}

	private final Properties hibernateProperties() {
		Properties hibernateProperties = new Properties();
		hibernateProperties.setProperty("hibernate.hbm2ddl.auto", "create-drop");
		hibernateProperties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect"); //设施sql的语法
		hibernateProperties.setProperty("hibernate.show_sql", "true"); // debug的，显示操作的具体详情
		return hibernateProperties;
	}

}

```
- Annotation-based configuration 和 Java-based configuration的差别
  从配置方式来看Annotation-based configuration是基于xml而Java-based configuration完全由java class来实现的. Annotation-based configuration主要是创建注解了@Component的class的实例, 而Java-based configuration会执行注解了@Bean的method来得到实例. Annotation-based configuration有个缺陷是无法在我们引入的第三方的jar包里添加@Component, 用Java-based configuration就可以来弥补这个. 一般这两个是混合使用的. 假如使用Annotation-based configuration， 那么我们可以创建一个class并注解@Configuration 并把一些无法通过annotation创建的类通过@Bean的方式来实例化 假如使用Java-based configuration, 我们可以使用@ComponentScan来创建注解了@Component的class的实例
- what is Hibernate? What does it help a programmer do?
  hibernate主要是作用于relational database的(mysql, oracle等). 使用hibernate主要是为了应用面向对象的思想来对数据库进行操作, 避免编写复杂的sql语句. 如果数据要存Nosql DB的话直接使用他们提供的API即可.
- Important annotations used for Hibernate mapping
  javax.persistence.Entity: Used with model classes to specify that they are entity beans(pojo). @Entity hibernate创建一个叫book的table
  javax.persistence.Table: Used with entity beans to define the corresponding table name in database.
  javax.persistence.Id: Used to define the primary key in the entity bean.
  javax.persistence.Column: Used to define the column name in database table.
  javax.persistence.EmbeddedId: Used to define composite primary key in the entity bean.
  javax.persistence.GeneratedValue: Used to define the strategy to be used for generation of primary key. 例如生成年龄
  javax.persistence.OneToOne: Used to define the one-to-one mapping between two entity beans. We have other similar annotations as OneToMany, ManyToOne and ManyToMany
  org.hibernate.annotations.Cascade: Used to define the cascading between two entity beans, used with mappings. It works in conjunction with org.hibernate.annotations.CascadeType 删除一个另一个删除

  例子

  ```

  @Entity(name = "Book") //hibernate创建一个叫book的table CREATE TABLE IF NOT EXIST。不写这句的话生成的表就叫Book
  public static class Book {
      @Id // 那么下面的就是primary key
      @GeneratedValue // 数据库自己生成id
      private Long id;

      //@column， 不写就是默认是table 的column。名字相同
      private String title;
      private String author;
      private Publisher publisher;
  }

  @Embeddable // 不用将这个class单独生成一个表，只用将它放进book表中就可以.只要有一个表中有publisher。Publisher它里面的字段就会被插入进表中
  public static class Publisher {
      @Column(name = "publisher_name") // 数据库column的名称。这里需要改名所以就要@column.  仅能创建表时候用
      private String name;
      @Column(name = "publisher_country")
      private String country;
      public Publisher(String name, String country) {
          this.name = name;
          this.country = country;
      }
      private Publisher() {}
  }

  create table Book (
      id bigint not null,
      author varchar(255),
      publisher_country varchar(255),
      publisher_name varchar(255),
      title varchar(255),
      primary key (id)
  )

  ```
- primary key只能是:
    any Java primitive type
    any primitive wrapper type
    java.lang.String
    java.util.Date
    java.sql.Date
    java.math.BigDecimal
    java.math.BigInteger

- 组合键Composite identifiers. 比如user_id + item_id作为主键

```

Modeling a composite identifier using an EmbeddedId simply means defining an embeddable to be a composition for the one or more attributes making up the identifier, and then exposing an attribute of that embeddable type on the entity.

@Entity
@Table(name = "history")
public class PersistentHistory {

 @EmbeddedId //   Used to define composite primary key in the entity bean. 这样historyId里面两个键组合起来变成主键
 private HistoryId historyId;

 @Column(name = "last_favor_time")
 private Timestamp lastFavorTime;
}

@Embeddable //整体被插入别的表
public class HistoryId implements Serializable {

 @Column(name = "item_id")
 private String itemId;

 @Column(name = "user_id")
 private String userId;

 @Override
 public boolean equals(Object o) {
 }

 @Override
 public int hashCode() {
 }
}

```

- association
  ManyToOne: have a direct equivalent in the relational database as well (e.g. foreign key)。必须有。底下的key是foreign key
  oneToMany 不一定有

```

@Entity(name = "Person")
public static class Person {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL) // 一个人多个phone。这是冗余的信息。不会真的在数据库存在.mappedBy = "field"。被phone给map
    private List<Phone> phones = new ArrayList<>();

    public Person() {
    }

    public Person(Long id) {
        this.id = id;
    }
}

@Entity(name = "Phone")
public static class Phone {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "number", unique = true)
    private String number;

    @ManyToOne
    @JoinColumn(name = "person_id") //多个pnone对应一个人 人就是foreign key. 这个field名称叫person_id, refer person的primry key
    private Person person; //这里就指出了和person这张表中primary key对应。而这里的变量名person就是field，也就是 Person中的mappedBy = "person"所对应的field
}
```
  one to one

```
@Entity(name = "Phone")
public static class Phone {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "number")
    private String number;

    @OneToOne(mappedBy = "phone", cascade = CascadeType.ALL)一对一连接phoneid。mappedBy = "phone"意思是phone的primary key对应PhoneDetails中phone这个field（变量名），也就是phone_id这个column
    private PhoneDetails details;

    public Phone() {
    }
}

@Entity(name = "PhoneDetails")
public static class PhoneDetails {

    @Id
    @GeneratedValue
    private Long id;

    private String provider;

    private String technology;

    @OneToOne(fetch = FetchType.LAZY) // 和外键类似 phone_id指向phone中id
    @JoinColumn(name = "phone_id")
    private Phone phone;

    public PhoneDetails() {
    }
}

CREATE TABLE Phone (
    id BIGINT NOT NULL ,
    number VARCHAR(255) ,
    PRIMARY KEY ( id )
)

CREATE TABLE PhoneDetails (
    id BIGINT NOT NULL ,
    provider VARCHAR(255) ,
    technology VARCHAR(255) ,
    phone_id BIGINT ,
    PRIMARY KEY ( id )
)
```
many to many

```
@Entity(name = "Person")
public static class Person {

    @Id
    @GeneratedValue
    private Long id;

    private String registrationNumber;

    @ManyToMany(cascade = {CascadeType.PERSIST}) // 多对多不能是CascadeType.ALL
    private List<Address> addresses = new ArrayList<>();

    public Person() {
    }

    public Person(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
}

@Entity(name = "Address")
public static class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String street;

    @Column(name = "number")
    private String number;

    private String postalCode;

    @ManyToMany(mappedBy = "addresses")
    private List<Person> owners = new ArrayList<>();

    public Address() {
    }

    public Address(String street, String number, String postalCode) {
        this.street = street;
        this.number = number;
        this.postalCode = postalCode;
    }
}

```

- examples

```
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext(ApplicationConfig.class);

		SessionFactory sessionFactory = (SessionFactory) context.getBean("sessionFactory");

		Session session = sessionFactory.openSession();
		session.beginTransaction(); // 修改数据库之前一定要开启一个transaction


		// OneToOne example——————————————————————————————————————————————————————————————————————————————————————————————
		Phone phone1 = new Phone();
		phone1.setNumber("1234567890");

		PhoneDetails phone1details = new PhoneDetails();
		phone1details.setProvider("AT&T");
		phone1details.setPhone(phone1);
		phone1.setDetails(phone1details);

		session.save(phone1);  // Cascade here 或者 session.persist

		Phone phone2 = new Phone();
		phone2.setNumber("98765143210");

		session.save(phone2);

		// OneToMany example——————————————————————————————————————————————————————————————————————————————————————————
		Person person1 = new Person();
		person1.setName("John Doe");

		phone1.setPerson(person1);
		phone2.setPerson(person1);

		List<Phone> phones = new ArrayList<>();
		phones.add(phone1);
		phones.add(phone2);
		person1.setPhones(phones);// 一个人对应多个phone

		session.save(person1);

		// ManyToMany Example
		Address addr1 = new Address();
		addr1.setStreet("Street 1");
		session.save(addr1);

		Address addr2 = new Address();
		addr2.setStreet("Street 2");
		session.save(addr2);

		Person person2 = new Person();
		person2.setName("Jane Doe");

		List<Address> owner1addrs = new ArrayList<>();
		owner1addrs.add(addr1);

		person1.setAddresses(owner1addrs);

		List<Address> owner2addrs = new ArrayList<>();
		owner2addrs.add(addr1);
		owner2addrs.add(addr2);
		person2.setAddresses(owner2addrs);

		session.save(person1);
		session.save(person2);


		session.getTransaction().commit();

		// Query example——————————————————————————————————————————————————————————————————————————————————————————

		CriteriaBuilder criteria = session.getCriteriaBuilder();
		CriteriaQuery<Person> query = criteria.createQuery(Person.class);
		Root<Person> from = query.from(Person.class);

		CriteriaQuery<Person> select = query.select(from);
		TypedQuery<Person> typedQuery = session.createQuery(select);
		List<Person> results = typedQuery.getResultList();

		for (Person person : results) {
			System.out.println("ID: " + person.getId() + ", Name: " + person.getName());
		}

		// Delete by cascading ————————————————————————————————————————————————————————————————————————————————————
		session.beginTransaction();

		Person personToDelete = (Person) session.load(Person.class, results.get(0).getId());
		session.delete(personToDelete);

		session.flush();

	}
}

```
- cascade是什么

重复性的操作十分烦琐，尤其是在处理多个彼此关联对象情况下，此时我们可以使用级联（Cascade）操作。级联 在关联映射中是个重要的概念，指当主动方对象执行操作时，被关联对象（被动方）是否同步执行同一操作。
级联还指用来设计一对多关系。例如一个表存放老师的信息:表A（姓名，性别，年龄），姓名为主键。还有一张表存放老师所教的班级信息:表B（姓名，班级）。他们通过姓名来级联。级联的操作有级联更新，级联删除。 在启用一个级联更新选项后，就可在存在相匹配的外键值的前提下更改一个主键值。系统会相应地更新所有匹配的外键值。如果在表A中将姓名为张三的记录改为李四，那么表B中的姓名为张三的所有记录也会随着改为李四。级联删除与更新相类似。如果在表A中将姓名为张三的记录删除，那么表B中的姓名为张三的所有记录也将删除。
    http://westerly-lzh.github.io/cn/2014/12/JPA-CascadeType-Explaining/
新增~~(保存)~数据(CascadeType.PERSIST)


##### Spring MVC

- MVC是什么
  M即Model(模型层): 主要负责业务逻辑以及数据库的交互
  对应数据库及数据操作代码
  V 即View(视图层): 主要用于显示数据和提交数据
  C 即Controller(控制层): 主要是用作捕获请求并控制请求转发
- spring中就只有1个servlet，就是dispatch servlet。这样方便跳转 统一的异常处理。这样就不用重复写很多try catch了
- Spring MVC的五大组件
  1. 前端控制器 (DispatcherServlet)
     统一处理用户请求 (URL)
  2. 映射处理器(HandlerMapping)
     找到开发者提供的 Controller
  3. 处理器(Controller)
      请求的业务逻辑
  4. 模型和视图(ModelAndView)
      处理结果。返回给控制器
  5. 视图解析器(ViewResolver)
      存放前端页面
- 这里Model中的组成成分调用顺序由上层到底层是: service -> dao -> model
- `@RequestParam`: 其存放了http请求中所指定的参数. 参数的值会被转换成方法参数所声明的类型

  ```
  http://www.example.com/pets?petId=1
      @Controller
    public class EditPetForm {

        @RequestMapping(value = "/pets", method = RequestMethod.GET)
        public String setupForm(@RequestParam("petId") int petId) {
            Pet pet = this.clinic.loadPet(petId);
            return "petForm";
        }
    }

  ```
- `@RequestBody`:  http请求的body会被deserialized成某一个java对象.json变成java对象

```
@RequestMapping(path = "/something", method = RequestMethod.PUT)
public void handle(@RequestBody HistoryItem body, Writer writer) throws IOException {
    writer.write(body);
}
```

- `@ModelAttribute`: 将表单属性映射到java模型对象

```
@PostMapping("/owners/{ownerId}/pets/{petId}/edit")
public String processSubmit(@ModelAttribute("pet") Pet pet, BindingResult result) {
    if (result.hasErrors()) {
        return "petForm";
    }
}
```
-
ModelAndView: 用来存储处理完后的结果数据，以及显示该数据的视图。从名字上看ModelAndView中的Model代表模型，View代表视图，这个名字就很好地解释了该类的作用。处理器(controller)调用模型层处理完用户请求后，把结果数据存储在该类的model属性中，把要返回的视图信息存储在该类的view属性中，然后让该ModelAndView返回该Spring MVC框架。框架通过调用配置文件中定义的视图解析器,对该对象进行解析, 最后把结果数据显示在指定的页面上.

void : 如果处理器方法中已经对response响应数据进行了处理（比如在方法参数中定义一个ServletResponse或HttpServletResponse类型的参数并直接向其响应体中写东西），那么方法可以返回void
String: 视图名

`@ResponseBody`: 直接将请求结果以json format的形式返回给客户端


##### Spring Web Flow
- flow： 封装的步骤，引导用户执行具体逻辑。比如买机票，先填写用户信息，再填写信用卡信息，检查订单。这个流程就是一个flow
- 每一步都是一个状态，完成一个状态再进入下一个状态。根据一个状态的情况决定下一个状态是什么
- flow这个东西也可以用controller实现，但是就还是会非常麻烦，状态间的数据转化会非常麻烦只能用url来传递数据。而flow中有一个flow data的概念来集中储存在数据库`<var name="order" class="onlineShop.model.SalesOrder" />`
- 编写flow是只能通过xml写。在checkout.xml中
- xml中需要先定义文档结构

  ```
  http://www.springframework.org/schema/webflow-config
  http://www.springframework.org/schema/webflow-config/spring-webflow-config.xsd">
  ```
- flow registry： A flow registry’s job is to load flow definitions and make them available to the flow executor.在applicationContext中标记flow的xml文件, 定义checkout flow的位置在哪

```
<webflow-config:flow-registry id="flowRegistry" base-path="/WEB-INF/flow">
	<webflow-config:flow-location
			path="/checkout/checkout-flow.xml" id="checkout">
             </webflow-config:flow-location>
</webflow-config:flow-registry>
```
- Wiring a flow executor: The flow executor drives the execution of a flow. When a user enters
a flow, the flow executor creates and launches an instance of the flow execution for
that user. 也是在在applicationContext中

```
<webflow-config:flow-executor
  id="flowExecutor" flow-registry="flowRegistry">
</webflow-config:flow-executor>
```

- Handling flow requests: 告诉前端控制器，checkoutflow都redirect到flow executor这里

```
<bean id="flowHandleMapping"
	class="org.springframework.webflow.mvc.servlet.FlowHandlerMapping">
		<property name="flowRegistry" ref="flowRegistry"></property>
</bean>

<bean id="flowHandlerAdapter"
	class="org.springframework.webflow.mvc.servlet.FlowHandlerAdapter">
		<property name="flowExecutor" ref="flowExecutor"></property>
</bean>
```
- flow的配置总结

```
1. For flows, we need a FlowHandlerMapping to help DispatcherServlet know that it should send flow requests to Spring Web Flow. As you can see, the FlowHandlerMapping is wired with a reference to the flow registry so it knows when a request’s URL maps to a flow.
2. Whereas the FlowHandlerMapping’s job is to direct flow requests to Spring Web Flow, it’s the job of a FlowHandlerAdapter to answer that call.
3. This handler adapter is the bridge between DispatcherServlet and Spring Web Flow. It handles flow requests and manipulates the flow based on those requests. Here, it’s wired with a reference to the flow executor to execute the flows for which it handles requests.
```
- The components of a flow
 1. States-- states are points in a flow where something happens.
 2. Transitions-- transitions connect the states within a flow.
 3. Flow data-- the current condition of the flow. 比如表单中填写的信息
- 状态类型:
  1. 视图，html页面。让用户交互填写内容的
  2. 行为， 用户看不到的逻辑，例如根据用户填写的zipcode来计算出税，这就是action state
  3. 子流程， 一个状态分成几个helper method
  4. 结束
- 怎么写一个状态
  1. view: `<view-state id="welcome" view="greeting.jsp" model=”xxx” />`状态id，view是用户交互的页面是什么
  2. action state:

    ```
    <action-state id="addCartToOrder">
    <evaluate expression="cartDaoImpl.validate(requestParameters.cartId)" result="order.cart" /> //调用helper method， 可以是已有的任何函数。这里是从数据库中获取cartId并将结果存入flowdata order.cart中。cartDaoImpl首字母小写就自动调用CartDaoImpl这个class中的method
    <transition to="invalidCartWarning" on-exception="java.io.IOException" />
    <transition to="collectCustomerInfo" />
    </action-state>
    ```
  3. subflow state

    ```
    <subflow-state id="order" subflow="pizza/order">
        <input name="order" value="order"/> // 将flow data作为参数传入子函数中
        <transition on="orderCreated" to="payment" />
    </subflow-state>

    ```
  4. end state

      The <end-state>  element designates the end of a flow and typically appears like this <end-state id=”endState" />

      What happens next depends on a few factors:
      If the flow that’s ending is a subflow, the calling flow will proceed from the <subflow-state> . The <end-state> ’s ID will be used as an event to trigger the transition away from the <subflow-state>
      If the ending flow isn’t a subflow,  the flow ends.  The browser lands on the flow’s base URL.
  5. Transition

      `<transition on="customerInfoCollected" to="collectShippingDetail" />`
      翻译：当达到"customerInfoCollected"这个state时候(点击next)，跳转到"collectShippingDetail"这个view state页面

      Commonly, transitions are defined to take place on some event.  In a view state, the event is usually an action taken by the user. In an action state, the
      event is the result of evaluating an expression. In the case of a subflow state, the event is determined by the ID of the subflow’s end state.


      The flow can also transition to another state in response to some exception being thrown.

      `<transition to="invalidCartWarning" on-exception="java.io.IOException" />`
  6. 全局transition。
      Sometimes several states share some common transitions, for example,
      `<transition on="cancel" to="endState" />`每一个state点cancel都会使用这个global transitions去end state

      ```
      <global-transitions>
          <transition on="cancel" to="endState" />
      </global-transitions>
      ```
      这个执行的
  7. 声明变量
    - The simplest way to create a variable in a flow is by using the <var> element
      `<var name="order" class="onlineShop.model.SalesOrder" />`
    - As part of an action state or on entry to a view state, you may also create variables using the <evaluate>  element
      `<evaluate expression="cartDaoImpl.validate(requestParameters.cartId)" result="order.cart" />`
- flow 的起始状态
  flow的起点必须放在xml的第一个

  ```
  <action-state id="addCartToOrder"> // 点击添加到购物车时候就执行下面的操作
      <evaluate expression="cartDaoImpl.validate(requestParameters.cartId)" result="order.cart" />
      <transition to="invalidCartWarning" on-exception="java.io.IOException" />
      <transition to="collectCustomerInfo" />
  </action-state>
  ```
- 四种注解

  ```
  @Service用于标注业务层组件

  @Controller用于标注控制层组件（如struts中的action）

  @Repository用于标注数据访问组件，即DAO组件

  @Component泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。
  ```

##### online shop总结和ads integration
- spring security
  Authentication： 验证该用户可不可以访问
  Authorization： 鉴权

  filter- 登陆和鉴权都包括了。都是spring自己实现

  ```
  <filter>
  <filter-name>springSecurityFilterChain</filter-name>
  <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
  </filter>

  <filter-mapping>
  <filter-name>springSecurityFilterChain</filter-name>
  <url-pattern>/*</url-pattern>
  </filter-mapping>
  ```
  还有一部分登陆和鉴权原本写在applicationContext.xml。今天换成用java写在 SecurityConfig
- oauth2 相当于用谷歌账号或者fb账号登陆oauth2相当于登陆，鉴权是由谷歌那边干的
- hIbernate实际上只生成一个sessionFactory。没有其他的了
- spring的问题
  - 部署就直接把maven生成的onlineShop.war拖上aws去就可以
  - What is Spring?
  Spring is an open source development framework for Enterprise Java. The core features of the Spring Framework can be used in developing any Java application, but there are extensions for building web applications on top of the Java EE platform.
  降低依赖关系。不需要new 一个instance。找container要instance

  - What is Spring IoC container? 控制反转容器 WebAplicationContext
  The Spring IoC is responsible for creating the objects,managing them (with dependency injection (DI)), wiring them together, configuring them, as also managing their complete lifecycle.
  创建管理串联对象。ApplicationContainer

  - What is Dependency Injection in Spring?
  反转是相对于正向而言的，那么什么算是正向的呢？考虑一下常规情况下的应用程序，如果要在A里面使用C，你会怎么做呢？当然是直接去创建C的对象，也就是说，是在A类中主动去获取所需要的外部资源C，这种情况被称为正向的。那么什么是反向呢？就是A类不再主动去获取C，而是被动等待，等待IoC/DI的容器获取一个C的实例，然后反向的注入到A类中
  构造函数或者setter注入。autowired就是依赖注入。依赖注入是控制反转的一种手段
  这里A和C必须存在于ioc容器中

  - What are Spring beans & scopes?
  The Spring Beans are Java Objects are instantiated, assembled, and managed by the Spring IoC container.
  spring容器维护的class都叫bean

  @Scope(value="")来修改scope
  默认：In singleton scope, Spring scopes the bean definition to a single instance per Spring IoC container.
  In prototype scope, a single bean definition has any number of object instances.

  - Differentiate @Component, @Repository and @Service and @Controller?
  这样就不用手动在容器中创建对应的bean了，spring会自动给你创建好

  Typically a web application is developed in layers like the controller (which is the initial point of client communication), business (where the actual code or logic of the application is written) and DAO (where the database connections and interaction happens). In such an architecture web application, @Component can be used in any of the layers. Whereas, the @Controller is used in the controller/web layer. @Service is used in the business layer and @Repository is used in the DAO layer.

  - How do you provide configuration metadata to the Spring Container?
  XML based configuration file 比如applicationConfig
  Annotation-based configuration @Component, @Repository and @Service and @Controller
`<context:component-scan base-package="onlineShop"></context:component-scan>`在onlineShop-servlet这个xml加上就会自动去扫上面这四种。等效于java-base中的@ComponentScan(把@component的都生成Bean)
  但是第三方的库不能加这四种，比如hibernate。这种就只能java base来搞。一般project是这两种混用

  Java-based configuration ApplicationConfig.java @configuration, @Bean， @ComponentScan 这种
  @Bean就是返回实例。只能放在方法前。且必须有返回值


  - What is Spring Java-Based Configuration?
  Java based configuration enables you to write most of your Spring configuration without XML but with the help of few Java-based annotations.
  An example is the @Configuration annotation, that indicates that the class can be used by the Spring IoC container as a source of bean definitions. Another example is the @Bean annotated method that will return an object that should be registered as a bean in the Spring application context.


  - What is Spring MVC framework?
  Spring comes with a full-featured MVC framework for building web applications. Spring’s MVC framework uses IoC to provide a clean separation of controller logic from business objects.

  - DispatcherServlet
  The Spring Web MVC framework is designed around a DispatcherServlet that handles all the HTTP requests and responses. 也就是web.xml.请求调配到对应controller上面。web.xml是最基本的配置文件

  - What is Controller in Spring MVC framework?
  Controller handles navigation logic and transfer to service layer

  - @Controller annotation
  The @Controller annotation indicates that a particular class serves the role of a controller. Spring does not require you to extend any controller base class or reference the Servlet API.

  - @RequestMapping annotation
  @RequestMapping annotation is used to map a URL to either an entire class or a particular handler method. map一个url到具体的method
