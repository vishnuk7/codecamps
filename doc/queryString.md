### Query String

> what is query string?
> it is a part of a url address whatever after "?" is query string

`http\\:localhost:8000\bootcamps?location=MA&jobGuarantee=true`

Then how to access this query string in our program 😕

> Express provide easy way to access the query string

```javascript
const query = req.query;
```

Where req.query return a object which contains all the query string

Mongo DB contains some **Comparison Query Operators** and that are `$gt, $lt, $lt` etc

> to get know more refer this link [Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)

> Example

`http\\:localhost:8000\bootcamps?avergeCost[lte]=1000`

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
