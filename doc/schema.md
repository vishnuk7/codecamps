<style>
    .box{
        padding:10px 20px;
        background-color:#eccc68;
        color:#ffa50;
    }
</style>

### Sehema

> #### Create a collection in Mongo DB using mongoose

Actually creating a collection is pretty easy with the help of mongoose

```javascript
const ModelSchema = new mongoose.Schema({
  name: {
    type: string,
    required: [true, "Please enter your name"],
  },
});
```

For creating a collection we use `mongoose.Schema()` method we have to pass object as an argument into that and that objects define as a field of that collection

```javascrtpt
    name: {
    type: string,
    required: [true, "Please enter your name"],
     }
```

every field is an object when pass into `mongoose.Schema()` and `name` is field name of collection it also an **object** where we define the rules for this field like `type:string` which tell that value for this field must be string and there are more rules we can define for field

<div class="box">💡 required is a property, where we assign an array in that array where we pass two values one is boolen and another one is string.String value must tell about error message so it is very handy when we are doing error handling</div>

```javascript
module.exports = mongoose.model("Course", CourseSchema);
```

In above we are doing two things one is exporting the model and creating collection into mongo db

> 😎 connecting two collection together

```javascript
 bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  }
```

<span class="box">ref is collection name where you wanr to connect</span>
