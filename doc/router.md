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
