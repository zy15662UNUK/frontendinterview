- 数据库有几张表，分别有什么作用
  - item.储存用户搜索时从ticket master获取的内容。然后根据用户收藏内容id获取用户收藏内容时候就从这张表中搜索内容 内容包含 item_id nme rating address image_url url distance
  - users 储存用户信息的表 user_id password first_name last_name
  - category 储存item种类的表。储存item_id - category的关系。item_id可以重复 因为一个id可以对应很多category 所以单独开这张表来储存。获取item的categories时候就从这张表获取.因 item_id category
  - History (favored) 储存用户收藏内容的关系表，储存user_id-item_id关系对 user 可重复。获取用户收藏id时候就从这张表中获取内容。 user_id item_id lat_favor_time
  - MAMP 较mysql使用命令行操作，拥有一个php写的ui可以方便直接操作数据库
- db
  - DBConnection interface： http://www.runoob.com/java/java-interfaces.html. 规定了如下接口
    1. close
    2. setFavoriteItems(String userId, List<String> itemIds
    3. unsetFavoriteItems(String userId, List<String> itemIds)
    4. Set<String> getFavoriteItemIds(String userId)
    5. Set<Item> getFavoriteItems(String userId)
    6. Set<String> getCategories(String itemId)
    7. List<Item> searchItems(double lat, double lon, String term)
    8. saveItem(Item item)
    9. String getFullname(String userId)
    10. boolean verifyLogin(String userId, String password)
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

- db.mysql8
  - MySQLDBUtil.java 提供一些建立MySQL的链接所用的一些常量参数
  - MySQLTableCreation.java //用程序来和数据库建立连接并在其中创建表
  - MySQLConn8ction： 实现了DBConnection接口。运用MySQL增删改查数据库的各个表。同时将调用Ticketmaster的代码在这里实现
- entity
  - Item: item对象。用于存储每个活动的具体信息(需要返还给前端的信息) 以及一个转成JSON对象方法

- external
  - Geohash: 将经纬度信息哈希成geopoint的一个辅助class
  - TickMasterAPI：接收经纬度和搜索关键字，调用Geohash处理经纬度。向Ticket master发送请求来获取活动信息。筛选里面的活动信息并将每个活动变成一个Item对象。最后返回一个Item 对象的List

  - rpc:
    - RpcHelper: 接受JSONObject or JSONArray并通过response将接受的东西转换成json字符串返回给前端。将前端的JSON字符串变成JSON对象
    - SearchItem: 前端搜索附近活动的接口。接收到前端请求后根据前端发来的经纬度信息来调用 MySQLConnection来获取附近的信息并转成json字符串回应给前端。
    - ItemHistory: 前端增删查喜欢的活动的api。调用MySQLConnection里面的setFavoriteItems和unsetFavoriteItems操作
    - Login: 查看/创建一个session并返回给用户
    - Logout: 删除这个用户的session并跳转回主页
    - ReccommendItem: get推荐的API接口。调用algorithm里面的Georecommendation获取events。包装成json array返回给前端
    -
  - algorithm
    - Georecommendation: 接受前端传来的用户id和经纬度来生成并返回给该用户的推荐活动。分三步
      1. 根据用户id，获取所有的被用户收藏的活动的id  MySQLConnection 的connection.getFavoriteItemIds(userId)
      2. 根据这些活动id，从数据库中获取所有的该id的categories。MySQLConnection的connection.getCategories(favoritedItemId)。并且统计每个category出现次数装在哈希表中。然后将哈希表变成一个List，根据出现次数从大到小排序
      3. 根据排好序的categories，调用connection.searchItems(lat, lon, category.getKey()) 来调用ticketmaster的api搜索这个category和用户经纬度的对应的活动。将这些活动加入返回的list中。这里需要用一个set去重




- tomcat是什么:
  Tomcat is an environment to run your web service, it provides low level support such as making TCP connection, receiving request from client, finding correct service to handle that request, and sending response back.

- java servlet是什么:
  Java Servlet: Java class to handle RPC on server side

- RPC(Remote Procedure Call)是什么:
  a function call to a remote server。根据请求的url调用对应的函数
  Using HTTP url to indicate which service and data a client want to use and what kind of data they request.

- 什么是RESTful
  Design of our application: RESTful API
  Using HTTP methods to indicate what kind of operation a client want to take
  Using HTTP url to indicate which service and data a client want to use and what kind of data they request.
  Server is stateless. Every request is separated, there is no support for doing one post request in several post requests, or doing a delete in a pair of get and post requests.
- Reccommendtion
  - content based recommendation
  - Given item profiles (category, price, etc.) of your favorite, recommend items that are similar to what you liked before.
  - The categories come from the TickMasterAPI

- Java API
  - URLEncoder.encode：用户输入的keyword需要转码才能放进url `keyword = URLEncoder.encode(keyword, "UTF-8");`
  - String.format来拼接字符串`String query = String.format("apikey=%s&geoPoint=%s&keyword=%s&radius=50", API_KEY, geoHash, keyword);`
  - java.net.URL; 用来建立和一个URL的链接 `new URL(URL+"?"+query).openConnection();`
  - java.net.HttpURLConnection; 上面的URL链接需要cast成这种形式的 `HttpURLConnection connection = (HttpURLConnection) new URL(URL+"?"+query).openConnection();`
  - `connection.setRequestMethod("GET");`设置链接的请求方法
  - `connection.getInputStream()` 获取请求返回的数据
  - java.io.InputStreamReader: 读取全部的服务器返回数据
  - BufferedReader 逐行读取服务器返回数据，具体使用是:
  先用BufferedReader读取InputStreamReader的内容。然后创建一个StringBuilder用来将结果变成字符串。
  使用while循环反复调用StringBuilder.readLine();

  ```
  BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
  StringBuilder response = new StringBuilder();
  String inputLine; //将string拼成字符串
  while ((inputLine = in.readLine()) != null) {
  	response.append(inputLine);
  }
  in.close();
  ```

  - StringBuilder.toString: 将拼好的字符串换成字符格式
  - JSONObject将字符串的json转成java的json对象
  - JSONObject.getJSONObject()获取json对象, JSONObject.getJSONArray();获取jsonarray
  - java builder： 当输入参数特别多的时候。可以将输入参数封装到一个static类里面, 这个类就是builder类，定义在主类中

  ```
  public class Item {
    ...定义private变量,getter函数
    public Item (ItemBuilder builder) {
      this.xx = builder.xx;
    }
    public static class ItemBuilder {
      ...定义private变量,setter函数
      public Item build () {
        return new Item(this);
      }
    }
  }

  ItemBuilder itemBuilder = new ItemBuilder();
  itemBuilder.setName()
  itemBuilder.setItemId();
  Item item = itemBuilder.build();
  ```
  由于itembuilder是static类，不需要实例化Item就可以调用。通过itembuilder中的setter函数给itembuilder赋值。然后调用itembuilder中的build函数来返回一个Item对象实例，输入是this也就是ItemBuilder
  item自己的构造函数是一个private的方法，用于接受传入的this(也就是ItemBuilder类)。因为ItemBuilder定义在Item内，所以里面的private内容可以用`builder.xx`访问
  - JSONObject/getJSONArray的API：
    1. JSONObject.getJSONObject(key)
    2. JSONObject.getJSONArray(key)
    3. JSONArray.getJSONObject(id)
    4. JSONObject.getString(key)
    5. JSONObject.getDouble(key)
    6. JSONObject.put(key, value)
    7. JSONObject.isNull(key);
    8. JSONArray.length()

  - StringBuilder API:
    StringBuilder sb = new StringBuilder();
    1. StringBuilder.append()
    2. StringBuilder.toString()

  - HashSet: Set<String> categories = new HashSet<>();
    1. HashSet.add(value)






- database
  - item.储存用户搜索时从ticket master获取的内容。然后根据用户收藏内容id获取用户收藏内容时候就从这张表中搜索内容
  - users 储存用户信息的表
  - category 储存item种类的表。储存item_id - category的关系。item_id可以重复。获取item的categories时候就从这张表获取
  - History (favored) 储存用户收藏内容的关系表，储存user_id-item_id关系对 user 可重复。获取用户收藏id时候就从这张表中获取内容。
  - MAMP 较mysql使用命令行操作，拥有一个php写的ui可以方便直接操作数据库
  - 关系型数据库 VS 非关系型数据库
    1. 前者一定有行列大小限制。也就是每张表行列数目必须一致
    2. 前者支持一致性。利于分布式储存。一台机器修改其他机器可以很快同步
  - MAMP stands for：My Apache, MySQL, and PHP
  - apache 和 nginx是两个general的http server， 项目中用的tomcat是专门用于java的
  - ER (entity-relationship) model:
    Entity 实体内容，比如用户 课程
    Relation: connect different entities。 两个entity之间关系，比如哪个用户买了哪个课程

  - Table: a collection of attributions. Similar to what you’ve seen in an excel chart. Each column is an attribute of an entity, and each row is a record/instance of an entity.。例如用户就是一个table。某一类相同特质的数据

  - 行：每行代表用户中某个人
  - 列 每列代表一个属性。比如用户性别
  - Schema: blueprint of how table is constructed.对二维表格的定义或者限制，比如用户id不能重复。一共有多少列。密码这一列不能是空等等。是关系型数据库的必要条件
  - item的列的个数和item对象中数据个数相对应
  - category - store item-category relationship。但是注意categories本身是一个set，一个item可能有多个分类。不方便直接存在一个格子中。所以将categories变成一个额外的table。有多个categories的item就分成几行写就好了
  - history - store user favorite history 存储的是实体和实体间关系，某个用户收藏某个活动。这里用户和活动id都是可以重复的

  - 以下概念都是基于列的

    - Unique key: a key in a relational database that is unique for each record. 这样这一列数据是不能重复的。但是可以是空或者NULL，且空和空之间不算重复。

    - Primary key: Also a key that is unique for each record. Cannot be NULL and used as a unique identifier. 也是声明在某一列上。较unique key 要求更多。不仅不能重复，还不能是空。比如user中的user_id就是primary key。item中item_id就是primary key。categories中 primary key = item_id + category两列合并成一个primary key。或者再来一列当作primary key. history 表 也是 primary key = user_id + item_id

    - Foreign key: a key used to link two tables together. A FOREIGN KEY is a field (or collection of fields) in one table that refers to the PRIMARY KEY in another table. 声明在某一列。比如history中声明user_id是foreign key。那么每个值就是指向user中的primary key，也就是相同user_id对应的那个行。user_id在users这个table里是primary key，在history里是foreign。所以每一个foreign key必须在其他表中存在

    - Index: improves the speed of data retrieval operations on a database table at the cost of additional writes and storage space to maintain the index data structure. MySQL will create index on column which is declared as key. 声明某一列是某种key。那么这一列每一项都有一个对应的index。加快搜索效率

    - MySQL基本语句：
      - 删除存在的列表 DROP TABLE IF EXISTS table_name; 注意删除操作执行有顺序的。要先删除foreign key的table。再删除被foreign key引用的table。否则会报错
      - 创建列表

        ```
        sql = "CREATE TABLE items ("
    					+ "item_id VARCHAR(255) NOT NULL,"
    					+ "name VARCHAR(255),"
    					+ "rating FLOAT,"
    					+ "address VARCHAR(255),"
    					+ "image_url VARCHAR(255),"
    					+ "url VARCHAR(255),"
    					+ "distance FLOAT,"
    					+ "PRIMARY KEY (item_id)"
    					+ ")";
        ```
        - mysql 查询： `SELECT 查询的列名 FROM 表名 WHERE primary key = ?`
        - MySQL 删除： `DELETE FROM history WHERE user_id = ? AND item_id = ?`
        - MySQL 插入： `INSERT IGNORE INTO items VALUES (?, ?, ?, ?, ?, ?, ?)`INSERT IGNORE表明不会插入数据库中已经有的
                      `INSERT IGNORE INTO history(user_id, item_id) VALUES (?, ?)`这里写出具体要插入的列
        - PreparedStatement:
          - `PreparedStatement ps = conn.prepareStatement(sql); `
          - `ps.setString(第几个问号, 变量值);`
          - `ps.execute();`Executes the SQL statement in this PreparedStatement object, return boolean
          - `ResultSet rs = statement.executeQuery();`Executes the SQL query in this PreparedStatement objectand returns the ResultSet object generated by the query
          - 在java中编写程序建立和sql连接并执行MySQL语句

            ```
            Class.forName("com.mysql.cj.jdbc.Driver").getConstructor().newInstance();
            Connection conn = DriverManager.getConnection(MySQLDBUtil.URL);

            Statement stmt = conn.createStatement();
            String sql = "DROP TABLE IF EXISTS categories"; // mysql删除table的语句
            stmt.executeUpdate(sql);
            ```
            注意这里URL是数据库的url，组成是：

            ```
              URL = "jdbc:mysql://"
                  + HOSTNAME + ":" + PORT_NUM + "/" + DB_NAME
                  + "?user=" + USERNAME + "&password=" + PASSWORD
                  + "&autoReconnect=true&serverTimezone=UTC";
            ```
