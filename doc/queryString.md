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

> logic for sorting 🐱 [here](ttps://github.com/vishnuk7/codecamps/commit/ttps://github.com/vishnuk7/codecamps/commit/)

> #### Pagination

Pagination is one of best features of website
How apps determine page number and it's limits 😕
Mongoose offer a nice method with the help of that method we can create a pagination logic
**<span style="color:#3742fa">skip()</span>**

<span style="backgroud-color:#2ed573;color:#fff;">Example</span>
