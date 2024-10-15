---
title: "From Data to Insights: Understanding MongoDB's Aggregate Framework"
description: "When it comes to storing data in MongoDB or any other place, one of the biggest challenges is figuring out how that data will be accessed in the future. What kinds of reports will you need to run? What valuable insights are hidden in your data that could help your business grow? After carefully designing your data schema to fit your application’s needs, the next step is retrieving that data effectively."
pubDate: "Oct 15 2024"
updatedDate: "Oct 15 2024"
heroImage: "https://res.cloudinary.com/dod11j3tx/image/upload/v1728964496/Aggregation_oesdpd.webp"
author: "minhaz"
tags: ["database", "mongodb"]
---

When it comes to storing data in MongoDB or any other place, one of the biggest challenges is figuring out how that data will be accessed in the future. What kinds of reports will you need to run? What valuable insights are hidden in your data that could help your business grow? After carefully designing your data schema to fit your application’s needs, the next step is retrieving that data effectively.

In MongoDB, there are two primary ways to access your data: through the `find()` command and the `aggregate()` command.

### Using find() command

The `find()` command lets you search for documents based on specific conditions. With it, you can:

-   Filter results to get exactly what you need.
-   Make basic changes to the documents you retrieve.
-   Sort your results for better organization.
-   Limit the number of documents returned to keep your output manageable.

</br>

### Entering the World of Aggregation

On the other hand, the `aggregate()` command opens up a whole new level of data analysis through the aggregation framework. But you might wonder, why bother with aggregation in MongoDB at all?

### Why Aggregate with MongoDB?

Aggregation operations in MongoDB allow you to process and analyze your data in powerful ways. They enable you to group values from multiple documents and perform calculations on this grouped data, ultimately returning meaningful results. This feature is incredibly useful when you need to perform analytics across a cluster of servers.

By using the built-in aggregation operators in MongoDB, you can gain valuable insights from your data that help drive business decisions.

```js
db.collection.aggregate(pipeline: [], options: {}) // in this tutorial we only focus on the pipeline stages
```

There are many aggregation stages available in the mongoDB. We will use most common and frequently used stages. Like: `$lookup`, `$unwind`, `$group`, `$sort`, `$project`, `$limit` and `$skip`

So, now let's show an easy example to understand how does aggregate pipeline works.

### Example

Suppose, we have 2 collections inside our mongoDB database. First one is authors and second one is todos. Like this:

```js
// authors collection
[
    { _id: 101, name: "Ron", email: "ron@example.com", age: 39 },
    { _id: 102, name: "Taslima", email: "taslima@example.com", age: 35 }
    { _id: 103, name: "Andres", email: "andres@example.com", age: 37 }
]
```

```js
// todos collection
[
    { _id: 1, title: "Scroll Instagram feed", isComplete: false, authorId: 101 },
    { _id: 2, title: "Use sister's Instagram account", isComplete: true, authorId: 101 },
    { _id: 3, title: "Cook dinner", isComplete: true, authorId: 102 },
    { _id: 4, title: "Wash dishes", isComplete: true, authorId: 102 },
    { _id: 5, title: "Play football", isComplete: true, authorId: 103 }
    { _id: 6, title: "Destroy hater's peace", isComplete: true, authorId: 103 }
    { _id: 7, title: "Sleep", isComplete: false, authorId: 103 }
]
```

Now, we want to get the author details like: name, email, age totalTodoCompleted and todoList of those todos which are completed by authors

```js
// expected result:
[
	{
		_id: 101, // author id
		name: "Ron", // author name
		email: "ron@gmail.com", // author email
		age: 39, // age is just a number
		totalTodoCompleted: 1, // total todo completed by author
		todos: [
			// all completed todos
			{ _id: 2, title: "Use sister's Instagram account" },
		],
	},
	// other author's items ...
];
```

How can we achieve that? Of course we can get that using `find()` command if we uses any mongoDB driver or ODM like mongoose but it will required more than one query and finally we bind all the data together and use it, the performance will drop and in mongoshell it is not possible either. So `aggregate()` will be our most efficient way to get this transformed data without loosing control over data and performance.

### Step 1: $match to filter out completed todos

```js
db.todos.aggregate([
	{
		$match: {
			isComplete: true, // condition
		},
	},
]);
```

This will filter out those data which are not **matched** with the condition.

### Step 2: $lookup to populate author's data from authors collection

```js
db.todos.aggregate([
    {
        $match: {
            isComplete: true,
        },
        {
			$lookup: {
				from: "authors", // collection name
				localField: "authorId", // the field from the todos collection
				foreignField: "_id", // the field from the authors collection
				as: "author", // output array field name
			},
		},
    },
])
```

```js
// expected output
[
	{
		_id: 2,
		title: "Use sister's Instagram account",
		isComplete: true,
		authorId: 101,
		author: [{ _id: 101, name: "Ron", email: "ron@example.com", age: 39 }],
	},
	{
		_id: 3,
		title: "Cook dinner",
		isComplete: true,
		authorId: 102,
		author: [{ _id: 3, title: "Cook dinner", isComplete: true, authorId: 102 }],
	},
	// .......
];
```

### Step 3: $unwind to flat the author array

```js
db.todos.aggregate([
    {
        $match: {
            isComplete: true,
        },
        {
			$lookup: {
				from: "authors",
				localField: "authorId",
				foreignField: "_id",
				as: "author",
			},
		},
        {
			$unwind: "$author",
		},
    },
])
```

```js
// expected output
[
	{
		_id: 2,
		title: "Use sister's Instagram account",
		isComplete: true,
		authorId: 101,
		author: { _id: 101, name: "Ron", email: "ron@example.com", age: 39 }, // array to object
	},
	{
		_id: 3,
		title: "Cook dinner",
		isComplete: true,
		authorId: 102,
		author: { _id: 3, title: "Cook dinner", isComplete: true, authorId: 102 }, // array to object
	},
	// .......
];
```

### Step 4: $group by author

```js
db.todos.aggregate([
    {
        $match: {
            isComplete: true,
        },
        {
			$lookup: {
				from: "authors",
				localField: "authorId",
				foreignField: "_id",
				as: "author",
			},
		},
        {
			$unwind: "$author",
		},
        {
            $group: {
                _id: "$authorId", // group by author id
                name: { $first: "$author.name" }, // as we creating a group with todos, so we can choose the first name, email and age from author from the sub-group. as the second name email and age will be the same cause it's under the same sub-group
                email: { $first: "$author.email" },
                age: { $first: "$author.age" },
                totalTodoCompleted: { $sum: 1 }, // increment (+1) by 1 for each todo
                todos: { $push: { _id: "$_id", title: "$title" } } // push all the todos with specific fields
            }
        }
    },
])
```

```js
// expected output
[
	{
		_id: 101, // author id
		name: "Ron", // author name
		email: "ron@gmail.com", // author email
		age: 39, // age is just a number
		totalTodoCompleted: 1, // total todo completed by author
		todos: [
			// all completed todos
			{ _id: 2, title: "Use sister's Instagram account" },
		],
	},
	// other author's items ...
];
```

### Step 5: $project (Optional) (select fields to show)

```js
db.todos.aggregate([
    {
        $match: {
            isComplete: true,
        },
        {
			$lookup: {
				from: "authors",
				localField: "authorId",
				foreignField: "_id",
				as: "author",
			},
		},
        {
			$unwind: "$author",
		},
        {
            $group: {
                _id: "$authorId",
                name: { $first: "$author.name" },
                email: { $first: "$author.email" },
                age: { $first: "$author.age" },
                totalTodoCompleted: { $sum: 1 },
                todos: { $push: { _id: "$_id", title: "$title" } }
            }
        },
        {
            $project: {
                // show only those fields in the final result
				_id: 1,
				name: 1,
				email: 1,
				totalTodoCreated: 1,
				todos: 1,
			},
        }
    },
])
```

```js
// expected output without age field
[
	{
		_id: 101, // author id
		name: "Ron", // author name
		email: "ron@gmail.com", // author email
		totalTodoCompleted: 1, // total todo completed by author
		todos: [
			// all completed todos
			{ _id: 2, title: "Use sister's Instagram account" },
		],
	},
	// other author's items ...
];
```

### Step 6: $limit and $skip (Final code)

```js
db.todos.aggregate([
    {
        $match: {
            isComplete: true,
        },
        {
			$lookup: {
				from: "authors",
				localField: "authorId",
				foreignField: "_id",
				as: "author",
			},
		},
        {
			$unwind: "$author",
		},
        {
            $group: {
                _id: "$authorId",
                name: { $first: "$author.name" },
                email: { $first: "$author.email" },
                age: { $first: "$author.age" },
                totalTodoCompleted: { $sum: 1 },
                todos: { $push: { _id: "$_id", title: "$title" } }
            }
        },
        {
            $project: {
				_id: 1,
				name: 1,
				email: 1,
				totalTodoCreated: 1,
				todos: 1,
			},
        },
        {
            // Step to skip documents for pagination
            $skip: (1 - 1) * 5 // Skip the number of documents based on the page number
            // (page - 1) * limit
        },
        {
            // Step to limit the number of documents returned
            $limit: 5 // Limit the results to the specified page size
        }
    },
])
```

`$skip` and `$limit` will truncate the data based on their data

### Short summary of every steps

-   **$lookup:** Joins todos with authors based on authorId.
-   **$unwind:** Flattens the author array to have one author per todo.
-   **$group:** Groups todos by authorId, counts the total todos, and collects todos into an array.
-   **$project:** (Optional) Restructures the output to show only the necessary fields.
-   **$skip and $limit:** Limit and skip the results to the specified values

</br>

This complete pipeline allows you to get a summarized view of todos grouped by authors along with their details.
