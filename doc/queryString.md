### Query String

> what is query string?
> it is a part of a url address whatever after "?" is query string

`http//:localhost:8000/bootcamps?location=MA&jobGuarantee=true`

Then how to access this query string in our program 😕

> Express provide easy way to access the query string

```javascript
const query = req.query;
```

Where req.query return a object which contains all the query string

Mongo DB contains some **Comparison Query Operators** and that are `$gt, $lt, $lt` etc

> to get know more refer this link [Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)

> Example

`http//:localhost:8000/bootcamps?avergeCost[lte]=1000`

```javascript
    let queryStr = JSON.stringfy(req.query);

    /*
    below line code adding $ in fron of if it find comparison query operators
    */
    queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`;
    );

    query = JSON.parse(queryStr);

    Schema.find(query);
```

> 🔥 implementing **filter functionality** it super easy with query string and mongo db.
> There is a mongoose function **<span style="color:#3742fa">find()</span>** where you have to pass a object

**<span style="color:#2ed573">Example</style>**

```javascript
const query = req.query;
/*
        query = {"name":"Vishnu","age":"21"}
    */
Model.find(query);
```

> ❗ it only show result if query string contain in database

> #### Selecting a specific fields

`http//:localhost:8000/api/v1/codecamps?select=name,averageCost`

In above query string if try to find the fields (name,averageCost) it treat **select** as filed which result to an empty object

> So how to solve this problem 😕

1. First exclude select from query string
2. Second run excluded query string which is going to pass in **find()** method
3. To select specific filed from database mongoose provide a method which make it easier and that method is **<span style="color:#3742fa">select()</span>** [to more](https://mongoosejs.com/docs/queries.html)

> To get the code about this [select field](https://github.com/vishnuk7/codecamps/commit/0c8d0b0e40ef1abcdbfe364b8bbd3bdfdebfbf8b)

> ❗ select() only aspect arguments with space

```javascript
Model.select("name averageCost");
```

> #### Sorting Data

Sorting data using query string is quite easy 😃 you just need a mongoose mehod know as [**<span style="color:#3742fa">sort()</span>**](https://mongoosejs.com/docs/queries.html)

> http//:localhost:8000/api/v1/codecamps?select=name,averageCost&sort=name

> logic for sorting 🐱 [here](https://github.com/vishnuk7/codecamps/commit/2b6b76cebfa44f03530042fcdc213c328f3025d8)

> #### Pagination

Pagination is one of best features of website
How apps determine page number and it's limits 😕
Mongoose offer a nice method with the help of that method we can create a pagination logic
**<span style="color:#3742fa">skip()</span>**

**<span style="background:#2ed573;color:#fff;padding:10px 12px">Example</span>**

`http://localhost:8000/api/v1/codecamps?page=2&limit=3&select=name,averageCost&sort=name`

In above url there are two query string which have consider for this example `page=2` and `limit=2`
`page=2` this query string tell as about page number and another one `limit=2` which inform our api how much content should display here `limit` is two so api display only two contents in per page

> code for this [here](https://github.com/vishnuk7/codecamps/commit/2b6b76cebfa44f03530042fcdc213c328f3025d8)

we want save next and previous page information and send with json response so it make frontend work easier 😁 **logic** for this is [here](https://github.com/vishnuk7/codecamps/commit/8d7f58e59033988ef466a2cf10776ed8ec21f7d5)
