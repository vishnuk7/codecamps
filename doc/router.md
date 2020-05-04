### Route and Controller

There are two routes

1. `http://localhost:8000/api/v1/codecamps/5e96cf62e7cbf120e9abc4e0/coures`
2. `http://localhost:8000/coures`

both routes are going two using same controller function to execute.Now an question rise how? 😕
Soultion for this is params

```javascript
if (req.params.codecampsId) {
  query = Course.find({ bootcamps: req.params.bootcamps });
} else {
  query = Course.find();
}
```

> Simple logic ☺ if there is params with codecampsId then it going return a course of that bootcamps

`/coure`
program is runing fine for above endpoint but it is not giving an error for another endpoint
problem is that it is not able find that endpoint /`codecamps/:codecampsId/coures`

> If there is problem then there will be some solution
> To solve this problem best solution is using resource re route

Inside codecamps router file we are going to re-route to course route file

`router.use("/:codecampsId/coures",couresRouter)`

To work this we have to write one line of code into course router file. `So tell me what is that code ❓`

```javascript
const router = express.Router({ mergeParams: true });
```

We have to pass an object with property of mergeParams with the boolean value `true` in `Router()` method

#### Populate Method

populate() function in mongoose is used for populating
the data inside the reference.

```javascript
query = Model.find().populate(CollectionName);
```

In above code your are populating with entire collection but if you want a specfic document then how you can do it 😕. Yep, there is way 🚀

```javascript
query = Model.find().populate({
  path: "Collection Name",
  select: "field name1, field name2",
});
```

Can you guess what above code is doing?Yep! you are correct we are populating with specific fields

#### Virtuals

In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.

code for virtuals [here](https://github.com/vishnuk7/codecamps/commit/8f5c305bff284596f7d3f6447d9bcfaaad2a892b)

#### Cascade delete coures when a bootcamp is deleted

If you are doing programing for while then you might know what is **cascade delete** code for this [here](https://github.com/vishnuk7/codecamps/commit/c1f9da4fee65b6b66a8a0d2d709fd4247278da23) for implementing cascade delete you create a middleware

```javascript
Model.findByIdAndDelete(id);
```

this is normal way you to use delete document from collection but there is one problem with this method 😕 you can't invoke the cascade middleware that we created.
So how you are going to invoke the middleware for that refer [here](https://github.com/vishnuk7/codecamps/commit/0d1dd3985df137b9ea508980516a511b70cab602)

```javascript
const bootcamp = Model.findBy(id);
bootcamp.remove(); //This invoke the middleware
```

#### Add course

To view code 👉 [here](https://github.com/vishnuk7/codecamps/commit/c9c7b472e362d15f96f4df162b78f2a3851d7099)

For adding we are using this end `api/v1/codecamps/:codecampsId/courses`

Inside bootcamps controller we are re-routing into course controler here we cand add if bootcamp exist otherwise it is going to give an error

#### Update course

To view code 👉 [here](https://github.com/vishnuk7/codecamps/commit/3d3c2f4a2f1a131489a9a2a90007b137b951bcae)

For updating database we use a mongoose method which is know as `findByIdAndUpdate()`

```javascript
Model.findByIdAndUpdate("id", "data", {
  new: true,
  runValidators: true,
});
```

In this method we pass id of **document**, **data** and some addtional properties and here we are passing two properties one is `new` with the value of `true` and another one is `runValidators` with the value of `true`.

Now a question rise what these additional properties are doing **just google it**
